declare module "*.cdc";
declare module "*.cdc?raw";

declare module "@onflow/transport-grpc";
declare module "@onflow/fcl-wc";

declare module "@onflow/config" {
    // Config
    export interface FlowConfig {
        put: (key: string, value: unknown) => Promise<FlowConfig>;
        get: <T>(key: string, defaultValue: T) => Promise<T>;
        update: <T>(
            key: string,
            updateFn: (oldValue: T) => T
        ) => Promise<FlowConfig>;
        load: (opts: { flowJSON: object }) => Promise<FlowConfig>;
    }

    export const config: FlowConfig;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@onflow/fcl" {
    import type * as ftypes from "@onflow/types";
    import type { FlowConfig } from "@onflow/config";
    import type {
        Account,
        CompositeSignature,
        TransactionStatus,
        CurrentUser as UserData,
    } from "@onflow/typedefs";

    export enum TransactionStatusTypes {
        Unknown = 0,
        Pending,
        Finalized,
        Executed,
        Sealed,
        Expired,
    }

    export type AnyJson =
        | boolean
        | number
        | string
        | null
        | IJsonArray
        | IJsonObject;

    export interface IJsonObject {
        [key: string]: AnyJson;
    }

    export interface FTypeSignature extends CompositeSignature {
        f_type: "CompositeSignature";
        f_vsn: "1.0.0";
    }

    export interface SigningData {
        message: string;
    }

    export interface KeyObject {
        index: number;
        publicKey: string;
        signAlgo: number;
        hashAlgo: number;
        weight: number;
        sequenceNumber: number;
        revoked: boolean;
    }

    export interface AuthZ extends Account {
        addr: string;
        keyId: number;
        signingFunction: (data: SigningData) => Promise<CompositeSignature>;
    }

    export type FclAuthorization =
        | AuthZ
        | ((acct: Account) => AuthZ)
        | ((acct: Account) => Promise<AuthZ>);

    export interface Service {
        authn?: string;
        f_type: string;
        f_vsn: string;
        id?: string;
        identity?: Record<string, string>;
        provider?: Record<string, string>;
        scoped?: Record<string, string>;
        type: string;
        uid: string;
        data?: any;
        network?: string;
    }

    export interface UserSnapshot extends UserData {
        services?: Service[];
    }

    export interface CadenceEvent {
        blockId: string;
        blockHeight: number;
        blockTimestamp: string;
        type: string;
        transactionId: string;
        transactionIndex: number;
        eventIndex: number;
        data?: Record<string, unknown>;
    }

    export interface CadenceResult {
        events: CadenceEvent[];
        status: number;
        statusCode: number;
        errorMessage: string;
        // TODO -- require once implemented in FCL
        // https://github.com/onflow/fcl-js/issues/926
        transactionId?: string;
    }

    export interface Argument {
        value: any;
        xform: any; // FType
    }

    type TxSubCallback = (tx: TransactionStatus) => void;

    export interface TransactionResult {
        snapshot: () => TransactionStatusTypes;
        subscribe: (callback?: TxSubCallback) => Promise<() => void>;
        onceFinalized: (callback?: TxSubCallback) => Promise<TransactionStatus>;
        onceExecuted: (callback?: TxSubCallback) => Promise<TransactionStatus>;
        onceSealed: (callback?: TxSubCallback) => Promise<TransactionStatus>;
    }

    export interface Interaction {
        tag: string;
        assigns: Record<string, unknown>;
        status: string;
        reason: string | null;
        accounts: Record<string, unknown>;
        params: Record<string, unknown>;
        arguments: Record<string, unknown>;
        message: Record<string, unknown>;
        /*
    {
      cadence: null;
      refBlock: null;
      computeLimit: null;
      proposer: null;
      payer: null;
      authorizations: [];
      params: [];
      arguments: [];
    };
    */
        proposer: string | null;
        authorizations: unknown[];
        payer: string | null;
        events: Record<string, unknown>;
        /*{
      eventType: null;
      start: null;
      end: null;
      blockIds: [];
    };
    */
        transaction: {
            id: string | null;
        };
        block: {
            id: number | null;
            height: number | null;
            isSealed: boolean;
        };
        account: {
            addr: string | null;
        };
        collection: {
            id: string | null;
        };
    }

    export type Pipe = (ix: Interaction) => Interaction;

    type IJsonArray = Array<AnyJson>;

    export type Decoder = (dictionary, decoders, stack) => Record<any, any>;
    export type DecoderGroup = Record<string, Decoder>;
    export type Response = IJsonObject;

    export interface CollectionGuaranteeObject {
        collectionId: string;
        signatures: TransactionSignature[];
    }

