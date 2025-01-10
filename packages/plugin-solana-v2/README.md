# Solana Plugin V2 for Eliza 🌟

The **Solana Plugin V2** leverages the latest features of `@solana/web3.js` v2 to provide a modern, efficient, and composable solution for Solana integrations within the Eliza AI agent framework.

## Orca DEX integration
This plugin is designed for advanced position management and introduces foundational tools for building DeFi strategies on Orca.

---

## Key Features 🚀

### Modern JavaScript and Functional Architecture
- **@solana/web3.js v2** introduces:
  - Tree-shakability
  - Composable internals
  - Zero-dependency design
  - Functional programming approach

### Backward Compatibility
- This plugin can be used alongside existing plugins that use `@solana/web3.js` v1.

### Common Utilities
The `Utils` class provides shared functionality across the plugin, offering flexibility and ease of integration.

#### `sendTransaction`
- Accepts the RPC isntance, transaction instructions, and a wallet.
- Utilizes Solana's Compute Budget Program for optimized CU usage and priority fees.
- Implements client-side retry logic to enhance transaction landing success.
- More details on optimizing transactions can be found [here](https://orca-so.github.io/whirlpools/Whirlpools%20SDKs/Whirlpools/Send%20Transaction).

#### Trusted Execution Environment (TEE)
- For Trusted Execution Environment (TEE) functionality, this plugin transitions from `Keypair` (used in v1) to `CryptoKeyPair` from the Web Crypto API. This change aligns with `@solana/web3.js` v2's zero-dependency, modern JavaScript architecture.
- A modified implementation for TEE integration is included in `src/utils/`, following the same patterns used in `plugin-tee`.
---

## Current Functionality 🎯

### Liquidity Position Management
- **Reposition Liquidity**:
  - Automatically repositions liquidity positions if the center price of the position deviates from the current pool price by more than a user-specified threshold (`repositionThresholdBps`).
  - Maintains the original width of the position during repositioning.
  - Example: To ensure the center price is within 3% of the current price, set `repositionThresholdBps` to 300.

### Built-in Utilities
- **`Utils` Class**:
  - `loadWallet`: Integrates wallet loading with TEE functionality.
  - `sendTransaction`: Smart transaction handling with CU optimization.

---

## Future Functionality 🔮

### Position Management Enhancements
- **Opening and Closing Positions**:
  - Expose opening and closing positions as separate actions.
  - Allow agents to leverage data streams and other plugins for decision-making and yield optimization.

### Token Launches
- **Token Creation and Liquidity Setup**:
  - Create tokens with metadata using the Token 2022 Program.
  - Launch tokens on Orca with single-sided liquidity.
  - Configure start and maximum prices for initial liquidity.

---

## Usage 🛠️

### Plugin Configuration For Automated Repositioning
```typescript
export const solanaPluginV2: Plugin = {
  name: "solanaV2",
  description: "Solana Plugin V2 for Eliza",
  actions: [managePositions, repositionPosition],
  evaluators: [repositionEvaluator],
  providers: [positionProvider],
};
```

### Example Integration
In your `.env` variable, set the following parameters:
```bash
SOLANA_PRIVATE_KEY=
SOLANA_PUBLIC_KEY=
RPC_URL=
```

---

## Contributing 🤝
Contributions are welcome! If you wish to extend `plugin-solana-v2` with your tools, ensure compatibility with `@solana/web3.js` v2.

---

## Notes 📝
- Refer to the [Orca Whirlpools SDK](https://orca-so.github.io/whirlpools/) for additional resources and context.
