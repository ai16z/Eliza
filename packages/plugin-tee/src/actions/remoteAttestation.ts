import type { IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";
import { RemoteAttestationProvider } from "../providers/remoteAttestationProvider";
import { fetch, type BodyInit } from "undici";
import type { RemoteAttestationMessage } from "../types/tee";

function hexToUint8Array(hex: string) {
    hex = hex.trim();
    if (!hex) {
      throw new Error("Invalid hex string");
    }
    if (hex.startsWith("0x")) {
      hex = hex.substring(2);
    }
    if (hex.length % 2 !== 0) {
      throw new Error("Invalid hex string");
    }

    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      const byte = Number.parseInt(hex.slice(i, i + 2), 16);
      if (isNaN(byte)) {
        throw new Error("Invalid hex string");
      }
      array[i / 2] = byte;
    }
    return array;
}

async function uploadUint8Array(data: Uint8Array) {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const formData = new FormData();
    formData.append("file", blob, 'quote.bin');

    return await fetch("https://proof.t16z.com/api/upload", {
        method: "POST",
        body: formData as BodyInit,
      });
}

export const remoteAttestationAction = {
    name: "REMOTE_ATTESTATION",
    similes: ["REMOTE_ATTESTATION", "TEE_REMOTE_ATTESTATION", "TEE_ATTESTATION"],
    description: "Generate a remote attestation to prove that the agent is running in a TEE",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback,
    ) => {
        try {
            // Attestation will be generated based on the message info
            const attestationMessage: RemoteAttestationMessage = {
                agentId: runtime.agentId,
                timestamp: Date.now(),
                message: {
                    userId: message.userId,
                    roomId: message.roomId,
                    content: message.content.text,
                },
            };
            // Get the remote attestation of the agentId
            const teeMode = runtime.getSetting("TEE_MODE");
            const provider = new RemoteAttestationProvider(teeMode);

            const attestation = await provider.generateAttestation(JSON.stringify(attestationMessage));
            const attestationData = hexToUint8Array(attestation.quote);
            const response = await uploadUint8Array(attestationData);
            const data = await response.json();
            callback({
                text: `Here's my 🧾 RA Quote 🫡
https://proof.t16z.com/reports/${data.checksum}`,
                action: "NONE",
            });
            return true;
        } catch (error) {
            console.error("Failed to fetch remote attestation: ", error);
            return false;
        }
    },
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "If you are running in a TEE, generate a remote attestation",
                    action: "REMOTE_ATTESTATION",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Of course, one second...",
                },
            }
        ],
    ],
};
