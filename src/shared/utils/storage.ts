export const storage = {
  local: {
    getJsonItem,
    removeItem,
    setJsonItem,
  },
};

function getJsonItem<FallbackValue>(key: string, fallback: FallbackValue): FallbackValue {
  return withLocalStorageKey(key, (storageKey) =>
    tryLocalStorage((storage) => {
      const value = storage.getItem(storageKey);

      if (value === null) {
        return fallback;
      }

      return JSON.parse(value) as FallbackValue;
    }, fallback),
  );
}

function removeItem(key: string) {
  withLocalStorageKey(key, (storageKey) =>
    tryLocalStorage((storage) => storage.removeItem(storageKey), void 0),
  );
}

function setJsonItem<StoredValue>(key: string, value: StoredValue): void {
  withLocalStorageKey(key, (storageKey) =>
    tryLocalStorage(
      (storage) => {
        storage.setItem(storageKey, JSON.stringify(value));
      },
      void 0,
    ),
  );
}

function withLocalStorageKey<Result>(key: string, callback: (key: string) => Result) {
  assertLocalStorageKey(key);
  return callback(key);
}

function assertLocalStorageKey(key: string): void {
  if (!key.trim()) {
    throw new Error('Storage key must be a non-empty string.');
  }
}

function tryLocalStorage<Result>(operation: (storage: Storage) => Result, fallback: Result) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    return operation(window.localStorage);
  } catch {
    return fallback;
  }
}
