import type {
    Address,
    Hash,
} from "viem";

export interface Transaction {
    hash: Hash;
    from: Address;
    tokenAddress: string;
    recipient: string;
    amount: string | number;
}

export interface TransferParams {
    tokenAddress: string;
    recipient: string;
    amount: string | number;
}

export interface StakeParams {
    amount: string | number;
}

export interface UnstakeParams {
    amount: string | number;
}

//export interface WithdrawParams {
//}
