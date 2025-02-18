import { maxExportSize } from '$lib/server/config';
import { jsonError } from '$lib/server/error';
import { isExportLimited } from '$lib/server/rates';
import { isHashValid, isTokenValid } from '$lib/validate';
import type { RequestEvent } from '@sveltejs/kit';

export function validateWaitParam(url: URL, extra: Record<string, unknown>): number | undefined {
	const wait = url.searchParams.get('wait');
	if (wait === null) {
		return undefined;
	}
	const waitNum = parseInt(wait, 10);
	if (isNaN(waitNum)) {
		jsonError(400, 'Invalid wait parameter', extra);
	}
	return waitNum;
}

export function validateToken(token: string, extra: Record<string, unknown>) {
	if (!isTokenValid(token)) {
		jsonError(400, 'Invalid token', extra);
	}
}

export function validateServerHash(token: string, extra: Record<string, unknown>) {
	if (!isHashValid(token)) {
		jsonError(400, 'Invalid server hash', extra);
	}
}

export async function validateRateLimiting(event: RequestEvent, extra: Record<string, unknown>) {
	if (await isExportLimited(event)) {
		jsonError(429, 'Too many requests', extra);
	}
}

export function validateContentLength(request: Request, extra: Record<string, unknown>) {
	const contentLength = request.headers.get('content-length');
	if (!contentLength) {
		jsonError(400, 'Expected content length header', extra);
	}
	const contentLengthNum = parseInt(contentLength, 10);
	if (isNaN(contentLengthNum)) {
		jsonError(400, 'Invalid content length header', extra);
	}
	if (contentLengthNum > maxExportSize) {
		jsonError(400, 'Invalid data', extra);
	}
}

export function validateJsonContentHeader(request: Request, extra: Record<string, unknown>) {
	const contentType = request.headers.get('content-type');
	if (!contentType || !contentType.includes('application/json')) {
		jsonError(400, 'Invalid content type', extra);
	}
}

const idRegex = /^-?\d{1,10}$/;
export function validateIdParts(id1: string, id2: string, extra: Record<string, unknown>) {
	if (!idRegex.test(id1) || !idRegex.test(id2)) {
		jsonError(400, 'Invalid ID', extra);
	}
	const id1Num = parseInt(id1, 10);
	const id2Num = parseInt(id2, 10);
	if (isNaN(id1Num) || isNaN(id2Num)) {
		jsonError(400, 'Invalid ID', extra);
	}
}
