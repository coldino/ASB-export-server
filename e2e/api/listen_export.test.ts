import { expect, test } from '@playwright/test';
import { createListener } from './listener';
import { exportData } from './data';

test('listen receives exports sent to the same token', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);

	// Wait for the welcome event
	const welcomeEvent = await listener.waitForNextEvent();
	expect(welcomeEvent).toHaveProperty('event', 'welcome');

	// Send an export
	await request.post('export/' + listener.token, { data: exportData });

	// Make sure the listener receives the export
	const exportEvent = await listener.waitForNextEvent();
	expect(exportEvent).toHaveProperty('event', 'export');
	expect(exportEvent).toHaveProperty('data', exportData);
	expect(exportEvent).not.toHaveProperty('id');
});

test('listen does not receive exports sent to a different token', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent()).toHaveProperty('event', 'welcome');

	// Send an export to a different token
	await request.post('export/not-' + listener.token, { data: exportData });

	// Make sure the listener does not receive the export
	await listener
		.waitForNextEvent(2000)
		.then(() => expect(true).toBeFalsy())
		.catch(() => expect(true).toBeTruthy());
});
