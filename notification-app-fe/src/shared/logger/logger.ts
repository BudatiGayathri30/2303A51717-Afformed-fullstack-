import { env } from '../../config/env';
import type { Level, PackageName, Stack, LogPayload } from './types';

const logEndpoint = `${env.apiBaseUrl}/logs`;

async function dispatchLog(payload: LogPayload): Promise<void> {
  try {
    await fetch(logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    return;
  }
}

function writeLog(level: Level, pkg: PackageName, message: string, stack: Stack = 'frontend'): void {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message
  };

  queueMicrotask(() => {
    void dispatchLog(payload);
  });
}

export const logger = {
  debug(pkg: PackageName, message: string): void {
    writeLog('debug', pkg, message);
  },
  info(pkg: PackageName, message: string): void {
    writeLog('info', pkg, message);
  },
  warn(pkg: PackageName, message: string): void {
    writeLog('warn', pkg, message);
  },
  error(pkg: PackageName, message: string): void {
    writeLog('error', pkg, message);
  },
  fatal(pkg: PackageName, message: string): void {
    writeLog('fatal', pkg, message);
  }
} as const;
