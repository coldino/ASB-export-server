import type { RequestHandler } from './$types';

import { listenerConnection, listenerGone, shouldAllowConnection } from '$lib/server/connections';
import { jsonError } from '$lib/server/error';
import { gatherExtraResponseData } from '$lib/server/extra';
import { validateRateLimiting, validateToken } from '../../common';


export const GET: RequestHandler = async (event) => {
    const {params} = event;
    const extra = gatherExtraResponseData(event);

    // Fetch params and validate everything we can before even looking at the body
    const { token } = params;
    validateToken(token, extra);
    await validateRateLimiting(event, extra);

    // Make sure we don't have too many connections
    if (!shouldAllowConnection(token)) {
        return jsonError(507, 'Too many connections', extra);
    }

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let pingInterval: any;

    const stream = new ReadableStream({
        async start(controller) {
            // Register the connection
            const listener = {
                send(event: string, data?: string, id?: string) {
                    controller.enqueue(`event: ${event}\n`);
                    if (data) {
                        controller.enqueue(`data: ${data}\n`);
                    }
                    if (id) {
                        controller.enqueue(`id: ${id}\n`);
                    }
                    controller.enqueue('\n');
                },

                close() {
                    listenerGone(token);
                    clearInterval(pingInterval);
                    controller.close();
                }
            };
            listenerConnection(token, listener);

            // Send a welcome message
            listener.send("welcome");

            // Send a ping every 30 seconds to keep the connection alive
            pingInterval = setInterval(() => {
                listener.send("ping");
            }, 30000);
        },

        cancel() {
            // Clear up the connection
            listenerGone(token);
            clearInterval(pingInterval);
        }
    });

    return new Response(stream, {
        headers: {
            // Denotes the response as SSE
            'Content-Type': 'text/event-stream',
            // Optional. Request the GET request not to be cached.
            'Cache-Control': 'no-cache no-store no-transform',
        }
    });
};
