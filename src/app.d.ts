// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			error: {
				code?: number;
				message?: string;
			};
			errorId?: string;
		}
		interface Locals {
			startTimer: number;
			routeId?: string;
			error?: string;
			errorId?: string;
			errorStackTrace?: string;
			message?: unknown;
			track?: unknown;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
