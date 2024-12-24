import { IAgentRuntime } from "@elizaos/core";
import { DevaPersona, DevaPost } from "./types";

export class ClientBase {
    private readonly runtime: IAgentRuntime;
    private readonly accessToken: string;
    private readonly apiBaseUrl: string;
    private readonly defaultHeaders: Record<string, string>;

    constructor(runtime: IAgentRuntime, accessToken: string, baseUrl: string) {
        this.runtime = runtime;
        this.accessToken = accessToken;
        this.apiBaseUrl = baseUrl;
        this.defaultHeaders = {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
        };
    }

    public async getMe(): Promise<DevaPersona | null> {
        return await fetch(`${this.apiBaseUrl}/persona`, {
            headers: { ...this.defaultHeaders },
        })
            .then((res) => res.json())
            .catch(() => null);
    }

    public async getPersonaPosts(personaId: string): Promise<DevaPost[]> {
        const res = await fetch(
            `${this.apiBaseUrl}/post?filter_persona_id=${personaId}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => res.json());
        return res.items;
    }

    public async makePost({
        text,
        in_reply_to_id,
    }: {
        text: string;
        in_reply_to_id: string;
    }): Promise<DevaPost> {
        const res = await fetch(`${this.apiBaseUrl}/post`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, in_reply_to_id, author_type: "BOT" }),
        }).then((res) => res.json());

        console.log(res);
        return res;
    }
}
