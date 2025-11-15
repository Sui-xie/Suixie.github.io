import { ApiError } from '@/core/errors.js';

export function createContentService({ http }) {
  if (!http) {
    throw new Error('createContentService requires an http client instance');
  }

  return {
    async getSponsor() {
      const payload = await http.request('/getSponsor');
      if (!payload?.data) {
        throw new ApiError('Invalid sponsor response', {
          status: 500,
          payload,
        });
      }

      return {
        status: 200,
        ...payload.data,
      };
    },

    async getFengshenList() {
      const payload = await http.request('/fsb', {
        method: 'GET',
      });

      const list = Array.isArray(payload?.data) ? payload.data : [];
      return {
        status: 200,
        list: list.map((item) => ({
          uuid: item?.uuid ?? '',
          uid: item?.uid ?? '',
          gid: item?.gid ?? '',
          qq: item?.qq ?? '',
          last_ip: item?.last_ip ?? '',
        })),
      };
    },
  };
}
