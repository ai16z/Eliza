export interface ActionResult {
    success: boolean;
    callSid?: string;
    message?: string;
}

export interface CallVoiceParams {
    phoneNumber: string;
    message: string;
}

export interface VoiceConversationParams {
    phoneNumber: string;
}