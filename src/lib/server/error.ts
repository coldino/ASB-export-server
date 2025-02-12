import { error } from '@sveltejs/kit';

export function jsonError(status: number, message: string, extra?: Record<string, unknown>): never {
	// @ts-ignore: we don't want to follow the App.Error interface
	error(status, {
		error: { code: status, message },
		...extra,
	});
}
