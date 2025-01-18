import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class HyprV1Provider extends BaseProvider {
  name = 'HyperV1';
  getApiKeyLink = 'https://docs.hyprlab.io/browse-models/model-list/deepseek';

  config = {
    apiTokenKey: 'HPROVIDERV1_API_KEY',
  };
// find more in https://github.com/marketplace?type=models
  staticModels: ModelInfo[] = [
    { name: 'deepseek-chat', label: 'Deepseek Chat (latest, 0.126)', provider: this.name, maxTokenAllowed: 128000 },
	{ name: 'deepseek-coder', label: 'Deepseek Coder (latest, 0.168)', provider: this.name, maxTokenAllowed: 128000 },
    { name: 'codestral-2405', label: 'Codestral (May24, 0.78)', provider: this.name, maxTokenAllowed: 32768 },
	{ name: 'mistral-large-2411', label: 'Mistral Large (Nov24, 2.40)', provider: this.name, maxTokenAllowed: 131072 },
	{ name: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (latest, 0.15)', provider: this.name, maxTokenAllowed: 1048576 },
	{ name: 'gemini-exp-1206', label: 'Gemini Exp (6Dec24, 5.00)', provider: this.name, maxTokenAllowed: 2097152 },
    { name: 'gemini-1.5-pro-online', label: 'Gemini 1.5 Pro Online (latest, 5.00)', provider: this.name, maxTokenAllowed: 2097152 },
	{ name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (latest, 5.00)', provider: this.name, maxTokenAllowed: 2097152 },
	{ name: 'gemini-1.5-flash-online', label: 'Gemini 1.5 Flash Online (latest, 0.30)', provider: this.name, maxTokenAllowed: 1048576 },
	{ name: 'gemini-1.5-flash-8b-online', label: 'Gemini 1.5 Flash-8B Online (latest, 0.15)', provider: this.name, maxTokenAllowed: 1048576 },
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
      defaultApiTokenKey: 'HPROVIDERV1_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://api.hyprlab.io/v1',
      apiKey,
    });

    return openai(model);
  }
}