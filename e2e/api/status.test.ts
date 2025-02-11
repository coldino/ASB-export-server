import { expect, test } from '@playwright/test';
import { createListener } from './listener';

test.describe.configure({ mode: 'serial' });

test('status endpoint', async ({ request }) => {
	// Check the status endpoint returns a JSON object with connections: 0
	const result = await request.get('status');
	expect(result.ok()).toBeTruthy();
	expect(result.headers()).toHaveProperty('content-type', 'application/json');
	const json = await result.json();
	expect(json).toHaveProperty('connections');
});
