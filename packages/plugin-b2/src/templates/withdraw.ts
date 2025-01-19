export const withdrawTemplate = `Respond with a JSON markdown block containing only the extracted values
- This action does not require any parameters.

Example response for a withdraw request:
\`\`\`json
{}
\`\`\`

## Recent Messages

{{recentMessages}}

Given the recent messages, confirm the request for withdrawal.

Respond with a JSON markdown block containing only an empty object.`;
