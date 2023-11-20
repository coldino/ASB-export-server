import { error } from "@sveltejs/kit";

import { maxConnections } from "./config";


type Listener = {
    send: (event: string, data?: string) => void;
    close: () => void;
}

export function isConnected(token: string): boolean {
    return connections.has(token);
}

export function sendData(token: string, event: string, data?: string | null | number | Record<string, unknown> | Array<unknown>): void {
    const connection = connections.get(token);
    if (!connection) return;

    if (typeof (data) === 'undefined') {
        connection.send(event);
    } else if (typeof data === "string") {
        connection.send(event, data);
    } else {
        connection.send(event, JSON.stringify(data));
    }
}

export function listenerConnection(token: string, listener: Listener): void {
    const connection = connections.get(token);
    if (connection) {
        connection.send("replaced");
        connection.close();
    } else if (connections.size >= maxConnections) {
        throw error(429, "Too many connections");
    }

    connections.set(token, listener);
}

export function listenerGone(token: string): void {
    connections.delete(token);
}

export function closeAll(notify = true): void {
    if (notify) {
        for (const connection of connections.values()) {
            connection.send("closing");
        }
    }
    for (const connection of connections.values()) {
        connection.close();
    }
    connections.clear();
}

export function getConnectionCount(): number {
    return connections.size;
}

const connections = new Map<string, Listener>();
