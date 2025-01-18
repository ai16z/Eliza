import { TOKEN_ADDRESSES } from "../utils/constants";

export const transferTemplate = `Respond with a JSON markdown block containing only the extracted values
- Use null for any values that cannot be determined.
- Use address zero for native B2-BTC transfers.

Example response for a 10 uBTC transfer:
\`\`\`json
{
    "tokenAddress": "0x796e4D53067FF374B89b2Ac101ce0c1f72ccaAc2",
    "recipient": "0x4f9e2dc50B4Cd632CC2D24edaBa3Da2a9338832a",
    "amount": "10"
}
\`\`\`

Example response for a 0.1 B2-BTC transfer:
\`\`\`json
{
    "tokenAddress": "0x0000000000000000000000000000000000000000",
    "recipient": "0x4f9e2dc50B4Cd632CC2D24edaBa3Da2a9338832a",
    "amount": "0.1"
}
\`\`\`

## Token Addresses

${Object.entries(TOKEN_ADDRESSES)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n")}

## Recent Messages

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Token contract address
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;