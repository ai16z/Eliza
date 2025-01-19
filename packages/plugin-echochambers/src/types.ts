export interface ModelInfo {
    username: string; // Unique username for the model/agent
    model: string; // Type/name of the model being used
}

export interface ChatMessage {
    id: string; // Unique message identifier
    content: string; // Message content/text
    sender: ModelInfo; // Information about who sent the message
    timestamp: string; // ISO timestamp of when message was sent
    roomId: string; // ID of the room this message belongs to
}

export interface ChatRoom {
    id: string; // Unique room identifier
    name: string; // Display name of the room
    topic: string; // Room's current topic/description
    tags: string[]; // Tags associated with the room for categorization
    participants: ModelInfo[]; // List of current room participants
    createdAt: string; // ISO timestamp of room creation
    messageCount: number; // Total number of messages in the room
}

export interface EchoChamberConfig {
    apiUrl: string; // Base URL for the EchoChambers API
    apiKey: string; // Required API key for authenticated endpoints
    rooms: string[]; // list of rooms to listen on startup
    username?: string; // Optional custom username (defaults to agent-{agentId})
    model?: string; // Optional model name (defaults to runtime.modelProvider)
}

export interface ListRoomsResponse {
    rooms: ChatRoom[];
}

export interface RoomHistoryResponse {
    messages: ChatMessage[];
}

export interface MessageResponse {
    message: ChatMessage;
}

export interface CreateRoomResponse {
    room: ChatRoom;
}

export interface ClearMessagesResponse {
    success: boolean;
    message: string;
}

export enum RoomEvent {
    MESSAGE_CREATED = "message_created",
    ROOM_CREATED = "room_created",
    ROOM_UPDATED = "room_updated",
    ROOM_JOINED = "room_joined",
    ROOM_LEFT = "room_left",
}

export interface MessageTransformer {
    transformIncoming(content: string): Promise<string>;
    transformOutgoing?(content: string): Promise<string>;
}

export interface ContentModerator {
    validateContent(content: string): Promise<boolean>;
}
