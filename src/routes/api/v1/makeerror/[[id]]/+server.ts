import { json } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { serviceName } from '$lib/server/config';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!dev)
		return json(
			{
				error: {
					code: 404,
					message: 'API endpoint not found',
				},
				service: serviceName,
				endpoint: event.url.pathname,
			},
			{ status: 404 }
		);

	throw new Error('This is a test error');
};
