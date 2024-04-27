import { env } from "$env/dynamic/private";


export const maxConnections = parseInt(env.MAX_CONNECTIONS, 10) || 1000;
export const maxExportSize = parseInt(env.MAX_EXPORT_SIZE, 10) || 4096;
export const maxServerSize = parseInt(env.MAX_SERVER_SIZE, 10) || 2096;
export const pingInterval = parseInt(env.PING_INTERVAL, 10) || 30000;

console.log('Config:');
console.log('  MAX_CONNECTIONS:', env.MAX_CONNECTIONS);
console.log('  MAX_EXPORT_SIZE:', env.MAX_EXPORT_SIZE);
console.log('  MAX_SERVER_SIZE:', env.MAX_SERVER_SIZE);
console.log('  BODY_SIZE_LIMIT:', env.BODY_SIZE_LIMIT);
console.log('    PING_INTERVAL:', env.PING_INTERVAL);

export const serviceName = "asb-export-server";
