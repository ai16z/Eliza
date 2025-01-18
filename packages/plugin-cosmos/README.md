# `@elizaos/plugin-cosmos`

This plugin provides actions and utilities for interacting with Cosmos-compatible blockchains.

---

## Development

Prepare Eliza according to [README](../../README.md)
Add variables required for `@elizaos/plugin-cosmos` :

```
COSMOS_RECOVERY_PHRASE=your recovery phrase words
COSMOS_AVAILABLE_CHAINS=chain1,chain2,chain3
```

Ensure the appropriate environment variables are added for the plugin. If they are correctly configured, the project will run with `@elizaos/plugin-cosmos`

Run Eliza

```
pnpm run dev
```

## Configuration

### Default Setup

To start using the plugin, you need to provide your **Cosmos account recovery phrases** and the list of **available chains**. Add the following to your `.env` file:

```env
COSMOS_RECOVERY_PHRASE=your recovery phrase words
COSMOS_AVAILABLE_CHAINS=chain1,chain2,chain3
```

Ensure that the chain names in `COSMOS_AVAILABLE_CHAINS` match the identifiers from the [chain-registry](https://github.com/cosmos/chain-registry) library for compatibility.

### Using the Cosmos Helper Character

The plugin includes a pre-configured character, `cosmosHelper.character.json`, optimized for Cosmos-related operations. This character enhances interaction by:

- Handling repeated prompts effectively.

- Requesting confirmation before executing detected actions.

To use the character, pass it with the `--characters` flag:

```bash
--characters='../characters/cosmosHelper.character.json'
```

---

### Custom chain configuration

Plugin allows you to pass you custom chain config to `createCosmosPlugin` function invoked in `../agent/src/index`.

Your custom configuration fulfills the interfaces from `chain-registry`

```
import  type { assets, chains } from  "chain-registry";

export  interface  ICosmosPluginCustomChainData {
	chainData: (typeof  chains)[number];
	assets: (typeof  assets)[number];
}

export  interface  ICosmosPluginOptions {
	customChainData?: ICosmosPluginCustomChainData[];
}
```

## Actions

### Token Transfer

This plugin supports a token transfer action, which allows users to transfer tokens between addresses on Cosmos-compatible blockchains. The action prompts for confirmation to ensure secure execution.

#### Example Prompts

Below are examples of how the transfer action can be initiated and confirmed:

**Example**

1. User input:

```
Make transfer 0.0001 ATOM to cosmos1nk3uuw6zt5t5aqw5fvujkd54sa4uws9xv465ad on cosmoshubtestnet.
```

2. Plugin response:

```
Do you confirm the transfer action?
```

3. User confirmation:

```
Yes
```

4. Action executed.

### Token IBC Transfer

This plugin supports a token transfer action, which allows users to transfer tokens between addresses on Cosmos-compatible blockchains between different chains.

#### Example Prompts

Below are examples of how the ibc transfer action can be initiated and confirmed:

**Example**

1. User input:

```
Make an IBC transfer 0.0001 OSMO to neutron1nk3uuw6zt5t5aqw5fvujkd54sa4uws9xg2nk82 from osmosistestnet to neutrontestnet
```

2. Plugin response:

```
Before making the IBC transfer, I would like to confirm the details. You would like to transfer 0.0001 OSMO from osmosistestnet to neutrontestnet, specifically to the address neutron1nk3uuw6zt5t5aqw5fvujkd54sa4uws9xg2nk82, is that correct?
```

3. User confirmation:

```
Yes
```

4. Action executed.

---

## Contribution

The plugin includes comprehensive tests. Before submitting any pull requests, ensure all tests pass.

### Running Tests

Navigate to the `plugin-cosmos` directory and execute:

```bash
pnpm  test
```

---

This plugin simplifies Cosmos blockchain interactions and enhances productivity with its tailored features. Happy building!
