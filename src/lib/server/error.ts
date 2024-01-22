import { json } from "@sveltejs/kit";


export function jsonError(status: number, message: string, extra: Record<string, unknown>) {
	return json({ error: { code:status, message }, ...extra }, { status });
}
