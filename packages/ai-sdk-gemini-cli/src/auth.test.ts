import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import { getValidAccessToken } from './auth.js';

vi.mock('node:fs/promises');

const mockCreds = {
  access_token: 'token123',
  refresh_token: 'refresh',
  expiry_date: Date.now() + 3600_000,
};

describe('getValidAccessToken', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns existing token if not expired', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockCreds));
    const token = await getValidAccessToken();
    expect(token).toBe('token123');
  });

  it('uses GEMINI_API_KEY when file missing', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('no file'));
    process.env.GEMINI_API_KEY = 'env-token';
    const token = await getValidAccessToken();
    expect(token).toBe('env-token');
  });
});
