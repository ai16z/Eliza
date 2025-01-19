// WASM and WasmX Module Templates

// WasmX Module Templates

export const getWasmxModuleParamsTemplate = `
Request to fetch WasmX module parameters. No parameters required.

Response will contain module parameters as per the WasmX params structure:
- **params** (object): Module parameters and settings

Response format:

\`\`\`json
{
    "params": {
        "is_execution_enabled": true,
        "registration_fee": {
            "denom": "inj",
            "amount": "100000000000000000000"
        },
        "max_begin_block_tx_gas": 1000000,
        "max_contract_gas_limit": 500000,
        "min_gas_price": "1000000000"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getWasmxModuleStateTemplate = `
Request to fetch WasmX module state. No parameters required.

Response will contain the complete module state:
- **params** (object): Module parameters
- **registered_contracts** (array): List of registered contracts
  - **address** (string): Contract address
  - **gas_limit** (number): Gas limit
  - **gas_price** (string): Gas price
  - **is_executable** (boolean): Execution status
  - **code_id** (number): Contract code ID

Response format:

\`\`\`json
{
    "params": {
        "is_execution_enabled": true,
        "registration_fee": {
            "denom": "inj",
            "amount": "100000000000000000000"
        },
        "max_begin_block_tx_gas": 1000000,
        "max_contract_gas_limit": 500000,
        "min_gas_price": "1000000000"
    },
    "registered_contracts": [
        {
            "address": "inj1...",
            "gas_limit": 1000000,
            "gas_price": "1000000000",
            "is_executable": true,
            "code_id": 1
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Standard WASM Module Templates

export const getContractAccountsBalanceTemplate = `
Extract the following details for fetching contract accounts balance:
- **contractAddress** (string): Contract address
- **pagination** (object): Optional pagination parameters
  - **key** (string): Page key
  - **offset** (number): Page offset
  - **limit** (number): Page size
  - **countTotal** (boolean): Whether to count total

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain contract balances and information:
- **tokenInfo** (object): Token information
  - **name** (string): Token name
  - **symbol** (string): Token symbol
  - **decimals** (number): Token decimals
  - **total_supply** (string): Total supply
  - **mint** (string): Mint address
- **contractInfo** (object): Contract information
  - **codeId** (number): Code ID
  - **creator** (string): Creator address
  - **admin** (string): Admin address
  - **label** (string): Contract label
- **marketingInfo** (object): Marketing information
  - **project** (string): Project name
  - **description** (string): Project description
  - **logo** (object): Logo information
    - **url** (string): Logo URL
  - **marketing** (string): Marketing info
- **contractAccountsBalance** (array): List of account balances
  - **account** (string): Account address
  - **balance** (string): Account balance

Response format:

\`\`\`json
{
    "tokenInfo": {
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18,
        "total_supply": "1000000000000000000000000",
        "mint": "inj1..."
    },
    "contractInfo": {
        "codeId": 1,
        "creator": "inj1...",
        "admin": "inj1...",
        "label": "Example Contract"
    },
    "marketingInfo": {
        "project": "Example Project",
        "description": "Example Description",
        "logo": {
            "url": "https://example.com/logo.png"
        },
        "marketing": "Example Marketing Info"
    },
    "contractAccountsBalance": [
        {
            "account": "inj1...",
            "balance": "1000000000000000000"
        }
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "100"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractStateTemplate = `
Extract the following details for fetching contract state:
- **contractAddress** (string): Contract address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain contract state with same structure as getContractAccountsBalanceTemplate.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractInfoTemplate = `
Extract the following details for fetching contract information:
- **contractAddress** (string): Contract address

Request format:

\`\`\`json
{
    "contractAddress": "inj1..."
}
\`\`\`

Response will contain contract information:
- **codeId** (number): Code ID
- **creator** (string): Creator address
- **admin** (string): Admin address
- **label** (string): Contract label
- **created** (object): Creation information
  - **blockHeight** (number): Block height
  - **txIndex** (number): Transaction index
- **ibcPortId** (string): IBC port ID
- **extension** (object): Optional extension data

Response format:

\`\`\`json
{
    "codeId": 1,
    "creator": "inj1...",
    "admin": "inj1...",
    "label": "Example Contract",
    "created": {
        "blockHeight": 1000000,
        "txIndex": 0
    },
    "ibcPortId": "wasm.1",
    "extension": {
        "typeUrl": "example",
        "value": "base64encodeddata"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractHistoryTemplate = `
