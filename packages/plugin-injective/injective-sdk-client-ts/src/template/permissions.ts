// Permission Module Templates

export const getAddressesByRoleTemplate = `
Extract the following details for fetching addresses by role:
- **denom** (string): Token denomination
- **role** (string): Role identifier

Request format:

\`\`\`json
{
    "denom": "peggy0x...",
    "role": "minter"
}
\`\`\`

Response will contain an array of addresses:
- **addresses** (array): List of addresses associated with the role

Response format:

\`\`\`json
{
    "addresses": [
        "inj1...",
        "inj2..."
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAddressRolesTemplate = `
Extract the following details for fetching roles by address:
- **address** (string): Account address
- **denom** (string): Token denomination

Request format:

\`\`\`json
{
    "address": "inj1...",
    "denom": "peggy0x..."
}
\`\`\`

Response will contain an array of roles:
- **roles** (array): List of roles associated with the address

Response format:

\`\`\`json
{
    "roles": [
        "minter",
        "burner"
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getAllNamespacesTemplate = `
Request to fetch all namespaces. No parameters required.

Response will contain an array of namespace objects:
- **namespaces** (array): List of namespaces containing:
  - **denom** (string): Token denomination
  - **wasmHook** (string): WASM hook address
  - **mintsPaused** (boolean): Minting pause status
  - **sendsPaused** (boolean): Sending pause status
  - **burnsPaused** (boolean): Burning pause status
  - **rolePermissions** (array): List of role permissions
  - **addressRoles** (array): List of address roles

Response format:

\`\`\`json
{
    "namespaces": [
        {
            "denom": "peggy0x...",
            "wasmHook": "inj1...",
            "mintsPaused": false,
            "sendsPaused": false,
            "burnsPaused": false,
            "rolePermissions": [
                {
                    "role": "minter",
                    "permissions": 1
                }
            ],
            "addressRoles": [
                {
                    "address": "inj1...",
                    "roles": ["minter"]
                }
            ]
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getPermissionsModuleParamsTemplate = `
Request to fetch permission module parameters. No parameters required.

Response will contain module parameters:
- **wasmHookQueryMaxGas** (string): Maximum gas for WASM hook queries

Response format:

\`\`\`json
{
    "wasmHookQueryMaxGas": "1000000"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getNamespaceByDenomTemplate = `
Extract the following details for fetching namespace by denomination:
- **denom** (string): Token denomination
- **includeRoles** (boolean): Whether to include role information

Request format:

\`\`\`json
{
    "denom": "peggy0x...",
    "includeRoles": true
}
\`\`\`

Response will contain namespace details:
- **namespace** (object): Namespace information containing:
  - **denom** (string): Token denomination
  - **wasmHook** (string): WASM hook address
  - **mintsPaused** (boolean): Minting pause status
  - **sendsPaused** (boolean): Sending pause status
  - **burnsPaused** (boolean): Burning pause status
  - **rolePermissions** (array): Optional list of role permissions if includeRoles is true
  - **addressRoles** (array): Optional list of address roles if includeRoles is true

Response format:

\`\`\`json
{
    "namespace": {
        "denom": "peggy0x...",
        "wasmHook": "inj1...",
        "mintsPaused": false,
        "sendsPaused": false,
        "burnsPaused": false,
        "rolePermissions": [
            {
                "role": "minter",
                "permissions": 1
            }
        ],
        "addressRoles": [
            {
                "address": "inj1...",
                "roles": ["minter"]
            }
        ]
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getVouchersForAddressTemplate = `
Extract the following details for fetching vouchers by address:
- **address** (string): Account address

Request format:

\`\`\`json
{
    "address": "inj1..."
}
\`\`\`

Response will contain array of vouchers:
- **vouchers** (array): List of voucher objects containing:
  - **coins** (array): List of coin objects containing:
    - **amount** (string): Token amount
    - **denom** (string): Token denomination

Response format:

\`\`\`json
{
    "vouchers": [
        {
            "coins": [
                {
                    "amount": "1000000000000000000",
                    "denom": "peggy0x..."
                }
            ]
        }
    ]
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
