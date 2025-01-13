import type { ModelProviderName } from '@elizaos/core';

export const modelConfig = {
  provider: 'anthropic' as ModelProviderName,
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 100
};