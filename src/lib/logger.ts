type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    
    // In production, we might want to suppress debug logs or send them to an external service
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && level === 'debug') return;

    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;

    switch (level) {
      case 'info':
        console.log(formattedMessage, meta || '');
        break;
      case 'warn':
        console.warn(formattedMessage, meta || '');
        break;
      case 'error':
        console.error(formattedMessage, meta || '');
        break;
      case 'debug':
        console.debug(formattedMessage, meta || '');
        break;
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
