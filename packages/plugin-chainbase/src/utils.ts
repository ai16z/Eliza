import { TokenWithBalance } from "./types";

export function formatTokenBalance(token: TokenWithBalance) {
    const balanceDecimal = parseInt(token.balance, 16);
    const amount = token.decimals
        ? balanceDecimal / Math.pow(10, token.decimals)
        : balanceDecimal;

    const formattedAmount =
        amount >= 1
            ? amount.toFixed(6).replace(/\.?0+$/, "")
            : amount.toString();

    const name =
        token.symbol.length > token.name.length ? token.name : token.symbol;
    return `${formattedAmount} ${name}`;
}
