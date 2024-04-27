import type { Handle, HandleServerError } from "@sveltejs/kit";

import { log } from "$lib/server/log";


const SKIP_STACK_FOR_STATUS_CODES = [404, 405];


export const handleError: HandleServerError = async ({ error, event, status }) => {
	const errorId = crypto.randomUUID();

	const skipStack = SKIP_STACK_FOR_STATUS_CODES.includes(status);
	event.locals.error = error?.toString() || undefined;
	// @ts-ignore
	event.locals.errorStackTrace = skipStack ? undefined : (error?.stack || undefined);
	event.locals.errorId = errorId;

	return;
};


export const handle: Handle = async ({ event, resolve }) => {
	event.locals.startTimer = Date.now();
	event.locals.routeId = event.route.id || undefined;
	const response = await resolve(event);
	log(response.status, event);
	return response;
}
