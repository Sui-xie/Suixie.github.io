import { ApiError } from '@/core/errors.js';
import { validators } from '../validators.js';

export function createAuthService({ http, tokenStore }) {
  if (!http) {
    throw new Error('createAuthService requires an http client instance');
  }

  return {
    async sendCode(mail) {
      validators.email(mail);
      const payload = await http.request('/genMailCode', {
        method: 'GET',
        searchParams: { mail },
      });

      if (typeof payload.code === 'undefined') {
        throw new ApiError('Invalid response format', {
          status: 500,
          payload,
        });
      }

      return { status: 200, code: payload.code };
    },

    async login(account, password) {
      validators.username(account);
      if (!password) {
        throw new ApiError('Missing password', { status: 400 });
      }

      const payload = await http.request('/login', {
        method: 'POST',
        body: {
          type: 'username',
          identifier: account,
          password,
        },
      });

      if (payload.token) {
        tokenStore?.write(payload.token);
      }

      return {
        status: 200,
        token: payload.token,
      };
    },

    async register(account, password, code) {
      validators.username(account);
      validators.password(password);
      validators.code(code);

      const payload = await http.request('/register', {
        method: 'GET',
        searchParams: {
          username: account,
          password,
          mailCode: code,
        },
      });

      if (payload.token) {
        tokenStore?.write(payload.token);
      }

      return {
        status: 200,
        message: 'Registration successful',
      };
    },

    async recover(account) {
      validators.username(account);

      await http.request('/recover', {
        method: 'GET',
        searchParams: { username: account },
      });

      return {
        status: 200,
        message: 'Recovery successful',
      };
    },

    async sign(account) {
      validators.username(account);
      const token = tokenStore?.read();
      if (!token) {
        throw new ApiError('No token available', { status: 401 });
      }

      await http.request('/sign', {
        method: 'GET',
        searchParams: {
          username: account,
          token,
        },
      });

      return {
        status: 200,
        message: 'Sign successful',
      };
    },
  };
}
