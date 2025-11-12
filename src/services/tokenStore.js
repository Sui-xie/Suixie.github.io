export function createTokenStore(storageKey) {
  const key = storageKey || 'userToken';

  const safeExecute = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };

  return {
    read() {
      return safeExecute(() => localStorage.getItem(key));
    },
    write(token) {
      safeExecute(() => {
        if (token) {
          localStorage.setItem(key, token);
        } else {
          localStorage.removeItem(key);
        }
      });
    },
    clear() {
      safeExecute(() => localStorage.removeItem(key));
    },
  };
}
