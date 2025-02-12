import { expect, test } from '@playwright/test';
import { serverTestData, serverTestDataHash } from './data';
import { createListener } from './listener';

test('listen receives file sent to the same token', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Send the server file
	const sendResp = await request.post(`server/${listener.token}/${serverTestDataHash}`, { data: serverTestData });
	expect(sendResp.ok()).toBeTruthy();

	// Make sure the listener receives the file
	const fileEvent = await listener.waitForNextEvent();
	expect(fileEvent).toHaveProperty('event', 'server ' + serverTestDataHash);
	expect(fileEvent).toHaveProperty('data', serverTestData);
	expect(fileEvent).not.toHaveProperty('id');
});
