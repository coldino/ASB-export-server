import { isConnected, isValidResponseId, sendResponse } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { json } from '@sveltejs/kit';
import { validateContentLength, validateJsonContentHeader, validateRateLimiting, validateToken } from '../../../common';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async (event) => {
	const { params, request } = event;
	const extra = gatherExtraResponseData(event);

	// Fetch params and validate everything we can before even looking at the body
	const { token, id: responseId } = params;
	validateToken(token, extra);
	await validateRateLimiting(event, extra);
	validateContentLength(request, extra);
	validateJsonContentHeader(request, extra);

	// Don't go any further if the connection is not active
	if (!isConnected(token)) {
		jsonError(424, 'No listener currently connected', extra);
	}
	if (!isValidResponseId(responseId)) {
		jsonError(400, 'Invalid response ID', extra);
	}

	// Decode the request body
	let data: unknown;
	try {
		data = await request.json();
	} catch (e) {
		jsonError(400, 'Invalid data', extra);
	}

	// TODO: Validate in some way?

	// Pass the response back to the waiting mod
	sendResponse(responseId, data);

	return json({ success: true, ...extra });
};

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
