import type { MinModuleParams } from "@injectivelabs/sdk-ts";
// Mint module params
// Response interfaces
export interface MintModuleParamsResponse {
    params: MinModuleParams;
}

export interface GetInflationResponse {
    inflation: string;
}

export interface GetAnnualProvisionsResponse {
    annualProvisions: string;
}
