//Peggy
export interface MsgSendToEthParams {
    amount: {
        denom: string;
        amount: string;
    };
    bridgeFee?: {
        denom: string;
        amount: string;
    };
}
