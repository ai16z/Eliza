import { describe, it, expect, beforeEach } from 'vitest';
import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from '@elizaos/core';
import { exchangeActions } from '../src/actions/exchange.actions';
import { infoActions } from '../src/actions/info.actions';
import { OrderRequest } from '../src/types/api';

describe('Spot Trading', () => {
    let runtime: IAgentRuntime;
    let callback: HandlerCallback;
    let message: Memory;
    let state: State;
    let lastResponse: any = null;

    beforeEach(() => {
        // Skip tests if private key is not set
        if (!process.env.HYPERLIQUID_PRIVATE_KEY || !process.env.HYPERLIQUID_WALLET_ADDRESS) {
            console.warn('Skipping spot tests: HYPERLIQUID_PRIVATE_KEY or HYPERLIQUID_WALLET_ADDRESS not set');
            return;
        }

        // Setup callback to store responses
        callback = (response: any) => {
            lastResponse = response;
            return Promise.resolve([]);
        };

        // Setup message and state
        message = { content: { text: '' } } as Memory;
        state = {} as State;

        // Setup runtime with environment variables
        runtime = {
            getSetting: (key: string): string | null => {
                switch (key) {
                    case 'HYPERLIQUID_PRIVATE_KEY':
                        return process.env.HYPERLIQUID_PRIVATE_KEY || null;
                    case 'HYPERLIQUID_WALLET_ADDRESS':
                        return process.env.HYPERLIQUID_WALLET_ADDRESS || null;
                    case 'HYPERLIQUID_BASE_URL':
                        return 'https://api.hyperliquid.xyz';
                    case 'HYPERLIQUID_NETWORK':
                        return 'mainnet';
                    default:
                        return null;
                }
            }
        } as IAgentRuntime;
    });

    describe('PURR/USDC Trading', () => {
        it('should place and cancel a limit order for PURR', async () => {
            if (!process.env.HYPERLIQUID_PRIVATE_KEY || !process.env.HYPERLIQUID_WALLET_ADDRESS) {
                return;
            }

            // 1. Get current PURR price
            const getMidsAction = infoActions.find(a => a.name === 'getAllMids');
            expect(getMidsAction).toBeDefined();

            const midsResult = await getMidsAction!.handler(runtime, message, state, {}, callback);
            expect(midsResult).toBe(true);
            expect(lastResponse).toBeDefined();

            const mids = lastResponse?.content;
            const purrPrice = parseFloat(mids?.PURR || '0');
            expect(purrPrice).toBeGreaterThan(0);

            // 2. Place a limit buy order for PURR
            // Fixed size and price to meet minimum value of $10
            const orderSize = 50; // 50 PURR * $0.34 ≈ $17
            const limitPrice = 0.34; // $0.34 per PURR (slightly below current price)
            console.log('Placing order:', { orderSize, limitPrice, purrPrice });

            const placeOrderAction = exchangeActions.find(a => a.name === 'placeOrder');
            expect(placeOrderAction).toBeDefined();

            const orderRequest = {
                orders: [{
                    coin: 'PURR',
                    is_buy: true,
                    sz: orderSize,
                    limit_px: limitPrice,
                    order_type: { limit: { tif: 'Gtc' } },
                    reduce_only: false
                }]
            };
            console.log('Order request:', JSON.stringify(orderRequest, null, 2));

            const placeResult = await placeOrderAction!.handler(runtime, message, state, { request: orderRequest }, callback);
            expect(placeResult).toBe(true);
            expect(lastResponse).toBeDefined();
            console.log('Order placement response:', JSON.stringify(lastResponse, null, 2));

            // Add a small delay to allow the order to be processed
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Verify the order was placed
            const getOrdersAction = infoActions.find(a => a.name === 'getOpenOrders');
            expect(getOrdersAction).toBeDefined();

            const ordersResult = await getOrdersAction!.handler(runtime, message, state, {
                address: process.env.HYPERLIQUID_WALLET_ADDRESS
            }, callback);
            expect(ordersResult).toBe(true);
            expect(lastResponse).toBeDefined();
            console.log('Open orders response:', lastResponse);

            const openOrders = lastResponse?.content;
            expect(Array.isArray(openOrders)).toBe(true);
            expect(openOrders.length).toBeGreaterThan(0);

            // Cancel all open orders for PURR
            const cancelOrderAction = exchangeActions.find(a => a.name === 'cancelOrder');
            expect(cancelOrderAction).toBeDefined();

            if (lastResponse?.content?.length > 0) {
                for (const order of lastResponse.content) {
                    const cancelRequest = {
                        request: {
                            coin: order.coin,
                            oid: order.oid
                        }
                    };

                    const cancelResult = await cancelOrderAction!.handler(runtime, message, state, cancelRequest, callback);
                    if (cancelResult) {
                        console.log(`Cancelled order ${order.oid}`);
                    } else {
                        const error = lastResponse?.content?.error;
                        if (error && error.includes('Order not found')) {
                            console.log(`Order ${order.oid} was already cancelled or filled`);
                            // Consider this a success since the order is not active
                            expect(true).toBe(true);
                        } else {
                            console.log(`Failed to cancel order ${order.oid}:`, error);
                            expect(false).toBe(true); // Fail test if cancellation failed for other reasons
                        }
                    }
                }
            }

            // Verify all orders are cancelled
            const finalOrdersResult = await getOrdersAction!.handler(runtime, message, state, {
                address: process.env.HYPERLIQUID_WALLET_ADDRESS
            }, callback);
            expect(finalOrdersResult).toBe(true);
            expect(lastResponse).toBeDefined();
            console.log('Final orders response:', lastResponse);

            const finalOrders = lastResponse?.content;
            expect(Array.isArray(finalOrders)).toBe(true);
            const remainingPurrOrders = finalOrders.filter(order => order.coin === 'PURR');
            expect(remainingPurrOrders.length).toBe(0);
        });
    });
});