export const unstakeTemplate = `Respond with a JSON markdown block containing only the extracted values
- Use null for any values that cannot be determined.

Example response for a 5 B2-BTC unstake:
\`\`\`json
{
    "amount": "5"
}
\`\`\`

## Recent Messages

{{recentMessages}}

Given the recent messages, extract the following information about the requested unstake:
- Amount to unstake

Respond with a JSON markdown block containing only the extracted values.`;
