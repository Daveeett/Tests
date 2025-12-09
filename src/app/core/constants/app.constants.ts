// Configuración de la sesión
export const SESSION_CONFIG = {
  // Tiempo de expiración de la sesión en milisegundos (1 hora)
  EXPIRY_TIME: 1 * 60 * 60 * 1000,
  // Intervalo de verificación de la sesión en milisegundos
  CHECK_INTERVAL: 2000,
} as const;

// Monitoreo de la conexión
export const CONNECTION_CONFIG = {
  // Intervalo de ping en milisegundos (10 segundos)
  PING_INTERVAL: 10 * 1000,
} as const;

// Configuración de la encuesta
export const POLLING_CONFIG = {
  // Intervalo de encuesta de usuarios en milisegundos (6 segundos)
  LOGS_USERS_INTERVAL: 6000,
} as const;

// Paginación
export const PAGINATION_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_PAGES: 5,
} as const;

// Claves de almacenamiento local
export const STORAGE_KEYS = {
  AUTH_CODE: 'authCode',
  AUTH_CODE_EXPIRY: 'authCodeExpiry',
} as const;

// Configuración de la API
export const API_CONFIG = {
  DEVELOPER_BASE_PATH: '/developer',
} as const;
