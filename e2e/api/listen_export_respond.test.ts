import { expect, test } from '@playwright/test';

import { exportTestData } from './data';
import { createListener } from './listener';

test('responding to an export is possible', async ({ request, baseURL }) => {
	// Connect a listener
	await using listener = await createListener(baseURL!);
	expect(await listener.waitForNextEvent(5000)).toHaveProperty('event', 'welcome');

	const respondData = { name: "I'm some response data" };

	// Send the export but also wait for the response data
	async function pretendToBeMod() {
		const exportResp = await request.post(`export/${listener.token}?wait=5`, {
			headers: { 'Content-Type': 'application/json' },
			data: exportTestData,
		});
		expect(exportResp.ok()).toBeTruthy();
		const exportBody = await exportResp.json();
		expect(exportBody).toHaveProperty('success', true);
		expect(exportBody).toHaveProperty('data', respondData);
	}

	// Wait for the export to arrive and then respond to it
	async function pretendToBeASB() {
		const exportEvent = await listener.waitForNextEvent();
		expect(exportEvent).toHaveProperty('event', 'export');
		expect(exportEvent).toHaveProperty('data', exportTestData);
		expect(exportEvent).toHaveProperty('id');
		const respondId = exportEvent.id!;
		expect(respondId).toMatch(/^[0-9a-z]{6,32}$/);

		const respondResp = await request.post(`respond/${listener.token}/${respondId}`, {
			headers: { 'Content-Type': 'application/json' },
			data: respondData,
			timeout: 2000,
		});
		expect(respondResp.ok()).toBeTruthy();
	}

	// Perform both at the same time
	await Promise.all([pretendToBeMod(), pretendToBeASB()]);
});
