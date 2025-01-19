import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import type { Principal } from "@dfinity/principal";

export interface Account {
    owner: Principal;
    subaccount: [] | [Uint8Array | number[]];
}
export interface AccountBalanceArgs {
    account: string;
}
export interface Allowance {
    allowance: bigint;
    expires_at: [] | [bigint];
}
export interface AllowanceArgs {
    account: Account;
    spender: Account;
}
export interface ApproveArgs {
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
    expected_allowance: [] | [bigint];
    expires_at: [] | [bigint];
    spender: Account;
}
export type ApproveError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { AllowanceChanged: { current_allowance: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { Expired: { ledger_time: bigint } }
    | { InsufficientFunds: { balance: bigint } };
export interface ArchiveInfo {
    canister_id: Principal;
}
export interface ArchiveOptions {
    num_blocks_to_archive: bigint;
    max_transactions_per_response: [] | [bigint];
    trigger_threshold: bigint;
    more_controller_ids: [] | [Array<Principal>];
    max_message_size_bytes: [] | [bigint];
    cycles_for_archive_creation: [] | [bigint];
    node_max_memory_size_bytes: [] | [bigint];
    controller_id: Principal;
}
export interface ArchivedBlocksRange {
    callback: [Principal, string];
    start: bigint;
    length: bigint;
}
export interface ArchivedEncodedBlocksRange {
    callback: [Principal, string];
    start: bigint;
    length: bigint;
}
export interface Archives {
    archives: Array<ArchiveInfo>;
}
export interface BinaryAccountBalanceArgs {
    account: Uint8Array | number[];
}
export interface BlockRange {
    blocks: Array<CandidBlock>;
}
export interface CandidBlock {
    transaction: CandidTransaction;
    timestamp: TimeStamp;
    parent_hash: [] | [Uint8Array | number[]];
}
export type CandidOperation =
    | {
          Approve: {
              fee: Tokens;
              from: Uint8Array | number[];
              allowance_e8s: bigint;
              allowance: Tokens;
              expected_allowance: [] | [Tokens];
              expires_at: [] | [TimeStamp];
              spender: Uint8Array | number[];
          };
      }
    | {
          Burn: {
              from: Uint8Array | number[];
              amount: Tokens;
              spender: [] | [Uint8Array | number[]];
          };
      }
    | { Mint: { to: Uint8Array | number[]; amount: Tokens } }
    | {
          Transfer: {
              to: Uint8Array | number[];
              fee: Tokens;
              from: Uint8Array | number[];
              amount: Tokens;
              spender: [] | [Uint8Array | number[]];
          };
      };
export interface CandidTransaction {
    memo: bigint;
    icrc1_memo: [] | [Uint8Array | number[]];
    operation: [] | [CandidOperation];
    created_at_time: TimeStamp;
}
export interface Decimals {
    decimals: number;
}
export interface Duration {
    secs: bigint;
    nanos: number;
}
export interface FeatureFlags {
    icrc2: boolean;
}
export interface GetBlocksArgs {
    start: bigint;
    length: bigint;
}
export type GetBlocksError =
    | {
          BadFirstBlockIndex: {
              requested_index: bigint;
              first_valid_index: bigint;
          };
      }
    | { Other: { error_message: string; error_code: bigint } };
export interface InitArgs {
    send_whitelist: Array<Principal>;
    token_symbol: [] | [string];
    transfer_fee: [] | [Tokens];
    minting_account: string;
    maximum_number_of_accounts: [] | [bigint];
    accounts_overflow_trim_quantity: [] | [bigint];
    transaction_window: [] | [Duration];
    max_message_size_bytes: [] | [bigint];
    icrc1_minting_account: [] | [Account];
    archive_options: [] | [ArchiveOptions];
    initial_values: Array<[string, Tokens]>;
    token_name: [] | [string];
    feature_flags: [] | [FeatureFlags];
}
export type LedgerCanisterPayload =
    | { Upgrade: [] | [UpgradeArgs] }
    | { Init: InitArgs };
export type MetadataValue =
    | { Int: bigint }
    | { Nat: bigint }
    | { Blob: Uint8Array | number[] }
    | { Text: string };
export interface Name {
    name: string;
}
export interface QueryBlocksResponse {
    certificate: [] | [Uint8Array | number[]];
    blocks: Array<CandidBlock>;
    chain_length: bigint;
    first_block_index: bigint;
    archived_blocks: Array<ArchivedBlocksRange>;
}
export interface QueryEncodedBlocksResponse {
    certificate: [] | [Uint8Array | number[]];
    blocks: Array<Uint8Array | number[]>;
    chain_length: bigint;
    first_block_index: bigint;
    archived_blocks: Array<ArchivedEncodedBlocksRange>;
}
export type Result = { Ok: bigint } | { Err: TransferError };
export type Result_1 = { Ok: bigint } | { Err: ApproveError };
export type Result_2 = { Ok: bigint } | { Err: TransferFromError };
export type Result_3 = { Ok: BlockRange } | { Err: GetBlocksError };
export type Result_4 =
    | { Ok: Array<Uint8Array | number[]> }
    | { Err: GetBlocksError };
export type Result_5 = { Ok: bigint } | { Err: TransferError_1 };
export interface SendArgs {
    to: string;
    fee: Tokens;
    memo: bigint;
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [TimeStamp];
    amount: Tokens;
}
export interface StandardRecord {
    url: string;
    name: string;
}
export interface Symbol {
    symbol: string;
}
export interface TimeStamp {
    timestamp_nanos: bigint;
}
export interface Tokens {
    e8s: bigint;
}
export interface TransferArg {
    to: Account;
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
}
export interface TransferArgs {
    to: Uint8Array | number[];
    fee: Tokens;
    memo: bigint;
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [TimeStamp];
    amount: Tokens;
}
export type TransferError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export type TransferError_1 =
    | {
          TxTooOld: { allowed_window_nanos: bigint };
      }
    | { BadFee: { expected_fee: Tokens } }
    | { TxDuplicate: { duplicate_of: bigint } }
    | { TxCreatedInFuture: null }
    | { InsufficientFunds: { balance: Tokens } };
export interface TransferFee {
    transfer_fee: Tokens;
}
export interface TransferFromArgs {
    to: Account;
    fee: [] | [bigint];
    spender_subaccount: [] | [Uint8Array | number[]];
    from: Account;
    memo: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
}
export type TransferFromError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { InsufficientAllowance: { allowance: bigint } }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export interface UpgradeArgs {
    maximum_number_of_accounts: [] | [bigint];
    icrc1_minting_account: [] | [Account];
    feature_flags: [] | [FeatureFlags];
}
export interface _SERVICE {
    account_balance: ActorMethod<[BinaryAccountBalanceArgs], Tokens>;
    account_balance_dfx: ActorMethod<[AccountBalanceArgs], Tokens>;
    account_identifier: ActorMethod<[Account], Uint8Array | number[]>;
    archives: ActorMethod<[], Archives>;
    decimals: ActorMethod<[], Decimals>;
    icrc1_balance_of: ActorMethod<[Account], bigint>;
    icrc1_decimals: ActorMethod<[], number>;
    icrc1_fee: ActorMethod<[], bigint>;
    icrc1_metadata: ActorMethod<[], Array<[string, MetadataValue]>>;
    icrc1_minting_account: ActorMethod<[], [] | [Account]>;
    icrc1_name: ActorMethod<[], string>;
    icrc1_supported_standards: ActorMethod<[], Array<StandardRecord>>;
    icrc1_symbol: ActorMethod<[], string>;
    icrc1_total_supply: ActorMethod<[], bigint>;
    icrc1_transfer: ActorMethod<[TransferArg], Result>;
    icrc2_allowance: ActorMethod<[AllowanceArgs], Allowance>;
    icrc2_approve: ActorMethod<[ApproveArgs], Result_1>;
    icrc2_transfer_from: ActorMethod<[TransferFromArgs], Result_2>;
    name: ActorMethod<[], Name>;
    query_blocks: ActorMethod<[GetBlocksArgs], QueryBlocksResponse>;
    query_encoded_blocks: ActorMethod<
        [GetBlocksArgs],
        QueryEncodedBlocksResponse
    >;
    send_dfx: ActorMethod<[SendArgs], bigint>;
    symbol: ActorMethod<[], Symbol>;
    transfer: ActorMethod<[TransferArgs], Result_5>;
    transfer_fee: ActorMethod<[{}], TransferFee>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
