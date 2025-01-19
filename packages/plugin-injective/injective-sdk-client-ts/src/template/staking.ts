// Staking Module Templates Aligned with Actions

export const getStakingModuleParamsTemplate = `
Request to fetch staking module parameters. No parameters required.

Response will contain module parameters:
- **unbondingTime** (number): Time in seconds for unbonding period
- **maxValidators** (number): Maximum number of validators
- **maxEntries** (number): Maximum entries for unbonding delegation
- **historicalEntries** (number): Number of historical entries to persist
- **bondDenom** (string): Native token denomination for staking

Response format:

\`\`\`json
{
    "unbondingTime": 1209600,
    "maxValidators": 100,
    "maxEntries": 7,
    "historicalEntries": 10000,
    "bondDenom": "inj"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPoolTemplate = `
Request to fetch staking pool information. No parameters required.

Response will contain pool details:
- **notBondedTokens** (string): Amount of tokens not bonded
- **bondedTokens** (string): Amount of tokens bonded

Response format:

\`\`\`json
{
    "notBondedTokens": "1000000000000000000",
    "bondedTokens": "5000000000000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorsTemplate = `
Extract the following details for fetching validators:
- **pagination** (object): Optional pagination parameters
  - **key** (string): Page key
  - **offset** (number): Page offset
  - **limit** (number): Page size
  - **countTotal** (boolean): Whether to count total

Request format:

\`\`\`json
{
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain validator list and pagination details.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorTemplate = `
Extract the following details for fetching a specific validator:
- **address** (string): Validator operator address

Request format:

