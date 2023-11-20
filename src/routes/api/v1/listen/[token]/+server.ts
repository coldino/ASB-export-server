import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { listenerConnection, listenerGone } from '$lib/server/connections';
import { isListenLimited } from '$lib/server/rates';
import { isTokenValid } from '$lib/validate';


export const GET: RequestHandler = async (event) => {
    const {params} = event;

    // Get the token and perform simple validation
    const { token } = params;
    if (!isTokenValid(token)) {
        throw error(400, 'Invalid token');
    }

    // Apply the rate limiter
    if (await isListenLimited(event)) {
        throw error(429, 'Too many requests');
    }

    let pingInterval: undefined|number;

    const stream = new ReadableStream({
        async start(controller) {
            // Register the connection
            const listener = {
                send(event: string, data?: string) {
                    controller.enqueue(`event: ${event}\n`);
                    if (data) {
                        controller.enqueue(`data: ${data}\n`);
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

            'Connection': 'keep-alive',
        }
    });
};
