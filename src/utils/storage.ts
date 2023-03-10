// 默认缓存期限为7天
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export const storage = {
  remove(key: string) {
    window.localStorage.removeItem(key);
  },

  set(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME) {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    });
    window.localStorage.setItem(key, stringData);
  },

  get(key: string, defaultValue: unknown = null) {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  },

  clear() {
    window.localStorage.clear();
  }
};
