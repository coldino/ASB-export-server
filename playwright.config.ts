import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		// We add a parameter to disable rate limits for testing the API
		command: 'npm run build && npm run preview --port=4173 -- -- --disable-rate-limits',
		port: 4173,
	},

	testDir: 'e2e',

	use: {
		baseURL: 'http://localhost:4173/api/v1/',
	},
});
