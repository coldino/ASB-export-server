import type { RequestEvent } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

async function anyLimited(limiters: RateLimiter[], event: RequestEvent) {
	const results = await Promise.all(limiters.map((limiter) => limiter.isLimited(event)));
	return results.some((result) => result);
}

// Creature exports - frequent
const exportRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [500, '15s'] } }),
	new RateLimiter({ rates: { IP: [1000, 'm'] } }),
	new RateLimiter({ rates: { IP: [20000, 'h'] } }),
];

// Server multiplier data - should be rare, on server config change only
const serverRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [30, '15s'] } }),
	new RateLimiter({ rates: { IP: [100, '15m'] } }),
	new RateLimiter({ rates: { IP: [300, 'h'] } }),
];

// ASB listen connections - only when ASB restarts or changes tokens
const listenRateLimiters: RateLimiter[] = [
	new RateLimiter({ rates: { IP: [30, '15s'] } }),
	new RateLimiter({ rates: { IP: [100, '15m'] } }),
	new RateLimiter({ rates: { IP: [300, 'h'] } }),
];

export async function isExportLimited(event: RequestEvent) {
	if (rateLimitsDisabled()) {
		return false;
	}
	return anyLimited(exportRateLimiters, event);
}

export async function isServerLimited(event: RequestEvent) {
	if (rateLimitsDisabled()) {
		return false;
	}
	return anyLimited(serverRateLimiters, event);
}

export async function isListenLimited(event: RequestEvent) {
	if (rateLimitsDisabled()) {
		return false;
	}
	return anyLimited(listenRateLimiters, event);
}

function rateLimitsDisabled() {
	return process.argv.includes('--disable-rate-limits') || process.env.DISABLE_RATE_LIMITS === '1';
}
