import { bringAgentWithWalletAddress } from "../functions/bringIQData.ts";

const onchainJson = await (async () => {
    return await bringAgentWithWalletAddress();
})();


export { onchainJson };