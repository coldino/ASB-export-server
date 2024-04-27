import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { isConnected } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { validateRateLimiting, validateToken } from '../../common';


export const GET: RequestHandler = async (event) => {
    const { params } = event;
    const extra = gatherExtraResponseData(event);

    // Fetch params and validate everything we can before even looking at the body
    const { token } = params;
    validateToken(token, extra);
    await validateRateLimiting(event, extra);

    // Don't go any further if the connection is not active
    if (!isConnected(token)) {
        jsonError(424, 'No listener currently connected', extra);
    }

    return json({ success: true, ...extra });
}
