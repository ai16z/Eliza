export const cosmosTransferTemplate = `Given the recent messages and cosmos wallet information below:
{{recentMessages}}
{{walletInfo}}
Extract the following information about the requested transfer:
1. **Amount**:
   - Extract only the numeric value from the instruction.
   - The value must be a string representing the amount in the display denomination (e.g., "0.0001" for OM, chimba, etc.). Do not include the symbol.

2. **Recipient Address**:
   - Must be a valid Bech32 address that matches the chain's address prefix.
   - Example for "mantra": "mantra1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf".

3. **Token Symbol**:
   - The symbol must be a string representing the token's display denomination (e.g., "OM", "chimba", etc.).

4. **Chain name**:
   - Identify the chain mentioned in the instruction where the transfer will take place (e.g., carbon, axelar, mantrachaintestnet2).
   - Provide this as a string.

Respond with a JSON markdown block containing only the extracted values. All fields except 'token' are required:
\`\`\`json
{
    "symbol": string, // The symbol of token.
    "amount": string, // The amount to transfer as a string.
    "toAddress": string, // The recipient's address.
    "chainName": string // The chain name.
\`\`\`

Example reponse for the input: "Make transfer 0.0001 OM to mantra1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf on mantrachaintestnet2", the response should be:
\`\`\`json
{
    "symbol": "OM",
    "amount": "0.0001",
    "toAddress": "mantra1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf",
    "chainName": "mantrachaintestnet2"
\`\`\`
Now respond with a JSON markdown block containing only the extracted values.
`;

export const cosmosIBCTransferTemplate = `Given the recent messages and cosmos wallet information below:
{{recentMessages}}
{{walletInfo}}
Extract the following information about the requested IBC transfer:
1. **Amount**:
   - Extract only the numeric value from the instruction.
   - The value must be a string representing the amount in the display denomination (e.g., "0.0001" for ATOM, OSMO, etc.). Do not include the symbol.

2. **Recipient Address**:
   - Must be a valid Bech32 address that matches the target chain's address prefix.
   - Example for "cosmoshub": "cosmos1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf".

3. **Token Symbol**:
   - The symbol must be a string representing the token's display denomination (e.g., "ATOM", "OSMO", etc.).

4. **Source Chain Name**:
   - Identify the source chain mentioned in the instruction (e.g., cosmoshub, osmosis, axelar).
   - Provide this as a string.

5. **Target Chain Name**:
   - Identify the target chain mentioned in the instruction (e.g., cosmoshub, osmosis, axelar).
   - Provide this as a string.

Respond with a JSON markdown block containing only the extracted values. All fields are required:
\`\`\`json
{
    "symbol": string, // The symbol of the token.
    "amount": string, // The amount to transfer as a string.
    "toAddress": string, // The recipient's address.
    "chainName": string, // The source chain name.
    "targetChainName": string // The target chain name.
}
\`\`\`

Example response for the input: "Make an IBC transfer of 0.0001 ATOM to osmo1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf from cosmoshub to osmosis", the response should be:
\`\`\`json
{
    "symbol": "ATOM",
    "amount": "0.0001",
    "toAddress": "osmo1pcnw46km8m5amvf7jlk2ks5std75k73aralhcf",
    "chainName": "cosmoshub",
    "targetChainName": "osmosis"
}
\`\`\`

Now respond with a JSON markdown block containing only the extracted values.
`;
