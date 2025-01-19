import { type IAgentRuntime, type Memory, type Evaluator, elizaLogger } from "@elizaos/core";
import { TrustScoreProvider } from "../providers/trustScoreProvider";

export const trustEvaluator: Evaluator = {
  name: "EVALUATE_TRUST",
  similes: [],
  examples: [],
  description: "Evaluates token trust scores and trading signals",
  validate: async () => true,
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    const trustScoreProvider = new TrustScoreProvider();
    const tokenAddress = message.content?.tokenAddress;

    if (!tokenAddress) {
      return false;
    }

    try {
      const evaluation = await trustScoreProvider.evaluateToken(tokenAddress);

      elizaLogger.log("Trust evaluation:", {
        tokenAddress,
        ...evaluation,
      });

      return true;
    } catch (error) {
      elizaLogger.error("Trust evaluation failed:", error);
      return false;
    }
  },
};
