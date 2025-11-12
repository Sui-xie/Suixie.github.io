import { ApiError } from '@/core/errors.js';

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) {
    return '';
  }
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function buildUrl(baseUrl, path, searchParams) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, baseUrl);

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

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    throw new ApiError('Invalid server response', { status: response.status || 0 });
  }
}

export function createHttpClient({ baseUrl, apiKey }) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return {
    async request(path, { method = 'GET', body, searchParams, headers: customHeaders } = {}) {
      const headers = new Headers({
        'x-cors-api-key': apiKey,
        ...customHeaders,
      });

      let payloadBody;
      if (body !== undefined) {
        headers.set('Content-Type', 'application/json');
        payloadBody = JSON.stringify(body);
      }

      const url = buildUrl(normalizedBaseUrl, path, searchParams);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: payloadBody,
        });

        const payload = await parseJson(response);

        if (!response.ok || payload.status !== 'success') {
          throw new ApiError(
            payload?.reason || response.statusText || 'Request failed',
            {
              status: response.status,
              payload,
            },
          );
        }

        return payload;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('Network error or server unavailable');
      }
    },
  };
}
