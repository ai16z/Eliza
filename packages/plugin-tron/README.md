# @elizaos/plugin-tron

Core Tron blockchain plugin for Eliza OS that provides essential services and actions for token operations, trading, and DeFi integrations.

## Description

The TRON plugin provides comprehensive functionality for interacting with TRON blockchain, including token transfers, cross-chain bridging, and token swaps using Symbiosis integration.

## Features

- Native token transfers
- Cross-chain token bridging via Symbiosis
- Token swapping on Sunswap
- Wallet balance tracking
- Custom RPC endpoint configuration
- Automatic retry mechanisms

## Installation

```bash
pnpm install @elizaos/plugin-tron
```

## Configuration

### Required Environment Variables

```env
# Required
TRON_PRIVATE_KEY=your-private-key-here

# Optional - Custom RPC URLs
TRON_PROVIDER_URL=https://your-custom-tron-rpc-url
```

### Custom RPC URLs

By default, the RPC URL is inferred from the `viem/chains` config. To use a custom RPC URL add the following to your `.env` file:

```env
TRON_PROVIDER_URL=https://your-custom-tron-rpc-url
```

**Example usage:**

```env
TRON_PROVIDER_URL=https://tron-network.rpc.thirdweb.com
```

## Provider

The **Wallet Provider** initializes with the **TRON**. It:

- Provides the **context** of the currently connected address and its balance.
- Creates **Public** and **Wallet clients** to interact with the supported chains.

## Actions

### 1. Transfer

Transfer native tokens on the same chain:

```typescript
// Example transfer 100 TRX from the connected address to another address
const message: Memory = {
    content: {
        text: "Send 100 TRX  to TH9husb1dF7q8KSe7PVdmZYKqfnuYw5KWL",
        action: transferAction.name,
    },
    agentId: runtime.agentId,
    userId: stringToUuid("test"),
    roomId: stringToUuid("test"),
};

const state = await runtime.composeState(message);
const result = await runtime.processActions(message, [message], state);
```

### 2. Bridge

Bridge tokens between different chains using Symbiosis:

```typescript
// Example Bridge 10 USDC from TRON to ETH
const message: Memory = {
    content: {
        text: "Bridge 10 USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t) on TRON to USDC (0xdAC17F958D2ee523a2206206994597C13D831ec7) on Ethereum Mainnet to the address: 0xE11F5d4835B1EAe5E73Be3B516AC8a9A70Be5091",
        action: bridgeAction.name,
    },
    agentId: runtime.agentId,
    userId: stringToUuid("test"),
    roomId: stringToUuid("test"),
};
const state = await runtime.composeState(message);
const result = await runtime.processActions(message, [message], state);
```

### 3. Swap

Swap tokens on the same chain using SunSwap:

```typescript
// Example: Swap 10 TRX for USDT on TRON
const message: Memory = {
    content: {
        text: "Swap 10 TRX to MOON (TJWbDxjh6WeWAFVUGrNx4vMa6YgJnTFNEf)",
        action: swapAction.name,
    },
    agentId: runtime.agentId,
    userId: stringToUuid("test"),
    roomId: stringToUuid("test"),
};

const state = await runtime.composeState(message);
const result = await runtime.processActions(message, [message], state);
```

## Development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm build
```

4. Run tests:

```bash
pnpm test
```

## API Reference

### Core Components

1. **WalletProvider**

    - Manages wallet connections
    - Manages RPC endpoints
    - Tracks balances

2. **Actions**
    - TransferAction: Native token transfers
    - BridgeAction: Cross-chain transfers
    - SwapAction: Same-chain token swaps
