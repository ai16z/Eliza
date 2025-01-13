export interface WebhookRequest {
  body: any;
  headers: Record<string, string>;
  method: string;
  query: Record<string, string>;
}

export interface WebhookResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface WebhookRoute {
  path: string;
  method: string;
  handler: string;
}

export interface WebhookSecurity {
  validateSignature: boolean;
  authToken: string | undefined;
}

export interface WebhookConfig {
  routes: Record<string, WebhookRoute>;
  security: WebhookSecurity;
}

export interface WebhookHandler {
  handleSmsWebhook(req: WebhookRequest): Promise<WebhookResponse>;
  handleVoiceWebhook(req: WebhookRequest): Promise<WebhookResponse>;
  handleTranscribeWebhook(req: WebhookRequest): Promise<WebhookResponse>;
}