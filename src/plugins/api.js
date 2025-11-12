import { inject } from 'vue';
import { createApiClient } from '@/services/apiClient.js';

const API_SYMBOL = Symbol('api-client');

export function createApiPlugin(options = {}) {
  const client = createApiClient(options);

  return {
    install(app) {
      app.provide(API_SYMBOL, client);
      app.config.globalProperties.$api = client;
    },
  };
}

export function useApi() {
  const api = inject(API_SYMBOL);
  if (!api) {
    throw new Error('API client is not available. Did you forget to install the api plugin?');
  }
  return api;
}
