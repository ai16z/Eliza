declare global {
    interface Buffer extends Uint8Array {}
}
export {};

export enum ServiceType {
    TEXT_GENERATION = 'text-generation',
    WEBHOOK = 'webhook',
    // ... other service types
}
