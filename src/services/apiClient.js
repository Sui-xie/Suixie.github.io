import { resolveApiConfig } from '@/core/config.js';
import { createHttpClient } from './httpClient.js';
import { createTokenStore } from './tokenStore.js';
import { createAuthService } from './modules/authService.js';
import { createContentService } from './modules/contentService.js';

export class ApiClient {
  constructor(options = {}) {
    this.config = resolveApiConfig(options);
    this.tokenStore = createTokenStore(this.config.tokenStorageKey);
    this.http = createHttpClient({
      baseUrl: this.config.baseUrl,
      apiKey: this.config.apiKey,
    });

    this.services = {
      ...createAuthService({ http: this.http, tokenStore: this.tokenStore }),
      ...createContentService({ http: this.http }),
    };
  }

  request(path, options) {
    return this.http.request(path, options);
  }

  readToken() {
    return this.tokenStore.read();
  }

  setToken(token) {
    this.tokenStore.write(token);
  }

  clearToken() {
    this.tokenStore.clear();
  }

  sendCode(...args) {
    return this.services.sendCode(...args);
  }

  login(...args) {
    return this.services.login(...args);
  }

  register(...args) {
    return this.services.register(...args);
  }

  recover(...args) {
    return this.services.recover(...args);
  }

  sign(...args) {
    return this.services.sign(...args);
  }

  getSponsor(...args) {
    return this.services.getSponsor(...args);
  }

  getFengshenList(...args) {
    return this.services.getFengshenList(...args);
  }
}

export function createApiClient(options) {
  return new ApiClient(options);
}

export { ApiError } from '@/core/errors.js';
