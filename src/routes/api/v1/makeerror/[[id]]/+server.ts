import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { RequestHandler } from "./$types";


export const GET: RequestHandler = async () => {
    // @ts-expect-error Types for this Svelte method are too limiting
    if (!dev) error(404, 'Not found');

    throw new Error('This is a test error');
};
