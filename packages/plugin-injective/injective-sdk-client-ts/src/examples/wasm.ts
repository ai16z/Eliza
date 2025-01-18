// =======================================
// WASM and WasmX Module
// =======================================

export const getWasmxModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve WasmX module parameters.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "WasmX module parameters retrieved successfully.",
            action: "GET_WASMX_MODULE_PARAMS",
            content: {
                params: {
                    is_execution_enabled: true,
                    registration_fee: {
                        denom: "inj",
                        amount: "100000000000000000000",
                    },
                    max_begin_block_tx_gas: 1000000,
                    max_contract_gas_limit: 500000,
                    min_gas_price: "1000000000",
                },
            },
        },
    },
];

export const getWasmxModuleStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch current state of the WasmX module.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "WasmX module state retrieved successfully.",
            action: "GET_WASMX_MODULE_STATE",
            content: {
                params: {
                    is_execution_enabled: true,
                    registration_fee: {
                        denom: "inj",
                        amount: "100000000000000000000",
                    },
                    max_begin_block_tx_gas: 1000000,
                    max_contract_gas_limit: 500000,
                    min_gas_price: "1000000000",
                },
                registered_contracts: [
                    {
                        address: "inj1contract...",
                        gas_limit: 1000000,
                        gas_price: "1000000000",
                        is_executable: true,
                        code_id: 1,
                    },
                    // ...additional registered contracts
                ],
            },
        },
    },
];

export const getContractAccountsBalanceExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve contract accounts balance for contract address 'inj1contract...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract accounts balance retrieved successfully.",
            action: "GET_CONTRACT_ACCOUNTS_BALANCE",
            content: {
                tokenInfo: {
                    name: "Example Token",
                    symbol: "EXT",
                    decimals: 18,
                    total_supply: "1000000000000000000000000",
                    mint: "inj1creator...",
                },
                contractInfo: {
                    codeId: 1,
                    creator: "inj1creator...",
                    admin: "inj1admin...",
                    label: "Example Contract",
                },
                marketingInfo: {
                    project: "Example Project",
                    description: "Example Description",
                    logo: {
                        url: "https://example.com/logo.png",
                    },
                    marketing: "Example Marketing Info",
                },
                contractAccountsBalance: [
                    {
                        account: "inj1account...",
                        balance: "1000000000000000000",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "100",
                },
            },
        },
    },
];

export const getContractStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract state for contract address 'inj1contract...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract state retrieved successfully.",
            action: "GET_CONTRACT_STATE",
            content: {
                tokenInfo: {
                    name: "Example Token",
                    symbol: "EXT",
                    decimals: 18,
                    total_supply: "1000000000000000000000000",
                    mint: "inj1creator...",
                },
                contractInfo: {
                    codeId: 1,
                    creator: "inj1creator...",
                    admin: "inj1admin...",
                    label: "Example Contract",
                },
                marketingInfo: {
                    project: "Example Project",
                    description: "Example Description",
                    logo: {
                        url: "https://example.com/logo.png",
                    },
                    marketing: "Example Marketing Info",
                },
                contractAccountsBalance: [
                    {
                        account: "inj1account...",
                        balance: "1000000000000000000",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "100",
                },
            },
        },
    },
];

export const getContractInfoExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve contract information for contract address 'inj1contract...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract information retrieved successfully.",
            action: "GET_CONTRACT_INFO",
            content: {
                codeId: 1,
                creator: "inj1creator...",
                admin: "inj1admin...",
                label: "Example Contract",
                created: {
                    blockHeight: 1000000,
                    txIndex: 0,
                },
                ibcPortId: "wasm.1",
                extension: {
                    typeUrl: "example",
                    value: "base64encodeddata",
                },
            },
        },
    },
];

export const getContractHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract history for contract address 'inj1contract...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract history retrieved successfully.",
            action: "GET_CONTRACT_HISTORY",
            content: {
                entriesList: [
                    {
                        operation: "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
                        codeId: 1,
                        updated: {
                            blockHeight: 1000000,
                            txIndex: 0,
                        },
                        msg: "base64encodeddata",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "10",
                },
            },
        },
    },
];

export const getSmartContractStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve smart contract state for contract address 'inj1contract...' with query { get_state: {} }.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Smart contract state retrieved successfully.",
            action: "GET_SMART_CONTRACT_STATE",
            content: {
                // Contract-specific state data
                state: {
                    key1: "value1",
                    key2: "value2",
                    // ...additional state data
                },
            },
        },
    },
];

export const getRawContractStateExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch raw contract state for contract address 'inj1contract...' with key 'base64encodedkey'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Raw contract state retrieved successfully.",
            action: "GET_RAW_CONTRACT_STATE",
            content: {
                data: "base64encodedvalue",
            },
        },
    },
];

export const getContractCodesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all contract codes with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract codes retrieved successfully.",
            action: "GET_CONTRACT_CODES",
            content: {
                codeInfosList: [
                    {
                        codeId: 1,
                        creator: "inj1creator...",
                        dataHash: "base64encodeddata",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "50",
                },
            },
        },
    },
];

