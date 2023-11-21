import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { maxServerSize } from '$lib/server/config';
import { isConnected, sendData } from '$lib/server/connections';
import { isServerLimited } from '$lib/server/rates';
import { isHashValid, isTokenValid, isValidServer } from '$lib/validate';


const handler: RequestHandler = async (event) => {
    const { params, request } = event;

    // Get the token and perform simple validation
    const { token } = params;
    if (!isTokenValid(token)) {
        throw error(400, 'Invalid token');
    }
    // Get the token and perform simple validation
    const { hash } = params;
    if (!isHashValid(hash)) {
        throw error(400, 'Invalid hash');
    }

    // Apply the rate limiter
    if (await isServerLimited(event)) {
        throw error(429, 'Too many requests');
    }

    // Ensure there's a content length header and that it is not too large
    const contentLength = request.headers.get('content-length');
    if (!contentLength) {
        throw error(400, 'Expected content length header');
    }
    const contentLengthNum = parseInt(contentLength, 10);
    if (contentLengthNum > maxServerSize) {
        throw error(400, 'Content length too large');
    }

    // Don't go any further if the connection is not active
    if (!isConnected(token)) {
        throw error(424, 'No export receiver connected');
    }

    // Decode the request body
    let data: unknown;
    try {
        data = await request.json();
    } catch (e) {
        throw error(400, 'Invalid data');
    }

    // Ensure it looks enough like a server file
    if (!isValidServer(data)) {
        throw error(400, 'Invalid data');
    }

    // Pass the export data to the connection
    sendData(token, "server "+hash, data);

    return new Response();
};

export const PUT: RequestHandler = handler;
export const POST: RequestHandler = handler;