\`\`\`json
{
    "address": "injvaloper1..."
}
\`\`\`

Response will contain validator details including description, commission rates, and delegation information.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorDelegationsTemplate = `
Extract the following details for fetching validator delegations:
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of delegations to this validator.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorDelegationsNoThrowTemplate = `
Extract the following details for fetching validator delegations (safe version):
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of delegations to this validator. This version handles errors gracefully.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorUnbondingDelegationsTemplate = `
Extract the following details for fetching validator unbonding delegations:
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of unbonding delegations from this validator.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getValidatorUnbondingDelegationsNoThrowTemplate = `
Extract the following details for fetching validator unbonding delegations (safe version):
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of unbonding delegations from this validator. This version handles errors gracefully.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegationsTemplate = `
Extract the following details for fetching all delegations:
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of all delegations for this address.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegationsNoThrowTemplate = `
Extract the following details for fetching all delegations (safe version):
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of all delegations for this address. This version handles errors gracefully.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getUnbondingDelegationsTemplate = `
Extract the following details for fetching unbonding delegations:
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of unbonding delegations for this address.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getReDelegationsTemplate = `
Extract the following details for fetching redelegations:
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of redelegations for this address.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCreateValidatorTemplate = `
Extract the following details for creating a validator:
- **moniker** (string): Validator name
- **identity** (string): Optional identity string (e.g., Keybase)
- **website** (string): Optional website URL
- **securityContact** (string): Optional security contact
- **details** (string): Optional validator details
- **rate** (string): Commission rate (e.g., "0.100000000000000000")
- **maxRate** (string): Maximum commission rate
- **maxChangeRate** (string): Maximum commission change rate
- **minSelfDelegation** (string): Minimum self-delegation amount
- **delegatorAddress** (string): Delegator address
- **validatorAddress** (string): Validator address
- **pubkey** (string): Validator public key
- **value** (object): Initial self-delegation
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "description": {
        "moniker": "Validator Name",
        "identity": "keybase-id",
        "website": "https://validator.com",
        "securityContact": "security@validator.com",
        "details": "Validator details"
    },
    "commission": {
        "rate": "0.100000000000000000",
        "maxRate": "0.200000000000000000",
        "maxChangeRate": "0.010000000000000000"
    },
    "minSelfDelegation": "1000000000000000000",
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1...",
    "pubkey": "injvalconspub1...",
    "value": {
        "denom": "inj",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgEditValidatorTemplate = `
Extract the following details for editing a validator:
- **description** (object): Updated validator description
  - **moniker** (string): Optional new validator name
  - **identity** (string): Optional new identity string
  - **website** (string): Optional new website URL
  - **securityContact** (string): Optional new security contact
  - **details** (string): Optional new validator details
- **validatorAddress** (string): Validator address
- **commissionRate** (string): Optional new commission rate
- **minSelfDelegation** (string): Optional new minimum self-delegation amount

Request format:

\`\`\`json
{
    "description": {
        "moniker": "New Validator Name",
        "identity": "new-keybase-id",
        "website": "https://new-website.com",
        "securityContact": "new-security@validator.com",
        "details": "Updated validator details"
    },
    "validatorAddress": "injvaloper1...",
    "commissionRate": "0.150000000000000000",
    "minSelfDelegation": "2000000000000000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgDelegateTemplate = `
Extract the following details for delegating tokens:
- **delegatorAddress** (string): Delegator address
- **validatorAddress** (string): Validator address
- **amount** (object): Delegation amount
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1...",
    "amount": {
        "denom": "inj",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgBeginRedelegateTemplate = `
Extract the following details for beginning a redelegation:
- **delegatorAddress** (string): Delegator address
- **validatorSrcAddress** (string): Source validator address
- **validatorDstAddress** (string): Destination validator address
- **amount** (object): Amount to redelegate
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorSrcAddress": "injvaloper1...",
    "validatorDstAddress": "injvaloper2...",
    "amount": {
        "denom": "inj",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Staking Module Templates - Part 2 (Message Templates Continued)

export const msgUndelegateTemplate = `
Extract the following details for undelegating tokens:
- **delegatorAddress** (string): Delegator address
- **validatorAddress** (string): Validator address
- **amount** (object): Amount to undelegate
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1...",
    "amount": {
        "denom": "inj",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgCancelUnbondingDelegationTemplate = `
Extract the following details for canceling an unbonding delegation:
- **delegatorAddress** (string): Delegator address
- **validatorAddress** (string): Validator address
- **amount** (object): Amount to cancel unbonding
  - **denom** (string): Token denomination
  - **amount** (string): Token amount
- **creationHeight** (number): Original unbonding creation height

Request format:

\`\`\`json
{
    "delegatorAddress": "inj1...",
    "validatorAddress": "injvaloper1...",
    "amount": {
        "denom": "inj",
        "amount": "1000000000000000000"
    },
    "creationHeight": 1000000
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegationTemplate = `
Extract the following details for fetching a specific delegation:
- **injectiveAddress** (string): Delegator address
- **validatorAddress** (string): Validator address

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "validatorAddress": "injvaloper1..."
}
\`\`\`

Response will contain delegation details:
- **delegation** (object): Delegation information
  - **delegatorAddress** (string): Delegator address
  - **validatorAddress** (string): Validator address
  - **shares** (string): Delegation shares
- **balance** (object): Balance information
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Response format:

\`\`\`json
{
    "delegation": {
        "delegatorAddress": "inj1...",
        "validatorAddress": "injvaloper1...",
        "shares": "1000000000000000000"
    },
    "balance": {
        "denom": "inj",
        "amount": "1000000000000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getDelegatorsTemplate = `
Extract the following details for fetching all delegators of a validator:
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters
  - **key** (string): Page key
  - **offset** (number): Page offset
  - **limit** (number): Page size
  - **countTotal** (boolean): Whether to count total

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain delegations and pagination:
- **delegations** (array): List of delegations
- **pagination** (object): Pagination information
  - **nextKey** (string): Next page key
  - **total** (string): Total count if requested

Response format:

\`\`\`json
{
    "delegations": [
        {
            "delegation": {
                "delegatorAddress": "inj1...",
                "validatorAddress": "injvaloper1...",
                "shares": "1000000000000000000"
            },
            "balance": {
                "denom": "inj",
                "amount": "1000000000000000000"
            }
        }
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "50"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Template for NoThrow versions (handling errors gracefully)
export const getDelegatorsNoThrowTemplate = `
Extract the following details for fetching all delegators (safe version):
- **validatorAddress** (string): Validator address
- **pagination** (object): Optional pagination parameters
  - **key** (string): Page key
  - **offset** (number): Page offset
  - **limit** (number): Page size
  - **countTotal** (boolean): Whether to count total

Request format:

\`\`\`json
{
    "validatorAddress": "injvaloper1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain delegations and pagination (same format as getDelegatorsTemplate).
This version handles errors gracefully and won't throw exceptions.

Here are the recent user messages for context:
{{recentMessages}}
`;

// Additional NoThrow templates for other endpoints
export const getUnbondingDelegationsNoThrowTemplate = `
Extract the following details for fetching unbonding delegations (safe version):
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of unbonding delegations.
This version handles errors gracefully and won't throw exceptions.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getReDelegationsNoThrowTemplate = `
Extract the following details for fetching redelegations (safe version):
- **injectiveAddress** (string): Delegator address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "injectiveAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of redelegations.
This version handles errors gracefully and won't throw exceptions.

Here are the recent user messages for context:
{{recentMessages}}
`;
