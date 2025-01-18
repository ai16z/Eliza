import { scripts } from "./assets/script.defs";
import type { FlowAccountBalanceInfo, IFlowScriptExecutor } from "./types";

/**
 * Query the balance of an EVM ERC20 token
 * @param executor
 * @param owner
 * @param evmContractAddress
 */
export async function queryEvmERC20BalanceOf(
    executor: IFlowScriptExecutor,
    owner: string,
    evmContractAddress: string
): Promise<bigint> {
    const ret = await executor.executeScript(
        scripts.evmERC20BalanceOf,
        (arg, t) => [arg(owner, t.String), arg(evmContractAddress, t.String)],
        BigInt(0)
    );
    return BigInt(ret);
}

/**
 * Query the decimals of an EVM ERC20 token
 * @param executor
 * @param evmContractAddress
 */
export async function queryEvmERC20Decimals(
    executor: IFlowScriptExecutor,
    evmContractAddress: string
): Promise<number> {
    const ret = await executor.executeScript(
        scripts.evmERC20GetDecimals,
        (arg, t) => [arg(evmContractAddress, t.String)],
        "0"
    );
    return Number.parseInt(ret);
}

/**
 * Query the total supply of an EVM ERC20 token
 * @param executor
 * @param evmContractAddress
 */
export async function queryEvmERC20TotalSupply(
    executor: IFlowScriptExecutor,
    evmContractAddress: string
): Promise<bigint> {
    const ret = await executor.executeScript(
        scripts.evmERC20GetTotalSupply,
        (arg, t) => [arg(evmContractAddress, t.String)],
        BigInt(0)
    );
    return BigInt(ret);
}

/**
 * Query the account info of a Flow address
 * @param executor
 * @param address
 */
export async function queryAccountBalanceInfo(
    executor: IFlowScriptExecutor,
    address: string
): Promise<FlowAccountBalanceInfo | undefined> {
    const ret = await executor.executeScript(
        scripts.mainGetAccountInfo,
        (arg, t) => [arg(address, t.Address)],
        undefined
    );
    if (!ret) {
        return undefined;
    }
    return {
        address: ret.address,
        balance: Number.parseFloat(ret.balance),
        coaAddress: ret.coaAddress,
        coaBalance: ret.coaBalance ? Number.parseFloat(ret.coaBalance) : undefined,
    };
}
