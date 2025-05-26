import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { validateBreedingMode, validateIdParts, validateRateLimiting, validateToken } from '$lib/common';
import { isConnected, sendData } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';

const handler: RequestHandler = async (event) => {
	const { params } = event;
	const extra = gatherExtraResponseData(event);

	// Fetch params and validate everything we can before even looking at the body
	const { token, id1, id2, mode } = params;
	validateToken(token, extra);
	await validateRateLimiting(event, extra);
	validateIdParts(id1, id2, extra);
	validateBreedingMode(mode, extra);

	// Don't go any further if the connection is not active
	if (!isConnected(token)) {
		jsonError(424, 'No listener currently connected', extra);
	}

	// Send the notification
	sendData(token, `breeding ${id1} ${id2} ${mode}`);

	return json({ success: true, ...extra });
	1;
};

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
