export interface ChainCatcherResponse {
    data: ChainCatcherData;
    message: string;
    result: number;
}

export interface ChainCatcherData {
    totle: number;
    list: ChainCatcherItem[];
}

export interface ChainCatcherItem {
    content: string;
    description: string;
    id: number;
    releaseTime: string;
    thumb: string;
    title: string;
    type: number;
    url: string;
}

export async function fetchChainCatcher(): Promise<ChainCatcherResponse> {
    try {
        // Check cache first if provided

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: "fsfa3sd45gU8945YY",
                language: "en",
            },
            body: JSON.stringify({
                type: 2,
                page: 1,
                limit: 5,
            }),
        };
        const response = await fetch(
            `https://www.chaincatcher.com/OpenApi/FetchListByType`,
            config
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
        }

        const data = await response.json();
        if (!data.data) {
            throw new Error("Failed to fetch latest news data");
        }

        return data;
    } catch (error) {
        console.error("Error fetching news data:", error);
        throw error;
    }
}
