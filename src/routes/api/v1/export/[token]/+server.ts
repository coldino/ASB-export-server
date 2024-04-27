import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { isConnected, sendData } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { validateContentLength, validateRateLimiting, validateToken } from '../../common';
import { isValidExport } from '$lib/validate';


const handler: RequestHandler = async (event) => {
    const { params, request } = event;
    const extra = gatherExtraResponseData(event);

    // Fetch params and validate everything we can before even looking at the body
    const { token } = params;
    validateToken(token, extra);
    await validateRateLimiting(event, extra);
    validateContentLength(request, extra);

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

    // Pass the export data to the connection
    sendData(token, "export", data);

    return json({ success: true, ...extra });
}

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
