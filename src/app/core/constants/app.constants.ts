export const SESSION_CONFIG = {
  EXPIRY_TIME: 1 * 60 * 60 * 1000,
  CHECK_INTERVAL: 2000,
} as const;
export const STORAGE_KEYS = {
  AUTH_CODE: 'authCode',
  AUTH_CODE_EXPIRY: 'authCodeExpiry',
} as const;
export const API_CONFIG = {
  DEVELOPER_BASE_PATH: '/developer',
} as const;
