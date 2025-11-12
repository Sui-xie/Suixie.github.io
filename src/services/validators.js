import { ApiError } from '@/core/errors.js';
import { EMAIL_REGEX, PASSWORD_REGEX, CODE_REGEX } from '@/core/constants.js';

export const validators = {
  email(value) {
    if (!value) {
      throw new ApiError('Missing email', { status: 400 });
    }
    if (!EMAIL_REGEX.test(value)) {
      throw new ApiError('Invalid email format', { status: 400 });
    }
  },
  password(value) {
    if (!value) {
      throw new ApiError('Missing password', { status: 400 });
    }
    if (!PASSWORD_REGEX.test(value)) {
      throw new ApiError('Weak password', { status: 400 });
    }
  },
  code(value) {
    if (!value) {
      throw new ApiError('Missing mail code', { status: 400 });
    }
    if (!CODE_REGEX.test(String(value))) {
      throw new ApiError('Mail code must be numeric', { status: 400 });
    }
  },
  username(value) {
    if (!value) {
      throw new ApiError('Missing username', { status: 400 });
    }
  },
};
