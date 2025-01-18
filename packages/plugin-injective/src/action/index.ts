import { AuctionActions } from "./auction";
import { AuthActions } from "./auth";
import { BankActions } from "./bank";
import { DistributionActions } from "./distribution";
import { ExchangeActions } from "./exchange";
import { ExplorerActions } from "./explorer";
import { GovActions } from "./gov";
import { IbcActions } from "./ibc";
import { InsuranceActions } from "./insurance";
import { MintActions } from "./mint";
import { MitoActions } from "./mito";
import { PeggyActions } from "./peggy";
import { PermissionsActions } from "./permissions";
import { StakingActions } from "./staking";
import { TokenFactoryActions } from "./token-factory";
import { WasmActions } from "./wasm";
// Exporting all actions
export * from "./auction";
export * from "./auth";
export * from "./bank";
export * from "./distribution";
export * from "./exchange";
export * from "./explorer";
export * from "./gov";
export * from "./ibc";
export * from "./insurance";
export * from "./mint";
export * from "./mito";
export * from "./peggy";
export * from "./permissions";
export * from "./staking";
export * from "./token-factory";
export * from "./wasm";

export const InjectiveActions = [
    ...ExchangeActions,
    ...AuctionActions,
    ...AuthActions,
    ...BankActions,
    ...DistributionActions,
    ...ExplorerActions,
    ...GovActions,
    ...IbcActions,
    ...InsuranceActions,
    ...MintActions,
    ...MitoActions,
    ...PeggyActions,
    ...PermissionsActions,
    ...StakingActions,
    ...TokenFactoryActions,
    ...WasmActions,
];

export default InjectiveActions;
