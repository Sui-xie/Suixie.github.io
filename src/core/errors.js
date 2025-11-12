export class ApiError extends Error {
  constructor(message, { status = 0, payload } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.reason = message;
  }
}

export function assert(condition, message, meta) {
  if (!condition) {
    throw new ApiError(message, meta);
  }
}
