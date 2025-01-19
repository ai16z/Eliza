import { IAgentRuntime, Provider, Memory } from "@elizaos/core";
import { Client, Discussion } from "@hiveio/dhive";
import { validateHiveConfig } from "../environment";

export interface ContentQuery {
    tag?: string;
    limit?: number;
    sortBy?: "trending" | "created" | "hot" | "promoted";
    author?: string;
    startPermlink?: string;
}

export interface BlogStats {
    postCount: number;
    totalPayout: string;
    pendingPayout: string;
    followers: number;
    following: number;
}

interface ProviderConfig {
    HIVE_API_NODE: string;
    HIVE_ACCOUNT: string;
}

export class HiveContentProvider implements Provider {
    private client: Client | null = null;
    private config: ProviderConfig | null = null;

    async initialize(runtime: IAgentRuntime) {
        const fullConfig = await validateHiveConfig(runtime);

        if (!fullConfig.HIVE_API_NODE || !fullConfig.HIVE_ACCOUNT) {
            throw new Error(
                "Missing required configuration: HIVE_API_NODE and HIVE_ACCOUNT are required"
            );
        }

        this.config = {
            HIVE_API_NODE: fullConfig.HIVE_API_NODE,
            HIVE_ACCOUNT: fullConfig.HIVE_ACCOUNT,
        };

        this.client = new Client([this.config.HIVE_API_NODE]);
    }

    private ensureInitialized() {
        if (!this.client || !this.config) {
            throw new Error(
                "Provider not initialized. Call initialize() first"
            );
        }
    }

    // Required get method from Provider interface
    async get(
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<{
        post?: Discussion;
        replies?: Discussion[];
        stats?: BlogStats;
        blogStats?: BlogStats;
        recentPosts?: Discussion[];
    }> {
        try {
            // Initialize if not already initialized
            if (!this.client || !this.config) {
                await this.initialize(runtime);
            }

            this.ensureInitialized();

            // Extract query parameters from message content
            const query = message.content as ContentQuery;
            const author = query.author || message.content.author;
            const permlink = message.content.permlink;

            if (!author || typeof author !== "string") {
                return await this.getState();
            }

            // If specific post is requested
            if (permlink && typeof permlink === "string") {
                const post = await this.getPost(author, permlink);
                const replies = await this.getReplies(author, permlink);
                return {
                    post,
                    replies,
                    stats: await this.getBlogStats(author),
                };
            }

            // If author's blog stats are requested
            return {
                blogStats: await this.getBlogStats(author),
                recentPosts: await this.getPosts({
                    author,
                    limit: query.limit || 5,
                    sortBy: query.sortBy,
                }),
            };
        } catch (error) {
            throw new Error(`Content provider get failed: ${error.message}`);
        }
    }

    async getState() {
        try {
            this.ensureInitialized();
            const blogStats = await this.getBlogStats(
                this.config!.HIVE_ACCOUNT
            );
            const recentPosts = await this.getPosts({
                author: this.config!.HIVE_ACCOUNT,
                limit: 5,
            });

            return {
                blogStats,
                recentPosts,
            };
        } catch (error) {
            throw new Error(`Failed to get content state: ${error.message}`);
        }
    }

    async getPosts(query: ContentQuery): Promise<Discussion[]> {
        try {
            this.ensureInitialized();
            const { tag = "", limit = 20, sortBy = "created", author } = query;

            let posts: Discussion[];
            const queryOptions = { tag, limit };

            switch (sortBy) {
                case "trending":
                    posts = await this.client!.database.getDiscussions(
                        "trending",
                        queryOptions
                    );
                    break;
                case "hot":
                    posts = await this.client!.database.getDiscussions(
                        "hot",
                        queryOptions
                    );
                    break;
                case "created":
                    posts = await this.client!.database.getDiscussions(
                        "created",
                        queryOptions
                    );
                    break;
                case "promoted":
                    posts = await this.client!.database.getDiscussions(
                        "promoted",
                        queryOptions
                    );
                    break;
                default:
                    posts = await this.client!.database.getDiscussions(
                        "created",
                        queryOptions
                    );
            }

            if (author) {
                posts = posts.filter((post) => post.author === author);
            }

            return posts;
        } catch (error) {
            throw new Error(`Failed to get posts: ${error.message}`);
        }
    }

    async getBlogStats(username: string): Promise<BlogStats> {
        try {
            this.ensureInitialized();
            const [account] = await this.client!.database.getAccounts([
                username,
            ]);

            if (!account) {
                throw new Error(`Account ${username} not found`);
            }

            const followStats = await this.client!.database.call(
                "get_follow_count",
                [username]
            );

            // Get blog posts to calculate payouts
            const posts = await this.getPosts({
                author: username,
                limit: 100,
                sortBy: "created",
            });

            let totalPayout = 0;
            let pendingPayout = 0;

            posts.forEach((post) => {
                totalPayout += parseFloat(
                    (post.total_payout_value as string).split(" ")[0]
                );
                totalPayout += parseFloat(
                    (post.curator_payout_value as string).split(" ")[0]
                );
                pendingPayout += parseFloat(
                    (post.pending_payout_value as string).split(" ")[0]
                );
            });

            return {
                postCount: account.post_count,
                totalPayout: `${totalPayout.toFixed(3)} HBD`,
                pendingPayout: `${pendingPayout.toFixed(3)} HBD`,
                followers: followStats.follower_count,
                following: followStats.following_count,
            };
        } catch (error) {
            throw new Error(`Failed to get blog stats: ${error.message}`);
        }
    }

    async getPost(author: string, permlink: string): Promise<Discussion> {
        try {
            this.ensureInitialized();
            const content = await this.client!.database.call("get_content", [
                author,
                permlink,
            ]);
            return content;
        } catch (error) {
            throw new Error(`Failed to get post: ${error.message}`);
        }
    }

    async getReplies(author: string, permlink: string): Promise<Discussion[]> {
        try {
            this.ensureInitialized();
            const replies = await this.client!.database.call(
                "get_content_replies",
                [author, permlink]
            );
            return replies;
        } catch (error) {
            throw new Error(`Failed to get replies: ${error.message}`);
        }
    }
}

export const hiveContentProvider: Provider = new HiveContentProvider();
