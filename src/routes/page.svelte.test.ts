import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import HomePage from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(HomePage);

		const headers = screen.getAllByRole('heading', { level: 1 });
		expect(headers).toHaveLength(2);
		expect(headers[0]).toHaveTextContent('ARK Smart Breeding', { normalizeWhitespace: true });
	});
});
