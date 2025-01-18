# Injective SDK Client TypeScript

A TypeScript client implementation for interacting with the Injective Protocol blockchain, providing comprehensive access to both chain and indexer gRPC endpoints.

## Project Structure

```
plugin-injective/
├── .vscode/
├── injective-sdk-client-ts/
│   ├── src/
│   │   ├── exceptions/
│   │   ├── grpc/
│   │   │   ├── grpc-base.ts          # Base gRPC client implementation
│   │   │   └── modules/              # Module-specific implementations
│   │   │       ├── auction.ts
│   │   │       ├── auth.ts
│   │   │       ├── authz.ts
│   │   │       ├── bank.ts
│   │   │       ├── distribution.ts
│   │   │       ├── exchange.ts
│   │   │       ├── explorer.ts
│   │   │       ├── gov.ts
│   │   │       ├── ibc.ts
│   │   │       ├── insurance-fund.ts
│   │   │       ├── mint.ts
│   │   │       ├── mito.ts
│   │   │       ├── oracle.ts
│   │   │       ├── peggy.ts
│   │   │       ├── permissions.ts
│   │   │       ├── staking.ts
│   │   │       ├── token-factory.ts
│   │   │       ├── wasm.ts
│   │   │       └── wasmx.ts
│   │   ├── template/
│   │   └── types/
│   ├── .eslintignore
│   ├── .eslintrc.js
│   ├── eslint.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
```

## Features

- **Comprehensive Module Support**: Includes implementations for all major Injective Protocol modules
- **Dual API Support**: Handles both Chain gRPC and Indexer gRPC endpoints
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Error Handling**: Custom exception handling for gRPC-specific errors
- **Network Flexibility**: Supports multiple network types (Mainnet, Testnet, etc.)

## Core Components

### InjectiveGrpcBase

The base class that provides fundamental gRPC functionality:
- Network configuration management
- Connection handling
- Request/query execution
- Message broadcasting capabilities

### Supported Modules

1. **Chain gRPC Modules**
   - Auction
   - Auth/AuthZ
   - Bank
   - Distribution
   - Exchange
   - Governance
   - IBC
   - Insurance Fund
   - Mint
   - Oracle
   - Peggy
   - Permissions
   - Staking
   - Token Factory
   - Wasm/WasmX

2. **Indexer gRPC Modules**
   - Account & Portfolio
   - Derivatives
   - Spot Trading
   - Explorer
   - Insurance Fund
   - Mito
   - Oracle
   - Web3 Gateway

## Installation

```bash
pnpm install
```

## Build and Use
To build and use the project, run the following command
```bash
pnpm build
```

## Usage

Basic setup:

```typescript
import { InjectiveGrpcClient } from '@injectivelabs/injective-sdk-client-ts'

// Initialize client
const client = new InjectiveGrpcClient({
  networkType: "Mainnet",
  privateKey: "your-private-key"
})

// Example: Query bank balance
const getBalance = async () => {
  const response = await client.getBankBalance({
    address: "inj1..."
  })
  console.log(response)
}
```

### Key Features

1. **Address Generation**
```typescript
const address = getAddressFromPrivateKey(privateKey)
```

2. **Message Broadcasting**
```typescript
// Send tokens
const response = await client.msgSend({
  amount: "1000000000",
  denom: "inj",
  recipient: "inj1...",
})
```

3. **Market Data Queries**
```typescript
// Get spot markets
const markets = await client.getSpotMarkets({})

// Get derivative markets
const derivativeMarkets = await client.getDerivativeMarkets({})
```

## Error Handling

The client implements custom error handling through the `GrpcException` class:

```typescript
try {
  await client.someMethod()
} catch (e) {
  if (e instanceof GrpcException) {
    console.error(`gRPC error: ${e.message}`)
  }
}
```

## Network Configuration

Supports multiple network types:
- Mainnet
- Testnet
- Devnet

```typescript
const client = new InjectiveGrpcClient({
  networkType: "Testnet",
  privateKey: "your-private-key"
})
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.