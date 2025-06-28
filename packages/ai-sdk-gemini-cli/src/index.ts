import { createLanguageModelSpecification } from '@ai-sdk/provider';
import { createGoogleContentGenerator } from '@ai-sdk/provider-utils';
import { getValidAccessToken } from './auth.js';

/**
 * Gemini CLI provider that reuses OAuth credentials from the Gemini CLI.
 */
export const geminiCli = createLanguageModelSpecification({
  providerId: 'gemini-cli',
  defaultModelId: 'gemini-1.5-flash',
  createClient: async () => {
    const token = await getValidAccessToken();
    return createGoogleContentGenerator({
      headers: { Authorization: `Bearer ${token}` },
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    });
  },
});

export type { GoogleGenerativeModelId } from '@ai-sdk/provider-utils';
