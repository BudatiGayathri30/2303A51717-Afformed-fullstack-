type RuntimeEnv = {
  apiBaseUrl: string;
  accessCode: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
};

const storageKeys = {
  clientId: 'notification_app_client_id',
  clientSecret: 'notification_app_client_secret',
  accessToken: 'notification_app_access_token'
} as const;

function readStorageValue(key: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(key) ?? '';
}

function writeStorageValue(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (value) {
    window.localStorage.setItem(key, value);
    return;
  }

  window.localStorage.removeItem(key);
}

function requireEnvironmentValue(name: string, value: string | undefined): string {
  const normalizedValue = value?.trim() ?? '';

  if (!normalizedValue) {
    throw new Error(`${name} is required`);
  }

  return normalizedValue;
}

function initializeRuntimeEnv(): RuntimeEnv {
  return {
    apiBaseUrl: requireEnvironmentValue('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
    accessCode: requireEnvironmentValue('VITE_ACCESS_CODE', import.meta.env.VITE_ACCESS_CODE),
    clientId: import.meta.env.VITE_CLIENT_ID?.trim() || readStorageValue(storageKeys.clientId),
    clientSecret: import.meta.env.VITE_CLIENT_SECRET?.trim() || readStorageValue(storageKeys.clientSecret),
    accessToken: import.meta.env.VITE_ACCESS_TOKEN?.trim() || readStorageValue(storageKeys.accessToken)
  };
}

let runtimeEnv = initializeRuntimeEnv();

export function maskSecret(value: string): string {
  if (!value) {
    return '';
  }

  const visiblePrefix = value.slice(0, 4);
  const hiddenLength = Math.max(value.length - visiblePrefix.length, 0);
  return `${visiblePrefix}${hiddenLength > 0 ? '*'.repeat(hiddenLength) : ''}`;
}

function persistRuntimeEnv(): void {
  writeStorageValue(storageKeys.clientId, runtimeEnv.clientId);
  writeStorageValue(storageKeys.clientSecret, runtimeEnv.clientSecret);
  writeStorageValue(storageKeys.accessToken, runtimeEnv.accessToken);
}

export const env = {
  get apiBaseUrl(): string {
    return runtimeEnv.apiBaseUrl;
  },
  get accessCode(): string {
    return runtimeEnv.accessCode;
  },
  get clientId(): string {
    return runtimeEnv.clientId;
  },
  get clientSecret(): string {
    return runtimeEnv.clientSecret;
  },
  get accessToken(): string {
    return runtimeEnv.accessToken;
  },
  setClientCredentials(clientId: string, clientSecret: string): void {
    runtimeEnv = {
      ...runtimeEnv,
      clientId,
      clientSecret
    };

    persistRuntimeEnv();
  },
  setAccessToken(accessToken: string): void {
    runtimeEnv = {
      ...runtimeEnv,
      accessToken
    };

    persistRuntimeEnv();
  },
  clearAccessToken(): void {
    runtimeEnv = {
      ...runtimeEnv,
      accessToken: ''
    };

    persistRuntimeEnv();
  },
  hasClientCredentials(): boolean {
    return Boolean(runtimeEnv.clientId && runtimeEnv.clientSecret);
  },
  hasAccessToken(): boolean {
    return Boolean(runtimeEnv.accessToken);
  },
  snapshot(): RuntimeEnv {
    return { ...runtimeEnv };
  }
} as const;
