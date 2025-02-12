import type { RequestEvent } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

async function anyLimited(limiters: RateLimiter[], event: RequestEvent) {
	const results = await Promise.all(limiters.map((limiter) => limiter.isLimited(event)));
	return results.some((result) => result);
}

const exportRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [15, '15s'] } }),
	new RateLimiter({ rates: { IP: [45, 'm'] } }),
	new RateLimiter({ rates: { IP: [150, 'h'] } }),
];

const serverRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [3, '15s'] } }),
	new RateLimiter({ rates: { IP: [10, '15m'] } }),
	new RateLimiter({ rates: { IP: [30, 'h'] } }),
];

const listenRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [3, '15s'] } }),
	new RateLimiter({ rates: { IP: [10, '15m'] } }),
	new RateLimiter({ rates: { IP: [30, 'h'] } }),
];

export async function isExportLimited(event: RequestEvent) {
	return anyLimited(exportRateLimiters, event);
}

export async function isServerLimited(event: RequestEvent) {
	return anyLimited(serverRateLimiters, event);
}

export async function isListenLimited(event: RequestEvent) {
	return anyLimited(listenRateLimiters, event);
}
