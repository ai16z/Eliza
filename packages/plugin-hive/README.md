# @elizaos/plugin-hive

Core Hive blockchain plugin for Eliza OS that provides essential services and actions for token operations, content interactions, and wallet management.

## Overview

This plugin provides comprehensive functionality to interact with the Hive blockchain, including:

- HIVE/HBD token transfers and management
- Content creation and curation
- Account operations and wallet management
- Market operations and order management
- Following/follower relationship management
- Witness operations
- Blockchain data querying

## Installation

```bash
pnpm install @elizaos/plugin-hive
```

## Configuration

The plugin requires the following environment variables:

```env
HIVE_ACCOUNT=your_hive_account
HIVE_POSTING_KEY=your_posting_key
HIVE_ACTIVE_KEY=your_active_key
HIVE_NETWORK=mainnet|testnet
HIVE_API_NODE=https://api.hive.blog
```

## Usage

Import and register the plugin in your Eliza configuration:

```typescript
import { hivePlugin } from "@elizaos/plugin-hive";

export default {
    plugins: [hivePlugin],
    // ... other configuration
};
```

### Key Features

#### Token Operations

```typescript
// Send HIVE tokens
const result = await eliza.execute({
    action: "SEND_HIVE",
    content: {
        to: "recipient",
        amount: "1.000 HIVE",
        memo: "Payment for services",
    },
});

// Convert HIVE to HBD
const result = await eliza.execute({
    action: "CONVERT_HIVE",
    content: {
        amount: "100.000 HIVE",
    },
});
```

#### Content Management

```typescript
// Create a post
const result = await eliza.execute({
    action: "CREATE_POST",
    content: {
        title: "My First Post",
        body: "This is the content of my post",
        tags: ["hive", "blog", "introduction"],
    },
});

// Vote on content
const result = await eliza.execute({
    action: "VOTE",
    content: {
        author: "username",
        permlink: "post-permlink",
        weight: 10000, // 100% upvote
    },
});
```

## API Reference

### Actions

#### `SEND_HIVE`

Transfers HIVE tokens to another account.

```typescript
{
    action: 'SEND_HIVE',
    content: {
        to: string,        // Recipient's Hive account
        amount: string,    // Amount with currency (e.g., "1.000 HIVE")
        memo?: string     // Optional memo
    }
}
```

#### `SEND_HBD`

Transfers HBD tokens to another account.

```typescript
{
    action: 'SEND_HBD',
    content: {
        to: string,
        amount: string,    // Amount with currency (e.g., "1.000 HBD")
        memo?: string
    }
}
```

#### `CREATE_POST`

Creates a new post on the Hive blockchain.

```typescript
{
    action: 'CREATE_POST',
    content: {
        title: string,
        body: string,
        tags: string[],
        beneficiaries?: Array<{
            account: string,
            weight: number
        }>
    }
}
```

### Providers

#### Wallet Provider

Provides wallet information and portfolio tracking.

```typescript
const walletInfo = await eliza.getProvider("wallet");
// Returns:
// - Account balance
// - Token balances (HIVE, HBD)
// - Estimated account value
// - Reward balance
```

#### Content Provider

Manages content-related operations.

```typescript
const contentInfo = await eliza.getProvider("content");
// Returns:
// - User's posts
// - Feed content
// - Trending posts
// - Recent posts
```

## Development

### Building

```bash
pnpm run build
```

### Testing

```bash
pnpm test
```

## Security Best Practices

1. **Key Management**

    - Store private keys securely
    - Use environment variables
    - Never expose keys in code
    - Implement key rotation

2. **Transaction Safety**

    - Validate all inputs
    - Implement amount limits
    - Double-check recipients
    - Monitor transaction status

3. **Content Safety**
    - Validate post content
    - Check for spam patterns
    - Implement content filters
    - Monitor for abuse

## Error Handling

The plugin implements comprehensive error handling for:

- Network connectivity issues
- Transaction failures
- Invalid inputs
- Rate limiting
- API node failures
- Authorization errors

## Dependencies

- `@hiveio/dhive`: Core Hive blockchain interaction library
- `bignumber.js`: Precise number handling
- `node-cache`: Caching implementation

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## Credits

This plugin integrates with:

- [Hive Blockchain](https://hive.io/)
- [DHive](https://github.com/openhive-network/dhive)
- The Hive Developer Community

Special thanks to:

- The Hive core development team
- The Hive community
- All contributors to this plugin

## License

This plugin is part of the Eliza project. See the main project repository for license information.
