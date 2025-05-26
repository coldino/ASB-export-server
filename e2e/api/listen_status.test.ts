import { expect, test } from '@playwright/test';

import { createListener } from './listener';

test('listen receives death notifications', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Send the death notification
	const postResp = await request.post(`dead/${listener.token}/12345/-12345`);
	expect(postResp.ok()).toBeTruthy();

	// Make sure the listener receives it
	const exportEvent = await listener.waitForNextEvent();
	expect(exportEvent).toHaveProperty('event', 'dead 12345 -12345');
	expect(exportEvent).not.toHaveProperty('data');
	expect(exportEvent).not.toHaveProperty('id');
});

test('listen receives neuter notifications', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Send the neuter notification
	const postResp = await request.post(`neuter/${listener.token}/12345/-12345`);
	expect(postResp.ok()).toBeTruthy();

	// Make sure the listener receives it
	const exportEvent = await listener.waitForNextEvent();
	expect(exportEvent).toHaveProperty('event', 'neuter 12345 -12345');
	expect(exportEvent).not.toHaveProperty('data');
	expect(exportEvent).not.toHaveProperty('id');
});

test('listen receives breeding notifications', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Send the breeding notification (enabled)
	const postRespEnabled = await request.post(`breeding/${listener.token}/12345/-12345/1`);
	expect(postRespEnabled.ok()).toBeTruthy();

	// Make sure the listener receives it
	let exportEvent = await listener.waitForNextEvent();
	expect(exportEvent).toHaveProperty('event', 'breeding 12345 -12345 1');
	expect(exportEvent).not.toHaveProperty('data');
	expect(exportEvent).not.toHaveProperty('id');

	// Send the breeding notification (disabled)
	const postRespDisabled = await request.post(`breeding/${listener.token}/67890/-67890/0`);
	expect(postRespDisabled.ok()).toBeTruthy();

	// Make sure the listener receives it
	exportEvent = await listener.waitForNextEvent();
	expect(exportEvent).toHaveProperty('event', 'breeding 67890 -67890 0');
	expect(exportEvent).not.toHaveProperty('data');
	expect(exportEvent).not.toHaveProperty('id');

	// Send the breeding notification (invalid mode - numeric)
	const postRespInvalidNumeric = await request.post(`breeding/${listener.token}/11111/-22222/2`);
	expect(postRespInvalidNumeric.ok()).toBeFalsy();
	expect(postRespInvalidNumeric.status()).toBe(400);

	// Send the breeding notification (invalid mode - non-numeric)
	const postRespInvalidAlpha = await request.post(`breeding/${listener.token}/33333/-44444/abc`);
	expect(postRespInvalidAlpha.ok()).toBeFalsy();
	expect(postRespInvalidAlpha.status()).toBe(400);

	// Ensure no unexpected events were received by the listener for invalid requests
	const noEventPromise = listener.waitForNextEvent(100); // Short timeout
	await expect(noEventPromise).rejects.toThrow('Timeout waiting for next event');
});
