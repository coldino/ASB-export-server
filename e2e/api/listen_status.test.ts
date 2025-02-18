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
