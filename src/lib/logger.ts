/**
 * Centralized logging utility with log levels
 * Prevents console logs from leaking to production and provides better control
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

class Logger {
  private static childLoggers = new Map<string, Logger>();
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.getDefaultLogLevel(),
      enabled: import.meta.env.DEV,
      ...config,
    };
  }

  private getDefaultLogLevel(): LogLevel {
    if (import.meta.env.PROD) {
      return 'error';
    }
    // Read from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('app:logLevel') as LogLevel;
        if (stored && LOG_LEVELS[stored] !== undefined) {
          return stored;
        }
      } catch {
        // localStorage unavailable, fall back to default
      }
      if (stored && LOG_LEVELS[stored] !== undefined) {
        return stored;
      }
    }
    return 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    return `${timestamp} ${prefix}[${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), data ?? '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data ?? '');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error ?? '');
    }
  }

  /**
   * Set the log level at runtime
   * Persists to localStorage for development mode
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('app:logLevel', level);
      } catch {
        // localStorage unavailable, ignore silently
      }
    }
  }

  /**
   * Enable or disable logging entirely
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Create a child logger with a specific prefix
   * Child loggers are cached to prevent memory leaks
   */
  createChild(prefix: string): Logger {
    const fullPrefix = this.config.prefix
      ? `${this.config.prefix}:${prefix}`
      : prefix;

    // Return cached child logger if it exists
    if (Logger.childLoggers.has(fullPrefix)) {
      return Logger.childLoggers.get(fullPrefix)!;
    }

    // Create and cache new child logger
    const child = new Logger({
      ...this.config,
      prefix: fullPrefix,
    });

    Logger.childLoggers.set(fullPrefix, child);
    return child;
  }
}

// Create default logger instance
export const logger = new Logger();

// Create specific loggers for different modules
export const canvasLogger = logger.createChild('Canvas');
export const storageLogger = logger.createChild('Storage');
export const storeLogger = logger.createChild('Store');
export const plantLogger = logger.createChild('Plant');

// Export the Logger class for creating custom loggers
export { Logger };
