import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { validateContentLength, validateRateLimiting, validateToken, validateWaitParam } from '$lib/common';
import { addResponseListener, getNewReponseId, isConnected, removeResponseListener, sendData } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { isValidExport } from '$lib/validate';

const handler: RequestHandler = async (event) => {
	const { params, request, url } = event;
	const extra = gatherExtraResponseData(event);

	// Fetch params and validate everything we can before even looking at the body
	const { token } = params;
	validateToken(token, extra);
	await validateRateLimiting(event, extra);
	validateContentLength(request, extra);
	const wait = validateWaitParam(url, extra);

	// Don't go any further if the connection is not active
	if (!isConnected(token)) {
		jsonError(424, 'No listener currently connected', extra);
	}

	// Decode the request body
	let data: unknown;
	try {
		data = await request.json();
	} catch (e) {
		jsonError(400, 'Invalid data', extra);
	}

	// Ensure it looks enough like an export file
	if (!isValidExport(data)) {
		jsonError(400, 'Invalid data', extra);
	}

	// If we're not waiting for a response, take the simple path
	if (!wait) {
		// Pass the export data to the connection (without response ID)
		sendData(token, 'export', data);

		// Immediately return success
		return json({ success: true, wait, ...extra });
	}

	// In order for us to get a response we need to make a unique ID for this request
	// and then wait for a response with that ID, or for the timeout to expire
	const responseId = getNewReponseId();

	// Send the export file to the connection with the response ID
	sendData(token, 'export', data, responseId);

	// Construct a streaming body that can be used to send the body later
	let sendBody: ((obj: unknown) => void) | undefined = undefined;
	const body = new ReadableStream({
		start(controller) {
			sendBody = (obj: unknown) => {
				const text = JSON.stringify(obj);
				controller.enqueue(text);
				controller.close();
				sendBody = undefined;
			};
		},
	});

	// Start a timer to send back a body with no response data if the timeout expires
	const timeout = setTimeout(() => {
		removeResponseListener(responseId);
		if (sendBody) {
			sendBody({
				success: true,
				data: undefined,
				...extra,
			});
		}
	}, wait * 1000);

	// Or if a response arrives, send it back in the body
	addResponseListener(responseId, (response) => {
		clearTimeout(timeout);
		removeResponseListener(responseId);
		if (sendBody) {
			sendBody({
				success: true,
				data: response,
				...extra,
			});
		}
	});

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