Extract the following details for fetching contract history:
- **contractAddress** (string): Contract address

Request format:

\`\`\`json
{
    "contractAddress": "inj1..."
}
\`\`\`

Response will contain contract history:
- **entriesList** (array): List of history entries
  - **operation** (string): Operation type
  - **codeId** (number): Code ID
  - **updated** (object): Update information
    - **blockHeight** (number): Block height
    - **txIndex** (number): Transaction index
  - **msg** (string): Operation message
- **pagination** (object): Pagination information

Response format:

\`\`\`json
{
    "entriesList": [
        {
            "operation": "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
            "codeId": 1,
            "updated": {
                "blockHeight": 1000000,
                "txIndex": 0
            },
            "msg": "base64encodeddata"
        }
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "10"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getSmartContractStateTemplate = `
Extract the following details for fetching smart contract state:
- **contractAddress** (string): Contract address
- **query** (string or object): Query parameters

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "query": {
        "get_state": {}
    }
}
\`\`\`

Response will contain contract-specific state data.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getRawContractStateTemplate = `
Extract the following details for fetching raw contract state:
- **contractAddress** (string): Contract address
- **query** (string): Query key

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "query": "base64encodedkey"
}
\`\`\`

Response will contain raw contract state data.

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractCodesTemplate = `
Extract the following details for fetching contract codes:
- **pagination** (object): Optional pagination parameters

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

Response will contain list of code information:
- **codeInfosList** (array): List of code information
  - **codeId** (number): Code ID
  - **creator** (string): Creator address
  - **dataHash** (string): Code data hash
- **pagination** (object): Pagination information

Response format:

\`\`\`json
{
    "codeInfosList": [
        {
            "codeId": 1,
            "creator": "inj1...",
            "dataHash": "base64encodeddata"
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

export const getContractCodeTemplate = `
Extract the following details for fetching contract code:
- **codeId** (number): Code ID

Request format:

\`\`\`json
{
    "codeId": 1
}
\`\`\`

Response will contain code information and data:
- **codeInfo** (object): Code information
  - **codeId** (number): Code ID
  - **creator** (string): Creator address
  - **dataHash** (string): Code data hash
- **data** (string): Base64 encoded WASM bytecode

Response format:

\`\`\`json
{
    "codeInfo": {
        "codeId": 1,
        "creator": "inj1...",
        "dataHash": "base64encodeddata"
    },
    "data": "base64encodedwasmcode"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractCodeContractsTemplate = `
Extract the following details for fetching contracts by code ID:
- **codeId** (number): Code ID
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "codeId": 1,
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain list of contracts:
- **contractsList** (array): List of contract addresses
- **pagination** (object): Pagination information

Response format:

