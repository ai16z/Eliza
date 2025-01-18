import puppeteer from 'puppeteer';

interface DexScreenerResponse {
    schemaVersion: string;
    pairs: Array<{
        chainId: string;
        dexId: string;
        pairAddress: string;
        baseToken: {
            address: string;
            name: string;
            symbol: string;
            decimals: number;
        };
        price: string;
        priceUsd: string;
        txns: {
            m5: { buys: number; sells: number; };
            h1: { buys: number; sells: number; };
            h6: { buys: number; sells: number; };
            h24: { buys: number; sells: number; };
        };
        volume: {
            m5: number;
            h1: number;
            h6: number;
            h24: number;
        };
        priceChange: {
            m5: number;
            h1: number;
            h6: number;
            h24: number;
        };
    }>;
}

export async function getDexScreenerData(): Promise<DexScreenerResponse> {
    const browser = await puppeteer.launch({
        headless: 'new'
    });

    try {
        const page = await browser.newPage();

        // Navigate to DexScreener
        await page.goto('https://dexscreener.com');

        // Wait for the __SERVER_DATA to be available
        const serverData = await page.evaluate(() => {
            return (window as any).__SERVER_DATA;
        });

        return serverData;

    } catch (error) {
        console.error('Error fetching DexScreener data:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

export function analyzePair(pair: DexScreenerResponse['pairs'][0]) {
    const volumeThreshold = 10000; // $10k minimum volume
    const priceChangeThreshold = 5; // 5% price change threshold

    // Check if pair meets basic criteria
    if (pair.volume.h24 < volumeThreshold) {
        return false;
    }

    // Check for significant price movement
    if (Math.abs(pair.priceChange.h1) > priceChangeThreshold) {
        return {
            symbol: pair.baseToken.symbol,
            price: Number.parseFloat(pair.priceUsd),
            priceChange: pair.priceChange.h1,
            volume24h: pair.volume.h24,
            buyCount: pair.txns.h1.buys,
            sellCount: pair.txns.h1.sells
        };
    }

    return false;
}