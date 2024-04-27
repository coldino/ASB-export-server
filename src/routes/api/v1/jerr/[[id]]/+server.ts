import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async (event) => {
    // @ts-expect-error Types for this Svelte method are too limiting
    if (!dev) error(404, 'Not found');

    const extra = gatherExtraResponseData(event);
    const status = Number(event.params.id) || 418;
    return jsonError(status, 'Fake error', extra);
};
