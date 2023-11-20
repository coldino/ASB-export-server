import { env } from "$env/dynamic/private";


export const maxConnections = parseInt(env.MAX_CONNECTIONS, 10) || 1000;
export const maxExportSize = parseInt(env.MAX_EXPORT_SIZE, 10) || 4096;
export const maxServerSize = parseInt(env.MAX_SERVER_SIZE, 10) || 2096;
