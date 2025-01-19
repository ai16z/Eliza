import type * as fcl from "@onflow/fcl";
import type { Account } from "@onflow/typedefs";

export interface IFlowScriptExecutor {
    /**
     * Execute a script
     * @param code Cadence code
     * @param args Cadence arguments
     */
    executeScript<T>(
        code: string,
        args: fcl.ArgumentFunction,
        defaultValue: T
    ): Promise<T>;
}

/**
 * Signer interface
 */
export interface IFlowSigner {
    /**
     * Send a transaction
     */
    sendTransaction(
        code: string,
        args: fcl.ArgumentFunction,
        authz?: fcl.FclAuthorization
    ): Promise<string>;

    /**
     * Build authorization
     */
    buildAuthorization(
        accountIndex?: number,
        privateKey?: string
    ): (acct: Account) => Promise<fcl.AuthZ>;
}

export interface TransactionResponse {
    signer: {
        address: string;
        keyIndex: number;
    };
    txid: string;
}

export interface FlowAccountBalanceInfo {
    address: string;
    balance: number;
    coaAddress?: string;
    coaBalance?: number;
}
