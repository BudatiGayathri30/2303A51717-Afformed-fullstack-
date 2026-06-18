import axiosClient from '../api/axiosClient';
import { env } from '../config/env';
import { logger } from '../shared/logger/logger';

type RegisterResponse = Record<string, unknown>;
type AuthResponse = Record<string, unknown>;

function readResponseValue(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const directValue = payload[key];
    if (typeof directValue === 'string' && directValue.trim()) {
      return directValue.trim();
    }

    if (directValue && typeof directValue === 'object') {
      const nestedValue = readResponseValue(directValue as Record<string, unknown>, keys);
      if (nestedValue) {
        return nestedValue;
      }
    }
  }

  return '';
}

export async function register(): Promise<void> {
  logger.info('auth', 'Register request started');

  const response = await axiosClient.post<RegisterResponse>('/register', {
    accessCode: env.accessCode
  });

  const responseBody = response.data ?? {};
  const clientId = readResponseValue(responseBody, ['clientId', 'client_id', 'clientID']);
  const clientSecret = readResponseValue(responseBody, ['clientSecret', 'client_secret']);

  if (!clientId || !clientSecret) {
    throw new Error('Client credentials were not returned');
  }

  env.setClientCredentials(clientId, clientSecret);
  logger.info('auth', 'Client credentials stored');
}

export async function auth(): Promise<string> {
  if (!env.clientId || !env.clientSecret) {
    throw new Error('Client credentials are required');
  }

  logger.info('auth', 'Authentication request started');

  const response = await axiosClient.post<AuthResponse>('/auth', {
    clientId: env.clientId,
    clientSecret: env.clientSecret
  });

  const responseBody = response.data ?? {};
  const accessToken = readResponseValue(responseBody, ['accessToken', 'access_token', 'token']);

  if (!accessToken) {
    throw new Error('Access token was not returned');
  }

  env.setAccessToken(accessToken);
  logger.info('auth', 'Access token stored');
  return accessToken;
}

export async function ensureAuthReady(): Promise<string | undefined> {
  if (env.hasAccessToken()) {
    return env.accessToken;
  }

  try {
    if (!env.hasClientCredentials()) {
      await register();
    }

    if (!env.hasAccessToken()) {
      await auth();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication bootstrap failed';
    logger.error('auth', message);
  }

  return env.accessToken || undefined;
}
