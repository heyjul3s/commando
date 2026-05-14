export const STORAGE_KEYS = {
  RecentCommandIds: 'RECENT_COMMAN_IDS',
};

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
