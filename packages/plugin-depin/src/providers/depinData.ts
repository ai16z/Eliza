import {
    type IAgentRuntime,
    type Provider,
    type Memory,
    type State,
    elizaLogger,
    type ICacheManager,
} from "@elizaos/core";
import NodeCache from "node-cache";
import * as path from "path";

import type { DepinScanMetrics, DepinScanProject } from "../types/depin";

export const DEPIN_METRICS_URL =
    "https://gateway1.iotex.io/depinscan/explorer?is_latest=true";
export const DEPIN_PROJECTS_URL = "https://metrics-api.w3bstream.com/project";

export class DePINScanProvider {
    private cache: NodeCache;
    private cacheKey = "depin/metrics";

    constructor(private cacheManager: ICacheManager) {
        this.cache = new NodeCache({ stdTTL: 3600 });
    }

    private async readFromCache<T>(key: string): Promise<T | null> {
        const cached = await this.cacheManager.get<T>(
            path.join(this.cacheKey, key)
        );
        return cached;
    }

    private async writeToCache<T>(key: string, data: T): Promise<void> {
        await this.cacheManager.set(path.join(this.cacheKey, key), data, {
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });
    }

    private async getCachedData<T>(key: string): Promise<T | null> {
        // Check in-memory cache first
        const cachedData = this.cache.get<T>(key);
        if (cachedData) {
            return cachedData;
        }

        // Check file-based cache
        const fileCachedData = await this.readFromCache<T>(key);
        if (fileCachedData) {
            // Populate in-memory cache
            this.cache.set(key, fileCachedData);
            return fileCachedData;
        }

        return null;
    }

    private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
        // Set in-memory cache
        this.cache.set(cacheKey, data);

        // Write to file-based cache
        await this.writeToCache(cacheKey, data);
    }

    private async fetchDepinscanMetrics(): Promise<DepinScanMetrics> {
        const res = await fetch(DEPIN_METRICS_URL);
        return res.json();
    }

    private async fetchDepinscanProjects(): Promise<DepinScanProject[]> {
        const res = await fetch(DEPIN_PROJECTS_URL);
        return res.json();
    }

    async getDailyMetrics(): Promise<DepinScanMetrics> {
        const cacheKey = "depinscanDailyMetrics";
        const cachedData = await this.getCachedData<DepinScanMetrics>(cacheKey);
        if (cachedData) {
            console.log("Returning cached DePINScan daily metrics");
            return cachedData;
        }

        const metrics = await this.fetchDepinscanMetrics();

        this.setCachedData<DepinScanMetrics>(cacheKey, metrics);
        console.log("DePIN daily metrics cached");

        return metrics;
    }

    private abbreviateNumber = (
        value: string | number | bigint | undefined
    ): string => {
        if (value === undefined || value === null) return "";

        let num: number;

        if (typeof value === "bigint") {
            // Convert bigint to number safely for processing
            num = Number(value);
        } else if (typeof value === "number") {
            num = value;
        } else if (typeof value === "string") {
            // Parse string to number
            num = Number.parseFloat(value);
        } else {
            return ""; // Handle unexpected types gracefully
        }

        if (isNaN(num)) return value.toString(); // Return as string if not a valid number
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        return num.toString(); // Return original number as string if no abbreviation is needed
    };

    private parseProjects(projects: DepinScanProject[]): string[][] {
        const schema = [
            "project_name",
            "slug",
            "token",
            "layer_1",
            "categories",
            "market_cap",
            "token_price",
            "total_devices",
            "avg_device_cost",
            "days_to_breakeven",
            "estimated_daily_earnings",
            "chainid",
            "coingecko_id",
            "fully_diluted_valuation",
        ];

        const parsedProjects = projects.map((project) => {
            const {
                project_name,
                slug,
                token,
                layer_1,
                categories,
                market_cap,
                token_price,
                total_devices,
                avg_device_cost,
                days_to_breakeven,
                estimated_daily_earnings,
                chainid,
                coingecko_id,
                fully_diluted_valuation,
            } = project;

            // Create an array following the schema
            return [
                project_name,
                slug,
                token,
                layer_1 ? layer_1.join(", ") : "", // Flatten array for compact representation
                categories ? categories.join(", ") : "", // Flatten array for compact representation
                this.abbreviateNumber(market_cap?.toString()),
                token_price?.toString(),
                total_devices?.toString(),
                avg_device_cost?.toString(),
                days_to_breakeven?.toString(),
                estimated_daily_earnings?.toString(),
                chainid?.toString(),
                coingecko_id?.toString(),
                this.abbreviateNumber(fully_diluted_valuation?.toString()),
            ];
        });

        parsedProjects.unshift(schema);

        return parsedProjects;
    }

    async getProjects(): Promise<string[][]> {
        const cacheKey = "depinscanProjects";
        const cachedData = await this.getCachedData<string[][]>(cacheKey);
        if (cachedData) {
            console.log("Returning cached DePINScan projects");
            return cachedData;
        }

        const projects = await this.fetchDepinscanProjects();
        const parsedProjects = this.parseProjects(projects);

        this.setCachedData<string[][]>(cacheKey, parsedProjects);
        console.log("DePINScan projects cached");

        return parsedProjects;
    }
}

export const depinDataProvider: Provider = {
    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> {
        try {
            const depinscan = new DePINScanProvider(runtime.cacheManager);
            const depinscanMetrics = await depinscan.getDailyMetrics();
            const depinscanProjects = await depinscan.getProjects();

            return `
                #### **DePINScan Daily Metrics**
                ${depinscanMetrics}
                #### **DePINScan Projects**
                ${depinscanProjects}
            `;
        } catch (error) {
            elizaLogger.error("Error in DePIN data provider:", error);
            return null;
        }
    },
};
