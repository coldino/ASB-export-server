import { maxExportSize } from "$lib/server/config";
import { jsonError } from "$lib/server/error";
import { isExportLimited } from "$lib/server/rates";
import { isHashValid, isTokenValid } from "$lib/validate";
import type { RequestEvent } from "@sveltejs/kit";


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
