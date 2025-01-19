import { IAgentRuntime, Provider } from "@elizaos/core";
import { Client, Asset } from "@hiveio/dhive";
import { validateHiveConfig } from "../environment";
import BigNumber from "bignumber.js";

export interface HiveWalletInfo {
    account: string;
    balance: {
        hive: string;
        hbd: string;
        vestingShares: string;
        delegatedVestingShares: string;
        receivedVestingShares: string;
    };
    estimatedValue: {
        hiveValue: string;
        hbdValue: string;
        vestingValue: string;
        totalValue: string;
    };
}

interface ProviderConfig {
    HIVE_API_NODE: string;
    HIVE_ACCOUNT: string;
}

interface ExtendedAccount {
    balance: string | Asset;
    hbd_balance: string | Asset;
    vesting_shares: string | Asset;
    delegated_vesting_shares: string | Asset;
    received_vesting_shares: string | Asset;
}

type HiveAccount = ExtendedAccount & {
    [key: string]: unknown;
};

export class HiveWalletProvider implements Provider {
    private client: Client | null = null;
    private config: ProviderConfig | null = null;

    private normalizeAsset(asset: string | Asset): string {
        if (typeof asset === "string") {
            return asset;
        }
        return `${asset.amount} ${asset.symbol}`;
    }

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

    async get(runtime: IAgentRuntime): Promise<HiveWalletInfo> {
        try {
            if (!this.client || !this.config) {
                await this.initialize(runtime);
            }

            this.ensureInitialized();
            return await this.getState();
        } catch (error) {
            throw new Error(`Wallet provider get failed: ${error.message}`);
        }
    }

    private async getState(): Promise<HiveWalletInfo> {
        try {
            this.ensureInitialized();

            // Get account information
            const accounts = await this.client!.database.getAccounts([
                this.config!.HIVE_ACCOUNT,
            ]);
            const account = accounts[0] as unknown as HiveAccount;

            if (!account) {
                throw new Error(
                    `Account ${this.config!.HIVE_ACCOUNT} not found`
                );
            }

            // Get current price feed
            const props =
                await this.client!.database.getDynamicGlobalProperties();
            const price =
                await this.client!.database.getCurrentMedianHistoryPrice();

            // Normalize the balance values
            const hiveBalance = this.normalizeAsset(account.balance);
            const hbdBalance = this.normalizeAsset(account.hbd_balance);
            const vestingShares = this.normalizeAsset(account.vesting_shares);
            const delegatedShares = this.normalizeAsset(
                account.delegated_vesting_shares
            );
            const receivedShares = this.normalizeAsset(
                account.received_vesting_shares
            );

            // Calculate VESTS value
            const normalizedProps = {
                total_vesting_shares: this.normalizeAsset(
                    props.total_vesting_shares
                ),
                total_vesting_fund_hive: this.normalizeAsset(
                    props.total_vesting_fund_hive
                ),
            };

            const vestHive = this.vestsToPower(vestingShares, normalizedProps);
            const delegatedHive = this.vestsToPower(
                delegatedShares,
                normalizedProps
            );
            const receivedHive = this.vestsToPower(
                receivedShares,
                normalizedProps
            );

            // Calculate effective vesting value (owned - delegated out + received)
            const effectiveVestingHive =
                vestHive - delegatedHive + receivedHive;

            // Calculate estimated values in HBD
            const hivePrice = new BigNumber(price.base.amount).div(
                price.quote.amount
            );
            const hiveValue = new BigNumber(hiveBalance.split(" ")[0]).times(
                hivePrice
            );
            const hbdValue = new BigNumber(hbdBalance.split(" ")[0]);
            const vestingValue = new BigNumber(effectiveVestingHive).times(
                hivePrice
            );

            return {
                account: this.config!.HIVE_ACCOUNT,
                balance: {
                    hive: hiveBalance,
                    hbd: hbdBalance,
                    vestingShares: vestingShares,
                    delegatedVestingShares: delegatedShares,
                    receivedVestingShares: receivedShares,
                },
                estimatedValue: {
                    hiveValue: `${hiveValue.toFixed(3)} HBD`,
                    hbdValue: `${hbdValue.toFixed(3)} HBD`,
                    vestingValue: `${vestingValue.toFixed(3)} HBD`,
                    totalValue: `${hiveValue
                        .plus(hbdValue)
                        .plus(vestingValue)
                        .toFixed(3)} HBD`,
                },
            };
        } catch (error) {
            throw new Error(`Failed to get wallet state: ${error.message}`);
        }
    }

    private vestsToPower(
        vestingShares: string,
        props: { total_vesting_shares: string; total_vesting_fund_hive: string }
    ): number {
        const totalVests = new BigNumber(
            props.total_vesting_shares.split(" ")[0]
        );
        const totalHive = new BigNumber(
            props.total_vesting_fund_hive.split(" ")[0]
        );
        const vests = new BigNumber(vestingShares.split(" ")[0]);

        return vests.times(totalHive).div(totalVests).toNumber();
    }
}

export const hiveWalletProvider: Provider = new HiveWalletProvider();
