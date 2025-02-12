import { json } from '@sveltejs/kit';

import { serviceName } from '$lib/server/config';

import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async (event) => {
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
};
