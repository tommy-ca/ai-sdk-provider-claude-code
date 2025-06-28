# @ai-sdk/gemini-cli

Unofficial community provider allowing the Vercel AI SDK to use Gemini models by reusing the OAuth credentials created by the `gemini` CLI.

```ts
import { geminiCli } from '@ai-sdk/gemini-cli';
import { generateText } from 'ai';

const { content } = await generateText({
  model: geminiCli('gemini-1.5-flash'),
  prompt: 'Hello Gemini',
});
```

Make sure you have run `gemini auth login` once so the credentials exist at `~/.gemini/oauth_creds.json`.
