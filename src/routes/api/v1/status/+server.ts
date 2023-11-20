import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { getConnectionCount } from '$lib/server/connections';

export const GET: RequestHandler = async () => {
    return json({
        connections: getConnectionCount(),
    });
};
