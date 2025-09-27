// Browser/Node.js compatibility check
const isServerSide = typeof window === 'undefined';

// Conditional imports for Node.js file system
let fs: any;
let path: any;

if (isServerSide) {
  try {
    fs = require('fs');
    path = require('path');
  } catch (error) {
    console.warn('Failed to load Node.js modules for file logging:', error);
  }
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

class FileLogger {
  private logQueue: LogEntry[] = [];
  private logDirectory: string;
  private maxLogFileSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogFiles: number = 5;
  private flushInterval: number = 5000; // 5 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(logDirectory: string = 'logs') {
    this.logDirectory = logDirectory;
    this.ensureLogDirectory();
    this.startPeriodicFlush();
  }

  private ensureLogDirectory(): void {
    if (!isServerSide || !fs || !path) {
      return;
    }

    try {
      const logPath = path.resolve(this.logDirectory);
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  private startPeriodicFlush(): void {
    if (!isServerSide) {
      return;
    }

    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  private flushLogs(): void {
    if (!isServerSide || !fs || !path || this.logQueue.length === 0) {
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const logFileName = `app-${today}.log`;
      const logFilePath = path.join(this.logDirectory, logFileName);

      // Prepare log entries
      const logEntries = this.logQueue.splice(0); // Clear queue
      const logLines = logEntries.map(entry => {
        const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
        const sourceStr = entry.source ? ` [${entry.source}]` : '';
        return `${entry.timestamp} | ${entry.level.toUpperCase()}${sourceStr} | ${entry.message}${dataStr}`;
      });

      // Append to log file
      const logContent = logLines.join('\n') + '\n';
      fs.appendFileSync(logFilePath, logContent, 'utf8');

      // Rotate logs if necessary
      this.rotateLogs();

    } catch (error) {
      console.error('Failed to flush logs to file:', error);
      // Put entries back in queue if write failed
      this.logQueue.unshift(...this.logQueue);
    }
  }

  private rotateLogs(): void {
    if (!isServerSide || !fs || !path) {
      return;
    }

    try {
      const files = fs.readdirSync(this.logDirectory)
        .filter((file: string) => file.startsWith('app-') && file.endsWith('.log'))
        .map((file: string) => ({
          name: file,
          path: path.join(this.logDirectory, file),
          stats: fs.statSync(path.join(this.logDirectory, file))
        }))
        .sort((a: any, b: any) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

      // Remove old files if we have too many
      if (files.length > this.maxLogFiles) {
        const filesToRemove = files.slice(this.maxLogFiles);
        filesToRemove.forEach((file: any) => {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(`Failed to remove old log file ${file.name}:`, error);
          }
        });
      }

      // Check current log file size and rotate if necessary
      if (files.length > 0) {
        const currentFile = files[0];
        if (currentFile.stats.size > this.maxLogFileSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const archiveName = `app-${timestamp}.log`;
          const archivePath = path.join(this.logDirectory, archiveName);
          
          try {
            fs.renameSync(currentFile.path, archivePath);
          } catch (error) {
            console.error('Failed to rotate log file:', error);
          }
        }
      }

    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }

  private addLogEntry(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source
    };

    // Always log to console as well
    const consoleMessage = `[${entry.timestamp}] ${source ? `[${source}] ` : ''}${message}`;
    switch (level) {
      case 'debug':
        console.debug(consoleMessage, data || '');
        break;
      case 'info':
        console.info(consoleMessage, data || '');
        break;
      case 'warn':
        console.warn(consoleMessage, data || '');
        break;
      case 'error':
        console.error(consoleMessage, data || '');
        break;
    }

    // Add to queue for file logging (only in server environment)
    if (isServerSide) {
      this.logQueue.push(entry);
      
      // Immediate flush for errors
      if (level === 'error') {
        this.flushLogs();
      }
    } else {
      // In browser, store in localStorage as fallback
      try {
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.push(entry);
        
        // Keep only last 100 entries in localStorage
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('app_logs', JSON.stringify(logs));
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }

  debug(message: string, data?: any, source?: string): void {
    this.addLogEntry('debug', message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.addLogEntry('info', message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.addLogEntry('warn', message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.addLogEntry('error', message, data, source);
  }

  // Force flush logs immediately
  flush(): void {
    if (isServerSide) {
      this.flushLogs();
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flushLogs(); // Final flush
  }
}

// Create singleton logger instance
export const logger = new FileLogger();

// Export convenience functions
export const logDebug = (message: string, data?: any, source?: string) => logger.debug(message, data, source);
export const logInfo = (message: string, data?: any, source?: string) => logger.info(message, data, source);
export const logWarn = (message: string, data?: any, source?: string) => logger.warn(message, data, source);
export const logError = (message: string, data?: any, source?: string) => logger.error(message, data, source);

// Browser-specific log viewer (for debugging in development)
export const getLogsFromStorage = (): LogEntry[] => {
  if (isServerSide) {
    return [];
  }
  
  try {
    return JSON.parse(localStorage.getItem('app_logs') || '[]');
  } catch {
    return [];
  }
};

// Clean up logs on page unload (browser only)
if (!isServerSide) {
  window.addEventListener('beforeunload', () => {
    logger.destroy();
  });
}