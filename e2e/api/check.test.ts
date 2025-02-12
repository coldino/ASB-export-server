import { expect, test } from '@playwright/test';
import { createListener } from './listener';

test('check with no listener', async ({ request }) => {
	const token = 'not-a-listener';

	// Call the check endpoint and check it denies the listener is connected
	const checkResp = await request.get('check/' + token);
	expect(checkResp.ok()).toBeFalsy();
	expect(checkResp.status()).toBe(424); // No listener is connected with this token
	const body = await checkResp.json();
	expect(body).toHaveProperty('error');
	expect(body).toHaveProperty('error.code', 424);
});

test('check with a matching listener', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Call the check endpoint and check it confirms the listener is connected
	const checkGoodResp = await request.get('check/' + listener.token);
	expect(checkGoodResp.ok()).toBeTruthy();
	expect(checkGoodResp.status()).toBe(200);
	const goodBody = await checkGoodResp.json();
	expect(goodBody).toHaveProperty('success', true);

	// Shut down the listener
	await listener.close();

	// Call the check endpoint and check it denies the listener is connected
	const checkBadResp = await request.get('check/' + listener.token);
	expect(checkBadResp.ok()).toBeFalsy();
	expect(checkBadResp.status()).toBe(424); // No listener is connected with this token
	const badBody = await checkBadResp.json();
	expect(badBody).toHaveProperty('error');
	expect(badBody).toHaveProperty('error.code', 424);
});

test('check with a different listener', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Call the check endpoint and check it denies the listener is connected
	const checkResp = await request.get('check/' + listener.token + '-not');
	expect(checkResp.ok()).toBeFalsy();
	expect(checkResp.status()).toBe(424);
	const body = await checkResp.json();
	expect(body).toHaveProperty('error');
	expect(body).toHaveProperty('error.code', 424);
});
