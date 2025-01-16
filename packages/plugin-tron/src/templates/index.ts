export const transferTemplate = `You are an AI assistant specialized in processing cryptocurrency transfer requests. Your task is to extract specific information from user messages and format it into a structured JSON response.

First, review the recent messages from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

Here's a list of supported chains:
<supported_chains>
{{supportedChains}}
</supported_chains>

Your goal is to extract the following information about the requested transfer:
1. Amount to transfer (in the chain's native units, without the coin symbol)
2. Recipient address (must be a valid address for the specified chain)
3. Token address (if not a native token transfer)

Before providing the final JSON output, show your reasoning process inside <analysis> tags. Follow these steps:

1. Identify the relevant information from the user's message:
   - Quote the part of the message mentioning the chain.
   - Quote the part mentioning the amount.
   - Quote the part mentioning the recipient address.
   - Quote the part mentioning the token (if any).

2. Validate each piece of information:
   - **Amount**: Attempt to convert the amount to a number to verify it's valid.
   - **Address**:
     - For TRON: Validate that it is a Base58 address (commonly starting with "T").
   - **Token**: Note whether it's a native transfer or if a specific token is mentioned.

3. If any information is missing or invalid, prepare an appropriate error message.

4. If all information is valid, summarize your findings.

5. Prepare the JSON structure based on your analysis.

The JSON should follow this structure:

\`\`\`json
{
    "amount": string,
    "toAddress": string,
    "token": string | null
}
\`\`\`

**Validation Details**:
- **Amount**: Must be a valid numeric string.
- **Recipient Address**: Must be a valid Base58 TRON address.
- **Token**: Set to null for native transfers, or include the token address if specified.

**Example Scenarios**:
- If the user says "Transfer 100 TRX to TXXXXXXXXX", the JSON should reflect TRON chain details and set "token" to null.
- If the user says "Transfer 100 USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t) to TXXXXXXXXX", the JSON should reflect TRON chain details and set "token" to "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t".
Now, process the user's request and provide your response.`;

export const bridgeTemplate = `Given the recent messages and wallet information below:

<recent_messages>
{{recentMessages}}
</recent_messages>

<wallet_info>
{{walletInfo}}
</wallet_info>

Extract the following information about the requested token bridge:
- Token address to bridge
- Destination chain
- Amount to bridge: Must be a string representing the amount in the chain's native units (only number without coin symbol, e.g., "0.1")
- Destination address (if specified)

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "token": string | null,
    "toChain": "ethereum" | "abstract" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | "alienx" | "tron" | "ton" | null,
    "amount": string | null,
    "toAddress": string | null
}
\`\`\`

### Validation Steps:
1. **Token**: Identify the token address mentioned by the user. Set to null if no specific token is mentioned.
2. **Destination Chains**:
   - Must exactly match one of the supported chains listed above.
   - If the chain is not explicitly stated, infer it based on wallet information or previous context in the conversation.
3. **Amount**:
   - Ensure it is a valid numeric string without any symbols or extra characters.
   - If not provided, set to null.
4. **Destination Address**:
   - Validate based on the destination chain:
     - **TRON**: Must be a valid Base58 address starting with "T".
     - **EVM**: Must be a valid Ethereum-style address (starting with "0x").
   - If no address is provided, set to null.

### Additional Notes:
- If any required information is missing or invalid, respond with an appropriate error message.
- The JSON response must only include the fields outlined above and must strictly adhere to the schema.

Now, process the user's request and provide your response.
`;

export const swapTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested token swap:
- Input token address (the token being sold)
- Output token address (the token being bought)
- Amount to swap: Must be a string representing the amount in the chain's native units (only number without coin symbol, e.g., "100")
- Slippage tolerance (optional, default is 0.5% if not specified)

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "inputToken": string | null,
    "outputToken": string | null,
    "amount": string | null,
    "slippage": number | null
}
\`\`\`

**Validation Details**:
1. **Amount**:
   - Verify the amount is a valid numeric string.

2. **Input and Output Tokens**:
   - Validate token TRON address: Base58.
   - Set to null if tokens are not specified.

3. **Slippage**:
   - If the user does not specify, use the default value of 0.5%.

**Example Scenarios**:
1. User says, "Swap 50 TRX to USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)":
   - Input token: null
   - Output token: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
   - Amount: "50"
   - Slippage: null (default will apply)

2. User says, "Swap 2 TRX to USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t) with 1% slippage":
   - Input token: null
   - Output token: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
   - Amount: "2"
   - Slippage: 0.01

Now, process the user's request and provide the JSON response.`;
