import type { RequestEvent } from '@sveltejs/kit';

export function gatherExtraResponseData<T extends Partial<Record<string, string>>, U extends string | null>(
	event: RequestEvent<T, U>
) {
	const data: Record<string, unknown> = {
		endpoint: event.route.id,
		service: 'asb-export-server',
	};
	const responseId = event.url.searchParams.get('responseId');
	if (responseId) {
		data.responseId = responseId;
	}
	return data;
}
