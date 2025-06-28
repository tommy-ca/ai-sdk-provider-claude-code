import fs from 'node:fs/promises';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';

const DEFAULT_PATH =
  process.env.GEMINI_OAUTH_PATH ??
  path.join(process.env.HOME || '~', '.gemini', 'oauth_creds.json');

/**
 * Load access token from Gemini CLI credentials and refresh if expired.
 */
export async function getValidAccessToken(): Promise<string> {
  let raw: any;
  try {
    const json = await fs.readFile(DEFAULT_PATH, 'utf8');
    raw = JSON.parse(json);
  } catch (err) {
    if (process.env.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
    throw new Error(`Unable to read Gemini CLI credentials at ${DEFAULT_PATH}`);
  }

  if (raw.access_token && Date.now() < (raw.expiry_date ?? 0) - 60_000) {
    return raw.access_token as string;
  }

  const client = new OAuth2Client(
    raw.client_id ?? '71815591384-dcgr2p6eepqk1odqp4lm5s2ao.apps.googleusercontent.com',
    raw.client_secret ?? 'GOCSPX-W-lu88o_geminiCLI',
    'urn:ietf:wg:oauth:2.0:oob'
  );
  client.setCredentials({ refresh_token: raw.refresh_token });
  const { credentials } = await client.refreshAccessToken();
  await fs.writeFile(
    DEFAULT_PATH,
    JSON.stringify({ ...raw, ...credentials }, null, 2),
    'utf8'
  );
  return credentials.access_token!;
}
