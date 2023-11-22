import { json } from "@sveltejs/kit";


export function jsonError(status: number, message: string) {
	return json({ error: { code:status, message } }, { status });
}
