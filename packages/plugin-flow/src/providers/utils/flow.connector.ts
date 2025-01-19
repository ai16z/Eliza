import * as fcl from "@onflow/fcl";
import type { Account, TransactionStatus } from "@onflow/typedefs";
import type { IFlowScriptExecutor } from "../../types";
import Exception from "../../types/exception";

export type NetworkType = "mainnet" | "testnet" | "emulator";

let isGloballyInited = false;
let globallyPromise = null;

export class FlowConnector implements IFlowScriptExecutor {
    /**
     * Initialize the Flow SDK
     */
    constructor(
        private readonly flowJSON: object,
        public readonly network: NetworkType = "mainnet",
        private readonly defaultRpcEndpoint: string = undefined
    ) {}

    /**
     * Get the RPC endpoint
     */
    get rpcEndpoint() {
        switch (this.network) {
            case "mainnet":
                return this.defaultRpcEndpoint ?? "https://mainnet.onflow.org";
            case "testnet":
                return "https://testnet.onflow.org";
            case "emulator":
                return "http://localhost:8888";
            default:
                throw new Exception(
                    50000,
                    `Network type ${this.network} is not supported`
                );
        }
    }

    /**
     * Initialize the Flow SDK
     */
    async onModuleInit() {
        if (isGloballyInited) return;

        const cfg = fcl.config();
        // Required
        await cfg.put("flow.network", this.network);
        // Set the maximum of gas limit
        await cfg.put("fcl.limit", 9999);
        // Set the RPC endpoint
        await cfg.put("accessNode.api", this.rpcEndpoint);
        // Load Flow JSON
        await cfg.load({ flowJSON: this.flowJSON });

        isGloballyInited = true;
    }

    /**
     * Ensure the Flow SDK is initialized
     */
    private async ensureInited() {
        if (isGloballyInited) return;
        if (!globallyPromise) {
            globallyPromise = this.onModuleInit();
        }
        return await globallyPromise;
    }

    /**
     * Get account information
     */
    async getAccount(addr: string): Promise<Account> {
        await this.ensureInited();
        return await fcl.send([fcl.getAccount(addr)]).then(fcl.decode);
    }

    /**
     * General method of sending transaction
     */
    async sendTransaction(
        code: string,
        args: fcl.ArgumentFunction,
        mainAuthz?: fcl.FclAuthorization,
        extraAuthz?: fcl.FclAuthorization[]
    ) {
        await this.ensureInited();
        if (typeof mainAuthz !== "undefined") {
            return await fcl.mutate({
                cadence: code,
                args: args,
                proposer: mainAuthz,
                payer: mainAuthz,
                authorizations:
                    (extraAuthz?.length ?? 0) === 0
                        ? [mainAuthz]
                        : [mainAuthz, ...extraAuthz],
            });
        } else {
            return await fcl.mutate({
                cadence: code,
                args: args,
            });
        }
    }

    /**
     * Get transaction status
     */
    async getTransactionStatus(
        transactionId: string
    ): Promise<TransactionStatus> {
        await this.ensureInited();
        return await fcl.tx(transactionId).onceExecuted();
    }

    /**
     * Get chain id
     */
    async getChainId() {
        await this.ensureInited();
        return await fcl.getChainId();
    }

    /**
     * Send transaction with single authorization
     */
    async onceTransactionSealed(
        transactionId: string
    ): Promise<TransactionStatus> {
        await this.ensureInited();
        return fcl.tx(transactionId).onceSealed();
    }

    /**
     * Get block object
     * @param blockId
     */
    async getBlockHeaderObject(
        blockId: string
    ): Promise<fcl.BlockHeaderObject> {
        await this.ensureInited();
        return await fcl

            .send([fcl.getBlockHeader(), fcl.atBlockId(blockId)])
            .then(fcl.decode);
    }

    /**
     * Send script
     */
    async executeScript<T>(
        code: string,
        args: fcl.ArgumentFunction,
        defaultValue: T
    ): Promise<T> {
        await this.ensureInited();
        try {
            const queryResult = await fcl.query({
                cadence: code,
                args,
            });
            return (queryResult as T) ?? defaultValue;
        } catch (e) {
            console.error(e);
            return defaultValue;
        }
    }
}

export default FlowConnector;
