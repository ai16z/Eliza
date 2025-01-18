import { z } from 'zod';
import { DataError, ErrorSeverity, DataErrorCode } from '../error';
import { elizaLogger } from '@elizaos/core';

// Schema for price update stream options
const streamOptionsSchema = z.object({
    encoding: z.enum(['hex', 'base64']).optional(),
    parsed: z.boolean().optional(),
    allowUnordered: z.boolean().optional(),
    benchmarksOnly: z.boolean().optional()
});

// Schema for price metadata
const priceMetadataSchema = z.object({
    slot: z.number(),
    proof_available_time: z.number(),
    prev_publish_time: z.number()
});

// Schema for price data
const priceDataSchema = z.object({
    price: z.string(),
    conf: z.string(),
    expo: z.number(),
    publish_time: z.number()
});

// Schema for parsed price update
const parsedPriceUpdateSchema = z.object({
    id: z.string(),
    price: priceDataSchema,
    ema_price: priceDataSchema,
    metadata: priceMetadataSchema.optional()
});

// Schema for binary data
const binaryDataSchema = z.object({
    encoding: z.string(),
    data: z.array(z.string())
});

// Schema for price updates stream request
export const priceUpdateStreamSchema = z.object({
    text: z.string(),
    priceIds: z.array(z.string().regex(/^0x[0-9a-fA-F]{64}$/)),
    options: streamOptionsSchema.optional(),
    success: z.boolean().optional(),
    data: z.object({
        streamId: z.string(),
        status: z.enum(['connected', 'disconnected', 'error']),
        binary: binaryDataSchema.optional(),
        parsed: z.array(parsedPriceUpdateSchema).optional(),
        error: z.string().optional()
    }).optional()
});

export async function validatePriceUpdateStreamData(content: unknown): Promise<boolean> {
    try {
        const result = await priceUpdateStreamSchema.parseAsync(content);
        elizaLogger.debug('Price update stream validation passed', { result });
        return true;
    } catch (error) {
        elizaLogger.error('Price update stream validation failed', { error });
        throw new DataError(
            DataErrorCode.VALIDATION_FAILED,
            'Price update stream validation failed',
            ErrorSeverity.HIGH,
            { error }
        );
    }
}