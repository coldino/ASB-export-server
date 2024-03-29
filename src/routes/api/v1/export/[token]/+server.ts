import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { isConnected, sendData } from '$lib/server/connections';
import { maxExportSize } from '$lib/server/config';
import { isTokenValid, isValidExport } from '$lib/validate';
import { isExportLimited } from '$lib/server/rates';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';


const handler: RequestHandler = async (event) => {
    const { params, request } = event;
    const extra = gatherExtraResponseData(event);

    // Get the token and perform simple validation
    const { token } = params;
    if (!isTokenValid(token)) {
        return jsonError(400, 'Invalid token', extra);
    }

    // Apply the rate limiter
    if (await isExportLimited(event)) {
        return jsonError(429, 'Too many requests', extra);
    }

    // Ensure there's a content length header and that it is not too large
    const contentLength = request.headers.get('content-length');
    if (!contentLength) {
        return jsonError(400, 'Expected content length header', extra);
    }
    const contentLengthNum = parseInt(contentLength, 10);
    if (contentLengthNum > maxExportSize) {
        return jsonError(400, 'Content length too large', extra);
    }

    // Don't go any further if the connection is not active
    if (!isConnected(token)) {
        return jsonError(424, 'No listener currently connected', extra);
    }

    // Decode the request body
    let data: unknown;
    try {
        data = await request.json();
    } catch (e) {
        return jsonError(400, 'Invalid data', extra);
    }

    // Ensure it looks enough like an export file
    if (!isValidExport(data)) {
        return jsonError(400, 'Invalid data', extra);
    }

    // Pass the export data to the connection
    sendData(token, "export", data);

    return json({ success: true, ...extra });
}

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
