/**
 * Logger utility for test debugging and reporting
 * Provides structured logging with different levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  private static instance: Logger;
  private enabled: boolean = true;
  private level: LogLevel = LogLevel.INFO;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set logging enabled/disabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(this.level);
    const messageIndex = levels.indexOf(level);

    return messageIndex >= currentIndex;
  }

  /**
   * Format log message
   */
  private format(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level}] ${message}`;
    
    if (data !== undefined) {
      formatted += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    return formatted;
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.format(LogLevel.DEBUG, message, data));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.format(LogLevel.INFO, message, data));
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.format(LogLevel.WARN, message, data));
    }
  }

  /**
   * Error level logging
   */
  error(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.format(LogLevel.ERROR, message, data));
    }
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, body?: any, headers?: any): void {
    this.debug(`API Request: ${method} ${url}`, { body, headers });
  }

  /**
   * Log API response
   */
  logResponse(status: number, body?: any, headers?: any): void {
    this.debug(`API Response: ${status}`, { body, headers });
  }

  /**
   * Log test step
   */
  step(description: string): void {
    this.info(`Step: ${description}`);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