\`\`\`json
{
    "contractsList": [
        "inj1...",
        "inj2..."
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "20"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Message Templates

export const msgStoreCodeTemplate = `
Extract the following details for storing contract code:
- **sender** (string): Sender address
- **wasmByteCode** (string): Base64 encoded WASM bytecode
- **instantiatePermission** (object): Optional instantiation permission
  - **permission** (string): Permission type
  - **address** (string): Restricted address

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "wasmByteCode": "base64encodedwasmcode",
    "instantiatePermission": {
        "permission": "Everybody",
        "address": ""
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgUpdateAdminTemplate = `
Extract the following details for updating contract admin:
- **sender** (string): Current admin address
- **newAdmin** (string): New admin address
- **contract** (string): Contract address

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "newAdmin": "inj2...",
    "contract": "inj3..."
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgExecuteContractTemplate = `
Extract the following details for executing contract:
- **sender** (string): Sender address
- **contract** (string): Contract address
- **msg** (string or object): Execute message
- **funds** (array): Optional funds to send
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "contract": "inj2...",
    "msg": {
        "execute": {
            "action": "transfer",
            "amount": "1000000000000000000",
            "recipient": "inj3..."
        }
    },
    "funds": [
        {
            "denom": "inj",
            "amount": "1000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgMigrateContractTemplate = `
Extract the following details for migrating contract:
- **sender** (string): Admin address
- **contract** (string): Contract address
- **codeId** (number): New code ID
- **msg** (string or object): Migration message

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "contract": "inj2...",
    "codeId": 2,
    "msg": {
        "migrate": {
            "new_parameter": "value"
        }
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgInstantiateContractTemplate = `
Extract the following details for instantiating contract:
- **sender** (string): Sender address
- **admin** (string): Optional admin address
- **codeId** (number): Code ID to instantiate
- **label** (string): Contract label
- **msg** (object): Instantiation message
- **funds** (array): Optional funds to send
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "admin": "inj2...",
    "codeId": 1,
    "label": "Example Contract",
    "msg": {
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18,
        "initial_balances": [
            {
                "address": "inj3...",
                "amount": "1000000000000000000000000"
            }
        ]
    },
    "funds": [
        {
            "denom": "inj",
            "amount": "1000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgExecuteContractCompatTemplate = `
Extract the following details for executing contract in compatibility mode:
- **sender** (string): Sender address
- **contract** (string): Contract address
- **msg** (object): Execute message in compatibility format
- **funds** (array): Optional funds to send
  - **denom** (string): Token denomination
  - **amount** (string): Token amount

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "contract": "inj2...",
    "msg": {
        "send": {
            "to": "inj3...",
            "amount": "1000000000000000000"
        }
    },
    "funds": [
        {
            "denom": "inj",
            "amount": "1000000000000000000"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const msgPrivilegedExecuteContractTemplate = `
Extract the following details for privileged contract execution:
- **sender** (string): Privileged sender address
- **contract** (string): Contract address
- **msg** (object): Privileged execute message

Request format:

\`\`\`json
{
    "sender": "inj1...",
    "contract": "inj2...",
    "msg": {
        "privileged_action": {
            "parameter": "value"
        }
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Additional Query Templates for Contract State

export const getContractStateByKeyTemplate = `
Extract the following details for fetching contract state by key:
- **contractAddress** (string): Contract address
- **key** (string): State key in base64 format

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "key": "base64encodedkey"
}
\`\`\`

Response will contain state value for the given key in base64 format.

Response format:

\`\`\`json
{
    "data": "base64encodedvalue"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractHistoryByOperationTemplate = `
Extract the following details for fetching contract history by operation type:
- **contractAddress** (string): Contract address
- **operationType** (string): Operation type (Init/Migrate/Genesis)

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "operationType": "Init"
}
\`\`\`

Response will contain filtered history entries:
- **entries** (array): List of history entries matching the operation type
  - **operation** (string): Operation type
  - **codeId** (number): Code ID
  - **updated** (object): Update information
    - **blockHeight** (number): Block height
    - **txIndex** (number): Transaction index
  - **msg** (string): Operation message

Response format:

\`\`\`json
{
    "entries": [
        {
            "operation": "Init",
            "codeId": 1,
            "updated": {
                "blockHeight": 1000000,
                "txIndex": 0
            },
            "msg": "base64encodeddata"
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getContractCodeHistoryTemplate = `
Extract the following details for fetching complete contract code history:
- **contractAddress** (string): Contract address
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain complete code history:
- **history** (array): List of all code changes
  - **codeId** (number): Code ID
  - **timeStamp** (string): Change timestamp
  - **operation** (string): Operation type
  - **msg** (string): Operation message
  - **initiator** (string): Change initiator address
- **pagination** (object): Pagination information

Response format:

\`\`\`json
{
    "history": [
        {
            "codeId": 1,
            "timeStamp": "2024-01-01T00:00:00Z",
            "operation": "Init",
            "msg": "base64encodeddata",
            "initiator": "inj1..."
        }
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "10"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Templates for Contract Events and Logs

export const getContractEventsTemplate = `
Extract the following details for fetching contract events:
- **contractAddress** (string): Contract address
- **eventType** (string): Optional event type filter
- **pagination** (object): Optional pagination parameters

Request format:

\`\`\`json
{
    "contractAddress": "inj1...",
    "eventType": "wasm",
    "pagination": {
        "key": "abc123...",
        "offset": 0,
        "limit": 100,
        "countTotal": true
    }
}
\`\`\`

Response will contain contract events:
- **events** (array): List of contract events
  - **type** (string): Event type
  - **attributes** (array): Event attributes
    - **key** (string): Attribute key
    - **value** (string): Attribute value
  - **blockHeight** (number): Block height
  - **txHash** (string): Transaction hash
- **pagination** (object): Pagination information

Response format:

\`\`\`json
{
    "events": [
        {
            "type": "wasm",
            "attributes": [
                {
                    "key": "action",
                    "value": "transfer"
                },
                {
                    "key": "amount",
                    "value": "1000000000000000000"
                }
            ],
            "blockHeight": 1000000,
            "txHash": "0x..."
        }
    ],
    "pagination": {
        "nextKey": "xyz789...",
        "total": "100"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
