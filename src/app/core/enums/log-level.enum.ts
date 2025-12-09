// Nivel de log
export enum LogLevel {
  INFO = 'INF',
  DEBUG = 'DBG',
  WARNING = 'WRN',
  ERROR = 'ERR',
  CRITICAL = 'CRT',
  FATAL = 'FTL',
}

// Clases CSS para cada nivel de log
 
export const LOG_LEVEL_CLASSES: Record<LogLevel, string> = {
  [LogLevel.INFO]: 'bg-blue-500 text-white',
  [LogLevel.DEBUG]: 'bg-gray-500 text-white',
  [LogLevel.WARNING]: 'bg-yellow-500 text-black',
  [LogLevel.ERROR]: 'bg-red-500 text-white',
  [LogLevel.CRITICAL]: 'bg-purple-600 text-white',
  [LogLevel.FATAL]: 'bg-black text-white border border-red-600',
};

// Obtiene la clase CSS para un nivel de log
export function getLogLevelClass(logLevel: string): string {
  const level = logLevel as LogLevel;
  return LOG_LEVEL_CLASSES[level] || 'bg-gray-400 text-white';
}
