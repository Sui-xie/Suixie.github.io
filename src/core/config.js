import { API_DEFAULTS } from './constants.js';

function readEnv() {
  try {
    return import.meta?.env ?? {};
  } catch {
    return {};
  }
}

function normalizeBaseUrl(baseUrl, port) {
  const candidate = (baseUrl ?? '').trim() || API_DEFAULTS.baseUrl;
  if (candidate.endsWith(':') && port) {
    return `${candidate}${port}`;
  }
  return candidate;
}

export function resolveApiConfig(overrides = {}) {
  const env = readEnv();

  const baseUrl = overrides.baseUrl ?? env.VITE_API_BASE_URL ?? API_DEFAULTS.baseUrl;
  const port = overrides.port ?? env.VITE_API_PORT ?? API_DEFAULTS.port;
  const apiKey = overrides.apiKey ?? env.VITE_API_KEY ?? API_DEFAULTS.apiKey;
  const tokenStorageKey = overrides.tokenStorageKey ?? env.VITE_TOKEN_STORAGE_KEY ?? API_DEFAULTS.tokenStorageKey;

  return {
    baseUrl: normalizeBaseUrl(baseUrl, port),
    apiKey,
    tokenStorageKey,
  };
}
