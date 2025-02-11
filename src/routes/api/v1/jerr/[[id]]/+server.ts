import { json } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
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

	const extra = gatherExtraResponseData(event);
	const status = Number(event.params.id) || 418;
	return jsonError(status, 'Fake error', extra);
};
