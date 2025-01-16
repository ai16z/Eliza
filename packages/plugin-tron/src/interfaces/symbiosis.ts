export interface SymbiosisToken {
    chainId: number;
    address: string;
    symbol: string;
    decimals: number;
}

export interface SymbiosisTokenIn extends SymbiosisToken {
    amount: string;
}

export interface SymbiosisSwapRequest {
    tokenAmountIn: SymbiosisTokenIn;
    tokenOut: SymbiosisToken;
    from: string;
    to: string;
    slippage: number;
}

export interface SymbiosisSwapResponse {
    fee: Fee;
    route: Route[];
    inTradeType: string;
    outTradeType: string;
    fees: Fee2[];
    routes: Route2[];
    kind: string;
    priceImpact: string;
    tokenAmountOut: TokenAmountOut;
    tokenAmountOutMin: TokenAmountOutMin;
    amountInUsd: AmountInUsd;
    approveTo: string;
    type: string;
    rewards: unknown[];
    estimatedTime: number;
    tx: Tx;
}

export interface Fee {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface Route {
    symbol: string;
    address: string;
    chainId: number;
    decimals: number;
    icon?: string;
}

export interface Fee2 {
    provider: string;
    value: Value;
    save: Save;
    description: string;
}

export interface Value {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface Save {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface Route2 {
    provider: string;
    tokens: Token[];
}

export interface Token {
    symbol: string;
    address: string;
    chainId: number;
    decimals: number;
    icon?: string;
}

export interface TokenAmountOut {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface TokenAmountOutMin {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface AmountInUsd {
    symbol: string;
    icon: string;
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
}

export interface Tx {
    chainId: number;
    data: string;
    to: string;
    value: string;
    functionSelector: string;
    feeLimit: number;
    from: string;
}
