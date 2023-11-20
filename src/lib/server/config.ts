import { MAX_CONNECTIONS, MAX_EXPORT_SIZE, MAX_SERVER_SIZE } from "$env/static/private";


export const maxConnections = parseInt(MAX_CONNECTIONS, 10) || 1000;
export const maxExportSize = parseInt(MAX_EXPORT_SIZE, 10) || 4096;
export const maxServerSize = parseInt(MAX_SERVER_SIZE, 10) || 2096;