export const getContractCodeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract code for code ID 1.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract code retrieved successfully.",
            action: "GET_CONTRACT_CODE",
            content: {
                codeInfo: {
                    codeId: 1,
                    creator: "inj1creator...",
                    dataHash: "base64encodeddata",
                },
                data: "base64encodedwasmcode",
            },
        },
    },
];

export const getContractCodeContractsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all contracts for code ID 1 with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contracts for code ID 1 retrieved successfully.",
            action: "GET_CONTRACT_CODE_CONTRACTS",
            content: {
                contractsList: ["inj1contract1...", "inj2contract2..."],
                pagination: {
                    nextKey: "xyz789...",
                    total: "20",
                },
            },
        },
    },
];

export const msgStoreCodeExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Store new contract code with sender 'inj1sender...' and WASM bytecode 'base64encodedwasmcode'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract code stored successfully.",
            action: "MSG_STORE_CODE",
            content: {
                txHash: "0xstorecodehash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgUpdateAdminExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Update admin of contract 'inj1contract...' to new admin address 'inj2newadmin...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract admin updated successfully.",
            action: "MSG_UPDATE_ADMIN",
            content: {
                txHash: "0xupdateadminhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgExecuteContractExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Execute contract 'inj2contract...' with message { execute: { action: 'transfer', amount: '1000000000000000000', recipient: 'inj3recipient...' } } and send funds [{ denom: 'inj', amount: '1000000000000000000' }].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract executed successfully.",
            action: "MSG_EXECUTE_CONTRACT",
            content: {
                txHash: "0xexecutecontracthash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgMigrateContractExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Migrate contract 'inj2contract...' to new code ID 2 with migration message { migrate: { new_parameter: 'value' } }.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract migrated successfully.",
            action: "MSG_MIGRATE_CONTRACT",
            content: {
                txHash: "0xmigratecontracthash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgInstantiateContractExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Instantiate contract with sender 'inj1sender...', admin 'inj2admin...', code ID 1, label 'Example Contract', instantiation message { name: 'Example Token', symbol: 'EXT', decimals: 18, initial_balances: [{ address: 'inj3address...', amount: '1000000000000000000000000' }] }, and send funds [{ denom: 'inj', amount: '1000000000000000000' }].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract instantiated successfully.",
            action: "MSG_INSTANTIATE_CONTRACT",
            content: {
                txHash: "0xinstantiatecontracthash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgExecuteContractCompatExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Execute contract 'inj2contract...' in compatibility mode with message { send: { to: 'inj3recipient...', amount: '1000000000000000000' } } and send funds [{ denom: 'inj', amount: '1000000000000000000' }].",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract executed successfully in compatibility mode.",
            action: "MSG_EXECUTE_CONTRACT_COMPAT",
            content: {
                txHash: "0xexecutecompathash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const msgPrivilegedExecuteContractExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Privileged execute contract 'inj2contract...' with message { privileged_action: { parameter: 'value' } }.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Privileged contract execution submitted successfully.",
            action: "MSG_PRIVILEGED_EXECUTE_CONTRACT",
            content: {
                txHash: "0xprivilegedexecutehash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                success: true,
            },
        },
    },
];

export const getContractStateByKeyExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract state for contract address 'inj1contract...' with key 'base64encodedkey'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract state for key 'base64encodedkey' retrieved successfully.",
            action: "GET_CONTRACT_STATE_BY_KEY",
            content: {
                data: "base64encodedvalue",
            },
        },
    },
];

export const getContractHistoryByOperationExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract history for contract address 'inj1contract...' with operation type 'Init'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract history for operation type 'Init' retrieved successfully.",
            action: "GET_CONTRACT_HISTORY_BY_OPERATION",
            content: {
                entries: [
                    {
                        operation: "Init",
                        codeId: 1,
                        updated: {
                            blockHeight: 1000000,
                            txIndex: 0,
                        },
                        msg: "base64encodeddata",
                    },
                ],
            },
        },
    },
];

export const getContractCodeHistoryExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve complete contract code history for contract address 'inj1contract...' with pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Complete contract code history retrieved successfully.",
            action: "GET_CONTRACT_CODE_HISTORY",
            content: {
                history: [
                    {
                        codeId: 1,
                        timeStamp: "2024-01-01T00:00:00Z",
                        operation: "Init",
                        msg: "base64encodeddata",
                        initiator: "inj1admin...",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "10",
                },
            },
        },
    },
];

export const getContractEventsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch contract events for contract address 'inj1contract...' with event type 'wasm' and pagination key 'abc123...', offset 0, limit 100, and count total.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Contract events retrieved successfully.",
            action: "GET_CONTRACT_EVENTS",
            content: {
                events: [
                    {
                        type: "wasm",
                        attributes: [
                            {
                                key: "action",
                                value: "transfer",
                            },
                            {
                                key: "amount",
                                value: "1000000000000000000",
                            },
                        ],
                        blockHeight: 1000000,
                        txHash: "0xeventtxhash123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                    },
                ],
                pagination: {
                    nextKey: "xyz789...",
                    total: "100",
                },
            },
        },
    },
];