    export interface BlockHeaderObject {
        id: string;
        parentId: string;
        height: number;
        timestamp: string;
    }

    export interface BlockObject extends BlockHeaderObject {
        id: string;
        parentId: string;
        height: number;
        timestamp: any;
        collectionGuarantees: CollectionGuaranteeObject;
        blockSeals: any;
        signatures: TransactionSignature[];
    }

    type ArgumentFunction = (
        argFunc: typeof arg,
        t: typeof ftypes
    ) => Array<Argument>;

    export function query(opts: {
        cadence: string;
        args?: ArgumentFunction;
        limit?: number;
    }): Promise<Response>;

    export function mutate(opts: {
        cadence: string;
        args?: ArgumentFunction;
        limit?: number;
        proposer?: FclAuthorization;
        payer?: FclAuthorization;
        authorizations?: FclAuthorization[];
    }): Promise<string>;

    export function send(args: any, opts?: any): Promise<Response>;

    export function decode(
        decodeInstructions: any,
        customDecoders?: DecoderGroup,
        stack?: Array<any>
    ): Promise<any>;

    export function getChainId(): Promise<string>;

    export function getBlockHeader(): Promise<BlockHeaderObject>;

    export function sansPrefix(address: string): string;

    export function withPrefix(address: string): string;

    export function tx(transactionId: any): TransactionResult;

    // tx checker
    tx.isUnknown = (_tx: TransactionStatus) => boolean;
    tx.isPending = (_tx: TransactionStatus) => boolean;
    tx.isFinalized = (_tx: TransactionStatus) => boolean;
    tx.isExecuted = (_tx: TransactionStatus) => boolean;
    tx.isSealed = (_tx: TransactionStatus) => boolean;
    tx.isExpired = (_tx: TransactionStatus) => boolean;

    export function authenticate(): Promise<UserSnapshot>;
    export function unauthenticate(): void;
    export function reauthenticate(): Promise<UserSnapshot>;
    export function authorization(account: Account): Promise<FclAuthorization>;
    export function verifyUserSignatures(
        msg: string,
        compSigs: TransactionSignature[]
    ): Promise<unknown[]>;

    type SubscribeCallback = (user: UserSnapshot) => void;

    export interface CurrentUser {
        authenticate: typeof authenticate;
        unauthenticate: typeof unauthenticate;
        authorization: typeof authorization;
        signUserMessage: (msg: string) => Promise<TransactionSignature[]>;
        subscribe: (callback: SubscribeCallback) => void;
        snapshot: () => Promise<UserSnapshot>;
    }

    export const currentUser: CurrentUser;

    export const authz: AuthZ;

    export function config(): FlowConfig;

    // Utils
    export interface AccountProofData {
        address: string;
        nonce: string;
        signatures: FTypeSignature[];
    }
    export interface VerifySigOption {
        fclCryptoContract?: string;
    }

    export interface AppUtils {
        verifyAccountProof: (
            appIdentifier: string,
            accountProofData: AccountProofData,
            opts?: VerifySigOption
        ) => Promise<boolean>;

        verifyUserSignatures: (
            message: string,
            signatures: FTypeSignature[],
            opts?: VerifySigOption
        ) => Promise<boolean>;
    }
    export const AppUtils: AppUtils;

    export interface WalletUtils {
        encodeAccountProof: (
            accountProofData: {
                address: string;
                nonce: string;
                appIdentifier: string;
            },
            includeDomainTag?: boolean
        ) => string;
    }
    export const WalletUtils: WalletUtils;

    export interface PluginRegistry {
        add(plugin: any): void;
    }
    export const pluginRegistry: PluginRegistry;

    // SDK
    export function getAccount(address: string): Pipe;
    export function getBlock(isSealed?: boolean): Pipe;
    export function atBlockId(blockId: string): Pipe;
    export function atBlockHeight(blockHeight: number): Pipe;
    export function getTransaction(transactionId: string): Pipe;
    export function getTransactionStatus(transactionId: string): Pipe;
    export function getEventsAtBlockIds(
        eventType: string,
        blockIds: string[]
    ): Pipe;
    export function getEventsAtBlockHeightRange(
        eventName: string,
        fromBlockHeight: number,
        toBlockHeight: number
    ): Pipe;

    export function build(fns?: Pipe[]): Pipe;
    export function script(code: string): Interaction;
    export function transaction(...args: any): Interaction;

    export function payer(authz: FclAuthorization): Pipe;
    export function proposer(authz: FclAuthorization): Pipe;
    export function authorizations(ax: FclAuthorization[]): Pipe;
    export function args(ax: Argument[]): Pipe;
    export function arg(value: any, xform: any): Argument;
    export function limit(computeLimit: number): Pipe;
}
