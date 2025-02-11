import { expect, test } from '@playwright/test';
import { createListener } from './listener';

test('listen gets a welcome event', async ({ baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);

	// Wait for the welcome event
	const welcome = await listener.waitForNextEvent();
	expect(welcome).toHaveProperty('event', 'welcome');
});

test('listen replaces listener with same token', async ({ baseURL }) => {
	// Connect the first listener
	await using listenerA = await createListener(baseURL!);
	expect(await listenerA.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Connect the second listener with the same token
	await using listenerB = await createListener(baseURL!, listenerA.token);
	expect(await listenerB.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Expect the first connection to be closed with 'replaced'
	expect(await listenerA.waitForNextEvent()).toHaveProperty('event', 'replaced');
	expect(listenerA.isClosed).toBeTruthy();
});
