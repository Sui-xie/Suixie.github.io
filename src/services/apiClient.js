const DEFAULT_BASE_URL = 'https://cors.sh/http://183.131.51.178:7878';
const DEFAULT_API_KEY = 'temp_c92b19faf3cd3d6da1a958e1603d1ab0';
const DEFAULT_TOKEN_STORAGE_KEY = 'userToken';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export class ApiError extends Error {
  constructor(message, status = 0, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.reason = message;
  }
}

export class ApiClient {
  constructor({
    baseUrl = DEFAULT_BASE_URL,
    port,
    apiKey = DEFAULT_API_KEY,
    tokenStorageKey = DEFAULT_TOKEN_STORAGE_KEY,
  } = {}) {
    const trimmedBaseUrl = (baseUrl || DEFAULT_BASE_URL).trim();
    this.baseUrl = trimmedBaseUrl.endsWith(':') && port
      ? `${trimmedBaseUrl}${port}`
      : trimmedBaseUrl;
    this.apiKey = apiKey;
    this.tokenStorageKey = tokenStorageKey;
    this.token = this.readToken();
  }

  readToken() {
    try {
      return localStorage.getItem(this.tokenStorageKey);
    } catch {
      return null;
    }
  }

  setToken(token) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem(this.tokenStorageKey, token);
      } else {
        localStorage.removeItem(this.tokenStorageKey);
      }
    } catch {
      // 忽略本地存储错误，避免阻断登录流�?
    }
  }

  get normalizedBaseUrl() {
    return this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
  }

  buildUrl(path, searchParams) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(normalizedPath, this.normalizedBaseUrl);

    if (searchParams && Object.keys(searchParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url.search = queryString;
      }
    }

    return url.toString();
  }

  async request(path, { method = 'GET', body, searchParams } = {}) {
    const url = this.buildUrl(path, searchParams);
    const headers = new Headers({
      'x-cors-api-key': this.apiKey,
    });

    let payloadBody;
    if (body !== undefined) {
      headers.set('Content-Type', 'application/json');
      payloadBody = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: payloadBody,
      });

      const payload = await this.parseJson(response);

      if (!response.ok || payload.status !== 'success') {
        throw new ApiError(
          payload?.reason || response.statusText || 'Request failed',
          response.status,
          payload,
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error or server unavailable', 0);
    }
  }

  async parseJson(response) {
    try {
      return await response.json();
    } catch {
      throw new ApiError('Invalid server response', response.status || 0);
    }
  }

  validateEmail(mail) {
    if (!mail) {
      throw new ApiError('Missing email', 400);
    }
    if (!EMAIL_REGEX.test(mail)) {
      throw new ApiError('Invalid email format', 400);
    }
  }

  validatePassword(password) {
    if (!password) {
      throw new ApiError('Missing password', 400);
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new ApiError('Weak password', 400);
    }
  }

  validateCode(code) {
    if (!code) {
      throw new ApiError('Missing mail code', 400);
    }
    if (Number.isNaN(Number(code))) {
      throw new ApiError('Mail code must be numeric', 400);
    }
  }

  async sendCode(mail) {
    this.validateEmail(mail);
    const payload = await this.request('/genMailCode', {
      method: 'GET',
      searchParams: { mail },
    });

    if (typeof payload.code === 'undefined') {
      throw new ApiError('Invalid response format', 500, payload);
    }

    return { status: 200, code: payload.code };
  }

  async login(account, password) {
    if (!account) {
      throw new ApiError('Missing username', 400);
    }
    if (!password) {
      throw new ApiError('Missing password', 400);
    }

    const payload = await this.request('/login', {
      method: 'POST',
      body: {
        type: 'username',
        identifier: account,
        password,
      },
    });

    if (payload.token) {
      this.setToken(payload.token);
    }

    return {
      status: 200,
      token: payload.token,
    };
  }

  async register(account, password, code) {
    if (!account) {
      throw new ApiError('Missing username', 400);
    }
    this.validatePassword(password);
    this.validateCode(code);

    const payload = await this.request('/register', {
      method: 'GET',
      searchParams: {
        username: account,
        password,
        mailCode: code,
      },
    });

    if (payload.token) {
      this.setToken(payload.token);
    }

    return {
      status: 200,
      message: 'Registration successful',
    };
  }

  async recover(account) {
    if (!account) {
      throw new ApiError('Missing username', 400);
    }

    await this.request('/recover', {
      method: 'GET',
      searchParams: { username: account },
    });

    return {
      status: 200,
      message: 'Recovery successful',
    };
  }

  async sign(account) {
    if (!account) {
      throw new ApiError('Missing username', 400);
    }
    if (!this.token) {
      throw new ApiError('No token available', 401);
    }

    await this.request('/sign', {
      method: 'GET',
      searchParams: {
        username: account,
        token: this.token,
      },
    });

    return {
      status: 200,
      message: 'Sign successful',
    };
  }

  async getSponsor() {
    const payload = await this.request('/getSponsor');
    if (!payload?.data) {
      throw new ApiError('Invalid sponsor response', 500, payload);
    }

    return {
      status: 200,
      ...payload.data,
    };
  }
}

export function createApiClient(options) {
  return new ApiClient(options);
}
