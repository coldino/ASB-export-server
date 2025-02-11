import { maxConnections } from "./config";
import { jsonError } from "./error";


type Listener = {
    send: (event: string, data?: string, id?: string) => void;
    close: () => void;
}

export function isConnected(token: string): boolean {
    return connections.has(token);
}

export function shouldAllowConnection(token: string): boolean {
    return connections.has(token) || connections.size < maxConnections;
}

export function sendData(token: string, event: string, data?: string | null | number | object | Array<unknown>, id?: string): void {
    const connection = connections.get(token);
    if (!connection) return;

    if (typeof (data) === 'undefined') {
        connection.send(event, undefined, id);
    } else if (typeof data === "string") {
        connection.send(event, data, id);
    } else {
        connection.send(event, JSON.stringify(data), id);
    }
}

export function listenerConnection(token: string, listener: Listener, errorExtra?: Record<string, unknown>): void {
    const connection = connections.get(token);
    if (connection) {
        connection.send("replaced");
        connection.close();
    } else if (connections.size >= maxConnections) {
        jsonError(429, "Too many connections", errorExtra);
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

export function getNewReponseId(): string {
    return Math.random().toString(36).substring(2);
}

export function addResponseListener(id: string, listener: (data: unknown) => void): void {
    responseListeners.set(id, listener);
}

export function removeResponseListener(id: string): void {
    responseListeners.delete(id);
}

export function sendResponse(id: string, data: unknown): void {
    responseListeners.get(id)?.(data);
}

export function isValidResponseId(id: string): boolean {
    return responseListeners.has(id);
}

const connections = new Map<string, Listener>();
const responseListeners = new Map<string, (data: unknown) => void>();
