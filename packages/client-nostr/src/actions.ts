import type { Content, IAgentRuntime, Memory, UUID } from "@elizaos/core";
import type { NostrProfile, NostrEvent } from "./types";
import { NostrClient } from "./client";
import { createNostrEventMemory } from "./memory";
import { elizaLogger } from "@elizaos/core";

export async function publishNote({
    client,
    runtime,
    content,
    profile,
    roomId,
}: {
    profile: NostrProfile;
    client: NostrClient;
    runtime: IAgentRuntime;
    content: Content;
    roomId: UUID;
}): Promise<{ memory: Memory; nostrEvent: NostrEvent }[]> {
    try {
        const nostrEvent = await client.publishNote(content.text);

        if (!nostrEvent) {
            throw new Error("Failed to publish note");
        }

        return [
            {
                memory: createNostrEventMemory({ roomId, runtime, nostrEvent }),
                nostrEvent,
            },
        ];
    } catch (error) {
        elizaLogger.error(error);
        throw error;
    }
}
