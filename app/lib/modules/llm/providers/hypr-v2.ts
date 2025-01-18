import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class HyprV2Provider extends BaseProvider {
  name = 'HyperV2';
  getApiKeyLink = 'https://docs.hyprlab.io/browse-models/model-list/hyprlab-v2';

  config = {
    apiTokenKey: 'HPROVIDERV2_API_KEY',
  };
// find more in https://github.com/marketplace?type=models
  staticModels: ModelInfo[] = [
    { name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (22Oct24, 10.80)', provider: this.name, maxTokenAllowed: 200000 },
    { name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (22Oct24, 2.88)', provider: this.name, maxTokenAllowed: 200000 },
    { name: 'chatgpt-4o-latest', label: 'ChatGPT 4.0 (latest, 8.00)', provider: this.name, maxTokenAllowed: 128000 },
	{ name: 'gpt-4o-2024-11-20', label: 'GPT 4o (20Nov24, 5.00)', provider: this.name, maxTokenAllowed: 128000 },
	{ name: 'gpt-4o-mini-2024-07-18', label: 'GPT 4o-Mini (18Jul24, 0.30)', provider: this.name, maxTokenAllowed: 128000 },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'HPROVIDERV2_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://api.hyprlab.io/v2',
      apiKey,
    });

    return openai(model);
  }
}