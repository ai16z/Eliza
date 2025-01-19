import type { PaymentMethod } from './common-types';

// List Payment Methods
export type ListPaymentMethodsResponse = {
    paymentMethods?: PaymentMethod;
};

// Get Payment Method
export type GetPaymentMethodRequest = {
    // Path Params
    paymentMethodId: string;
};

export type GetPaymentMethodResponse = {
    paymentMethod?: PaymentMethod;
};
