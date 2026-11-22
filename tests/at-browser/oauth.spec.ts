import { expect, test } from '@playwright/test';

for (const name of ['Alice', 'Bob']) {
  test(`test user ${name} connects through OAuth and submits a verified service token`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#result')).toHaveAttribute('data-state', 'ready');
    const config = await (await page.request.get('/network.json')).json() as {
      accounts: { handle: string; did: string }[];
    };
    const account = config.accounts.find(account => account.handle === `${name.toLowerCase()}.test`)!;
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByLabel('Username or Email')).toHaveValue(account.handle);
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByRole('button', { name: 'Authorize', exact: true }).click();
    await expect(page.locator('#result')).toHaveAttribute('data-state', 'verified');
    await expect(page.locator('#result')).toHaveAttribute('data-did', account.did);
    // Make sure a reload restores the OAuth session instead of ussing the other JWT
    await page.reload();
    await expect(page.locator('#result')).toHaveAttribute('data-state', 'verified');
    await expect(page.locator('#result')).toHaveAttribute('data-did', account.did);
  });
}

test('the diagnostic verifier rejects a missing or malformed service token', async ({ request }) => {
  expect((await request.post('/check')).status()).toBe(401);
  expect((await request.post('/check', { headers: { authorization: 'Bearer not-a-jwt' } })).status()).toBe(401);
});

test('local HTTP login still requires the provider CSRF token', async ({ request }) => {
  const config = await (await request.get('/network.json')).json() as {
    accounts: { handle: string; pds: string }[];
  };
  const account = config.accounts[0]!;
  const response = await request.post(`${account.pds}/@atproto/oauth-provider/~api/sign-in`, {
    headers: {
      'sec-fetch-mode': 'same-origin', 'sec-fetch-site': 'same-origin',
      origin: account.pds, referer: `${account.pds}/account`,
    },
    data: { identifier: account.handle, password: 'password', remember: false },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ error_description: 'Missing CSRF header' });
});
