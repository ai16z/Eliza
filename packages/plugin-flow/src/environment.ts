import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

const FLOW_MAINNET_PUBLIC_RPC = "https://mainnet.onflow.org";

export const flowEnvSchema = z.object({
    FLOW_ADDRESS: z
        .string()
        .min(1, "Flow native address is required")
        .startsWith("0x", "Flow address must start with 0x"),
    FLOW_PRIVATE_KEY: z
        .string()
        .min(1, "Flow private key for the address is required")
        .startsWith("0x", "Flow private key must start with 0x"),
    FLOW_NETWORK: z.string().optional().default("mainnet"),
    FLOW_ENDPOINT_URL: z.string().optional().default(FLOW_MAINNET_PUBLIC_RPC),
});

export type FlowConfig = z.infer<typeof flowEnvSchema>;

export async function validateFlowConfig(
    runtime: IAgentRuntime
): Promise<FlowConfig> {
    try {
        const config = {
            FLOW_ADDRESS:
                runtime.getSetting("FLOW_ADDRESS") || process.env.FLOW_ADDRESS,
            FLOW_PRIVATE_KEY:
                runtime.getSetting("FLOW_PRIVATE_KEY") ||
                process.env.FLOW_PRIVATE_KEY,
            FLOW_NETWORK:
                runtime.getSetting("FLOW_NETWORK") ||
                process.env.FLOW_NETWORK ||
                "mainnet",
            FLOW_ENDPOINT_URL:
                runtime.getSetting("FLOW_ENDPOINT_URL") ||
                process.env.FLOW_ENDPOINT_URL ||
                FLOW_MAINNET_PUBLIC_RPC,
        };

        return flowEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Flow Blockchain configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
