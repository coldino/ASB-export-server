import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { isConnected, sendData } from '$lib/server/connections';
import { maxExportSize } from '$lib/server/config';
import { isTokenValid, isValidExport } from '$lib/validate';
import { isExportLimited } from '$lib/server/rates';


export const PUT: RequestHandler = async (event) => {
    const { params, request } = event;

    // Get the token and perform simple validation
    const { token } = params;
    if (!isTokenValid(token)) {
        throw error(400, 'Invalid token');
    }

    // Apply the rate limiter
    if (await isExportLimited(event)) {
        throw error(429, 'Too many requests');
    }

    // Ensure the request is JSON
    if (!request.headers.get('content-type')?.includes('application/json')) {
        throw error(400, 'Expected JSON request body');
    }

    // Ensure there's a content length header and that it is not too large
    const contentLength = request.headers.get('content-length');
    if (!contentLength) {
        throw error(400, 'Expected content length header');
    }
    const contentLengthNum = parseInt(contentLength, 10);
    if (contentLengthNum > maxExportSize) {
        throw error(400, 'Content length too large');
    }

    // Don't go any further if the connection is not active
    if (!isConnected(token)) {
        throw error(504, 'No export receiver connected');
    }

    // Decode the request body
    const data = await request.json();

    // Ensure it looks a bit like an export file
    if (!isValidExport(data)) {
        throw error(400, 'Invalid data');
    }

    // Pass the export data to the connection
    sendData(token, "export", data);

    return new Response();
};
