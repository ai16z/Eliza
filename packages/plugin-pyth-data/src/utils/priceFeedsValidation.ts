import { z } from 'zod';
import { DataError, ErrorSeverity, DataErrorCode } from '../error';
import { elizaLogger } from '@elizaos/core';

// Schema for price feed attributes
const priceFeedAttributesSchema = z.object({
    asset_type: z.string(),
    base: z.string(),
    description: z.string(),
    display_symbol: z.string(),
    quote_currency: z.string(),
    schedule: z.string(),
    symbol: z.string(),
    generic_symbol: z.string().optional(),
    cms_symbol: z.string().optional(),
    country: z.string().optional(),
    cqs_symbol: z.string().optional(),
    nasdaq_symbol: z.string().optional(),
    contract_id: z.string().optional()
});

// Schema for price feeds request
export const priceFeedsSchema = z.object({
    text: z.string(),
    query: z.string().optional(),
    filter: z.string().optional(),
    success: z.boolean().optional(),
    data: z.object({
        feeds: z.array(z.object({
            id: z.string(),
            attributes: priceFeedAttributesSchema
        })),
        count: z.number(),
        responseType: z.string(),
        isArray: z.boolean(),
        error: z.string().optional()
    }).optional()
});

export async function validatePriceFeedsData(content: unknown): Promise<boolean> {
    try {
        const result = await priceFeedsSchema.parseAsync(content);
        elizaLogger.debug('Price feeds validation passed', { result });
        return true;
    } catch (error) {
        elizaLogger.error('Price feeds validation failed', { error });
        throw new DataError(
            DataErrorCode.VALIDATION_FAILED,
            'Price feeds validation failed',
            ErrorSeverity.HIGH,
            { error }
        );
    }
}