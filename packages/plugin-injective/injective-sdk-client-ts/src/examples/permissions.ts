// =======================================
// Permission Module
// =======================================

export const getAddressesByRoleExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve all addresses with the role 'minter' for denomination 'peggy0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Addresses with role 'minter' retrieved successfully.",
            action: "GET_ADDRESSES_BY_ROLE",
            content: {
                addresses: [
                    "inj1address1...",
                    "inj1address2...",
                    "inj1address3...",
                ],
            },
        },
    },
];

export const getAddressRolesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch roles for address 'inj1address1...' and denomination 'peggy0x...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Roles for address 'inj1address1...' retrieved successfully.",
            action: "GET_ADDRESS_ROLES",
            content: {
                roles: ["minter", "burner"],
            },
        },
    },
];

export const getAllNamespacesExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch all namespaces.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "All namespaces retrieved successfully.",
            action: "GET_ALL_NAMESPACES",
            content: {
                namespaces: [
                    {
                        denom: "peggy0x...",
                        wasmHook: "inj1hookaddress...",
                        mintsPaused: false,
                        sendsPaused: false,
                        burnsPaused: false,
                        rolePermissions: [
                            {
                                role: "minter",
                                permissions: 1,
                            },
                            {
                                role: "burner",
                                permissions: 2,
                            },
                        ],
                        addressRoles: [
                            {
                                address: "inj1address1...",
                                roles: ["minter"],
                            },
                            {
                                address: "inj1address2...",
                                roles: ["burner"],
                            },
                        ],
                    },
                    {
                        denom: "peggy0xabc...",
                        wasmHook: "inj1anotherhook...",
                        mintsPaused: true,
                        sendsPaused: false,
                        burnsPaused: true,
                        rolePermissions: [
                            {
                                role: "minter",
                                permissions: 1,
                            },
                        ],
                        addressRoles: [
                            {
                                address: "inj1address3...",
                                roles: ["minter"],
                            },
                        ],
                    },
                    // ...additional namespaces
                ],
            },
        },
    },
];

export const getPermissionsModuleParamsExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve Peggy module parameters, including bridge settings and oracle addresses.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Peggy module parameters retrieved successfully.",
            action: "GET_PERMISSIONS_MODULE_PARAMS",
            content: {
                wasmHookQueryMaxGas: "1000000",
            },
        },
    },
];

export const getNamespaceByDenomExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Fetch namespace details for denomination 'peggy0x...' and include role information.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Namespace details retrieved successfully.",
            action: "GET_NAMESPACE_BY_DENOM",
            content: {
                namespace: {
                    denom: "peggy0x...",
                    wasmHook: "inj1hookaddress...",
                    mintsPaused: false,
                    sendsPaused: false,
                    burnsPaused: false,
                    rolePermissions: [
                        {
                            role: "minter",
                            permissions: 1,
                        },
                    ],
                    addressRoles: [
                        {
                            address: "inj1address1...",
                            roles: ["minter"],
                        },
                    ],
                },
            },
        },
    },
];

export const getVouchersForAddressExample = [
    {
        user: "{{user1}}",
        content: {
            text: "Retrieve vouchers for address 'inj1address1...'.",
        },
    },
    {
        user: "{{agent}}",
        content: {
            text: "Vouchers for address 'inj1address1...' retrieved successfully.",
            action: "GET_VOUCHERS_FOR_ADDRESS",
            content: {
                vouchers: [
                    {
                        coins: [
                            {
                                amount: "1000000000000000000",
                                denom: "peggy0x...",
                            },
                            {
                                amount: "500000000000000000",
                                denom: "peggy0xabc...",
                            },
                        ],
                    },
                    {
                        coins: [
                            {
                                amount: "2000000000000000000",
                                denom: "peggy0xdef...",
                            },
                        ],
                    },
                    // ...additional vouchers
                ],
            },
        },
    },
];
