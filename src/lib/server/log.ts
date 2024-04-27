import type { RequestEvent } from "@sveltejs/kit";

import { domainName } from "./config";


export async function log(statusCode: number, event: RequestEvent, json?: object) {
	try {
		let level = 'info';
		if (statusCode >= 400) {
			level = 'warning';
		}
		if (statusCode >= 500) {
			level = 'error';
		}
		const error = event?.locals?.error || undefined;
		const errorId = event?.locals?.errorId || undefined;
		const errorStackTrace = event?.locals?.errorStackTrace || undefined;

		let referer: string|undefined = event.request.headers.get('referer') || undefined;
		if (referer) {
			const refererUrl = await new URL(referer);
			const refererHostname = refererUrl.hostname;
			if (refererHostname === 'localhost' || refererHostname === domainName) {
				referer = refererUrl.pathname;
			}
		} else {
			referer = undefined;
		}
		const logData: object = {
			level: level,
			method: event.request.method,
			// prefer route ID over real paths for anything but 404 to avoid logging tokens
			path: statusCode === 404 ? event?.url?.pathname : (event?.locals?.routeId || event?.url?.pathname),
			status: statusCode,
			timeInMs: Date.now() - event?.locals?.startTimer,
			referer: referer,
			error: error,
			errorId: errorId,
			errorStackTrace: errorStackTrace,
            errorResponse: json,
		};
		console.log('log:', JSON.stringify(logData));
		// if (!AXIOM_TOKEN || !AXIOM_ORG_ID || !AXIOM_DATASET) {
		// 	return;
		// }
		// const client = new Axiom({
		// 	token: AXIOM_TOKEN,
		// 	orgId: AXIOM_ORG_ID
		// });
		// client.ingest(AXIOM_DATASET, [logData]);
	} catch (err) {
		throw new Error(`Error Logger: ${JSON.stringify(err)}`);
	}
}
