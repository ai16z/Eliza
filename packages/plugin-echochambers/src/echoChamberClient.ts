import { elizaLogger, type IAgentRuntime } from "@elizaos/core";
import type {
    ChatMessage,
    ChatRoom,
    EchoChamberConfig,
    ModelInfo,
    ListRoomsResponse,
    RoomHistoryResponse,
    MessageResponse,
} from "./types";

const MAX_RETRIES = 3;

const RETRY_DELAY = 5000;

export class EchoChamberClient {
    private runtime: IAgentRuntime;
    private config: EchoChamberConfig;
    private apiUrl: string;
    private modelInfo: ModelInfo;
    private watchedRooms: Set<string> = new Set();

    constructor(runtime: IAgentRuntime, config: EchoChamberConfig) {
        this.runtime = runtime;
        this.config = config;
        this.apiUrl = `${config.apiUrl}/api/rooms`;
        this.modelInfo = {
            username: config.username || `agent-${runtime.agentId}`,
            model: config.model || runtime.modelProvider,
        };
    }

    public getUsername(): string {
        return this.modelInfo.username;
    }

    public getModelInfo(): ModelInfo {
        return { ...this.modelInfo };
    }

    public getConfig(): EchoChamberConfig {
        return { ...this.config };
    }

    private getAuthHeaders(): { [key: string]: string } {
        return {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
        };
    }

    public async addWatchedRoom(roomId: string): Promise<void> {
        try {
            const rooms = await this.listRooms();
            const room = rooms.find((r) => r.id === roomId);

            if (!room) {
                throw new Error(`Room ${roomId} not found`);
            }

            this.watchedRooms.add(roomId);
            elizaLogger.success(`Now watching room: ${room.name}`);
        } catch (error) {
            elizaLogger.error("Error adding watched room:", error);
            throw error;
        }
    }

    public removeWatchedRoom(roomId: string): void {
        this.watchedRooms.delete(roomId);
        elizaLogger.success(`Stopped watching room: ${roomId}`);
    }

    public getWatchedRooms(): string[] {
        return Array.from(this.watchedRooms);
    }

    private async retryOperation<T>(
        operation: () => Promise<T>,
        retries: number = MAX_RETRIES
    ): Promise<T> {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === retries - 1) throw error;
                const delay = RETRY_DELAY * Math.pow(2, i);
                elizaLogger.warn(`Retrying operation in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw new Error("Max retries exceeded");
    }

    public async start(): Promise<void> {
        elizaLogger.log("🚀 Starting EchoChamber client...");
        try {
            await this.retryOperation(() => this.listRooms());

            for (const room of this.config.rooms) {
                await this.addWatchedRoom(room);
            }

            elizaLogger.success(
                `✅ EchoChamber client started for ${this.modelInfo.username}`
            );
            elizaLogger.info(
                `Watching rooms: ${Array.from(this.watchedRooms).join(", ")}`
            );
        } catch (error) {
            elizaLogger.error("❌ Failed to start EchoChamber client:", error);
            throw error;
        }
    }

    public async stop(): Promise<void> {
        this.watchedRooms.clear();
        elizaLogger.log("Stopping EchoChamber client...");
    }

    public async listRooms(tags?: string[]): Promise<ChatRoom[]> {
        try {
            const url = new URL(this.apiUrl);
            if (tags?.length) {
                url.searchParams.append("tags", tags.join(","));
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Failed to list rooms: ${response.statusText}`);
            }

            const data = (await response.json()) as ListRoomsResponse;
            return data.rooms;
        } catch (error) {
            elizaLogger.error("Error listing rooms:", error);
            throw error;
        }
    }

    public async getRoomHistory(roomId: string): Promise<ChatMessage[]> {
        return this.retryOperation(async () => {
            const response = await fetch(`${this.apiUrl}/${roomId}/history`);
            if (!response.ok) {
                throw new Error(
                    `Failed to get room history: ${response.statusText}`
                );
            }

            const data = (await response.json()) as RoomHistoryResponse;
            return data.messages;
        });
    }

    public async sendMessage(
        roomId: string,
        content: string
    ): Promise<ChatMessage> {
        return this.retryOperation(async () => {
            const response = await fetch(`${this.apiUrl}/${roomId}/message`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    content,
                    sender: this.modelInfo,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to send message: ${response.statusText}`
                );
            }

            const data = (await response.json()) as MessageResponse;
            return data.message;
        });
    }

    public async shouldInitiateConversation(room: ChatRoom): Promise<boolean> {
        try {
            const history = await this.getRoomHistory(room.id);
            if (!history?.length) return true; // Empty room is good to start

            const recentMessages = history
                .filter((msg) => msg != null) // Filter out null messages
                .sort(
                    (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                );

            if (!recentMessages.length) return true; // No valid messages

            const lastMessageTime = new Date(
                recentMessages[0].timestamp
            ).getTime();
            const timeSinceLastMessage = Date.now() - lastMessageTime;

            const quietPeriodSeconds = Number(
                this.runtime.getSetting("ECHOCHAMBERS_QUIET_PERIOD") || 300 // 5 minutes in seconds
            );
            const quietPeriod = quietPeriodSeconds * 1000; // Convert to milliseconds

            if (timeSinceLastMessage < quietPeriod) {
                elizaLogger.debug(
                    `Room ${room.name} active recently, skipping`
                );
                return false;
            }

            return true;
        } catch (error) {
            elizaLogger.error(`Error checking conversation state: ${error}`);
            return false;
        }
    }
}
