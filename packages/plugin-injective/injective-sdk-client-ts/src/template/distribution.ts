export const getDistributionModuleParamsTemplate = `
Extract the following details for distribution module parameters:
- **communityTax** (string): Tax rate for community fund
- **baseProposerReward** (string): Base reward for block proposer
- **bonusProposerReward** (string): Bonus reward for block proposer
- **withdrawAddrEnabled** (boolean): Whether withdraw address modification is enabled

Provide the response in the following JSON format:

\`\`\`json
{
    "communityTax": "0.020000000000000000",
    "baseProposerReward": "0.010000000000000000",
    "bonusProposerReward": "0.040000000000000000",
    "withdrawAddrEnabled": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegatorRewardsForValidatorTemplate = `
Extract the following details for delegator rewards from specific validator:
- **delegatorAddress** (string): Address of the delegator
- **validatorAddress** (string): Address of the validator

Provide the request in the following JSON format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "denom": "inj",
        "amount": "1000000000"
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegatorRewardsForValidatorNoThrowTemplate = `
Extract the following details for delegator rewards from specific validator (no-throw version):
- **delegatorAddress** (string): Address of the delegator
- **validatorAddress** (string): Address of the validator

Provide the request in the following JSON format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "denom": "inj",
        "amount": "1000000000"
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegatorRewardsTemplate = `
Extract the following details for delegator rewards:
- **injectiveAddress** (string): Address of the delegator

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "validatorAddress": "injvaloper1...",
        "rewards": [
            {
                "denom": "inj",
                "amount": "1000000000"
            }
        ]
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegatorRewardsNoThrowTemplate = `
Extract the following details for delegator rewards (no-throw version):
- **injectiveAddress** (string): Address of the delegator

Provide the request in the following JSON format:

\`\`\`json
{
    "injectiveAddress": "inj1..."
}
\`\`\`

Response format:

\`\`\`json
[
    {
        "validatorAddress": "injvaloper1...",
        "rewards": [
            {
                "denom": "inj",
                "amount": "1000000000"
            }
        ]
    }
]
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgWithdrawDelegatorRewardTemplate = `
Extract the following details for withdrawing delegator rewards:
- **delegatorAddress** (string): Address of the delegator
- **validatorAddress** (string): Address of the validator

Provide the request in the following JSON format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "txHash": "0x...",
    "success": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgWithdrawValidatorCommissionTemplate = `
Extract the following details for withdrawing validator commission:
- **validatorAddress** (string): Address of the validator

Provide the request in the following JSON format:

\`\`\`json
{
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response format:

\`\`\`json
{
    "txHash": "0x...",
    "success": true
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
