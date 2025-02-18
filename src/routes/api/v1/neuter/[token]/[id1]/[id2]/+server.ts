import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { isConnected, sendData } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { validateIdParts, validateRateLimiting, validateToken } from '../../../../common';

const handler: RequestHandler = async (event) => {
	const { params, request, url } = event;
	const extra = gatherExtraResponseData(event);

	// Fetch params and validate everything we can before even looking at the body
	const { token, id1, id2 } = params;
	validateToken(token, extra);
	await validateRateLimiting(event, extra);
	validateIdParts(id1, id2, extra);

	// Don't go any further if the connection is not active
	if (!isConnected(token)) {
		jsonError(424, 'No listener currently connected', extra);
	}

	// Send the notification
	sendData(token, `neuter ${id1} ${id2}`);

	return json({ success: true, ...extra });
};

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
