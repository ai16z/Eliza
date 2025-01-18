export const stakeTemplate = `Respond with a JSON markdown block containing only the extracted values

Example response for a 10 B2-BTC stake:
\`\`\`json
{
    "amount": "10"
}
\`\`\`

## Recent Messages

{{recentMessages}}

Given the recent messages, extract the following information about the requested stake:
- Amount to stake

Respond with a JSON markdown block containing only the extracted values.`;