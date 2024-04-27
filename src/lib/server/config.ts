import { building } from "$app/environment";
import { env } from "$env/dynamic/private";

function getEnvInt(name: string, def: number): number {
    if (building) {
        return def;
    }
    const str = env[name];
    if (!str) {
        return def;
    }
    const value = parseInt(str, 10);
    if (isNaN(value)) {
        return def;
    }
    return value;
}

function getEnvString(name: string, def: string): string {
    if (building) {
        return def;
    }
    const str = env[name];
    if (!str) {
        return def;
    }
    return str;
}

export const maxConnections = getEnvInt('MAX_CONNECTIONS', 1000);
export const maxExportSize = getEnvInt('MAX_EXPORT_SIZE', 4096);
export const maxServerSize = getEnvInt('MAX_SERVER_SIZE', 2096);
export const pingInterval = getEnvInt('PING_INTERVAL', 30000);
export const domainName = getEnvString('DOMAIN', 'localhost');

if (!building) {
    console.log('Config:');
    console.log('  MAX_CONNECTIONS:', env.MAX_CONNECTIONS);
    console.log('  MAX_EXPORT_SIZE:', env.MAX_EXPORT_SIZE);
    console.log('  MAX_SERVER_SIZE:', env.MAX_SERVER_SIZE);
    console.log('  BODY_SIZE_LIMIT:', env.BODY_SIZE_LIMIT);
    console.log('    PING_INTERVAL:', env.PING_INTERVAL);
    console.log('           DOMAIN:', env.DOMAIN);
}

export const serviceName = "asb-export-server";
