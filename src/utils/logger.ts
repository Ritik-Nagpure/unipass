import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      logStep?: (step: string, meta?: Record<string, any>) => void;
    }
  }
}

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// LOGGER CONFIGURATION
// ============================================
const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'unipass.log');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOG_FILES = 5;

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ============================================
// LOG LEVELS
// ============================================
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// ============================================
// LOG ROTATION
// ============================================
const rotateLogFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > MAX_LOG_SIZE) {
        // Rotate existing log file
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath, '.log');
        const ext = path.extname(filePath);
        
        // Get all log files for this base name
        const files = fs.readdirSync(dir)
          .filter(f => f.startsWith(basename) && f.endsWith(ext))
          .sort();
        
        // Delete oldest file if max files reached (only if files array has items)
        if (files.length >= MAX_LOG_FILES && files.length > 0) {
          const oldest = files[0];
          if (oldest) {
            const oldestPath = path.join(dir, oldest);
            if (fs.existsSync(oldestPath)) {
              fs.unlinkSync(oldestPath);
            }
          }
        }
        
        // Rename current log file with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newName = `${basename}-${timestamp}${ext}`;
        const newPath = path.join(dir, newName);
        
        // Only rename if the file exists and the new path doesn't already exist
        if (fs.existsSync(filePath) && !fs.existsSync(newPath)) {
          fs.renameSync(filePath, newPath);
        }
      }
    }
  } catch (error) {
    console.error('Log rotation error:', error);
  }
};

// ============================================
// WRITE TO LOG FILE
// ============================================
const writeToFile = (filePath: string, message: string) => {
  try {
    // Rotate log file if needed
    rotateLogFile(filePath);
    
    // Write log entry
    fs.appendFileSync(filePath, message + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

// ============================================
// FORMAT LOG ENTRY
// ============================================
const formatLogEntry = (
  level: LogLevel,
  message: string,
  meta?: Record<string, any>
): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

// ============================================
// LOGGER CLASS
// ============================================
class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = LogLevel.DEBUG;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry = formatLogEntry(level, message, meta);
    
    // Console output with colors
    const colorMap = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    };
    
    const resetColor = '\x1b[0m';
    const color = colorMap[level] || '';
    
    console.log(`${color}${entry}${resetColor}`);

    // Write to log file
    writeToFile(LOG_FILE, entry);

    // Write errors to separate error log file
    if (level === LogLevel.ERROR) {
      writeToFile(ERROR_LOG_FILE, entry);
    }
  }

  // ============================================
  // PUBLIC LOGGING METHODS
  // ============================================

  public debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  public error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  public step(req: any, step: string, meta?: Record<string, any>): void {
    this.debug(`STEP ${req.method} ${req.originalUrl || req.url}: ${step}`, {
      requestId: req.requestId,
      userId: req.userId,
      ...meta,
    });
  }

  // ============================================
  // REQUEST LOGGING
  // ============================================
  public logRequest(req: any, res: any, next: any): void {
    const start = Date.now();
    req.requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    req.logStep = (step: string, meta?: Record<string, any>) => this.step(req, step, meta);

    this.info(`REQ ${req.method} ${req.originalUrl || req.url} received`, {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      userAgent: req.headers?.['user-agent'] || 'unknown',
    });
    
    // Log after response is sent
    res.on('finish', () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
      
      this.log(level, `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, {
        method: req.method,
        url: req.originalUrl || req.url,
        requestId: req.requestId,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.headers?.['user-agent'] || 'unknown',
      });
    });
    
    next();
  }

  // ============================================
  // ERROR LOGGING WITH STACK TRACE
  // ============================================
  public logError(error: Error, context?: string): void {
    this.error(
      context ? `${context}: ${error.message}` : error.message,
      {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: context || 'UnhandledError',
      }
    );
  }

  // ============================================
  // GET LOGS
  // ============================================
  public getLogs(lines: number = 100): string[] {
    try {
      if (!fs.existsSync(LOG_FILE)) return [];
      
      const content = fs.readFileSync(LOG_FILE, 'utf-8');
      const logs = content.split('\n').filter(line => line.trim());
      return logs.slice(-lines);
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  public getErrorLogs(lines: number = 100): string[] {
    try {
      if (!fs.existsSync(ERROR_LOG_FILE)) return [];
      
      const content = fs.readFileSync(ERROR_LOG_FILE, 'utf-8');
      const logs = content.split('\n').filter(line => line.trim());
      return logs.slice(-lines);
    } catch (error) {
      console.error('Failed to read error logs:', error);
      return [];
    }
  }

  // ============================================
  // CLEAR LOGS
  // ============================================
  public clearLogs(): void {
    try {
      if (fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '');
      }
      if (fs.existsSync(ERROR_LOG_FILE)) {
        fs.writeFileSync(ERROR_LOG_FILE, '');
      }
      this.info('Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================
export const logger = Logger.getInstance();

// ============================================
// REQUEST LOGGING MIDDLEWARE
// ============================================
export const requestLogger = (req: any, res: any, next: any) => {
  logger.logRequest(req, res, next);
};

// ============================================
// ERROR LOGGING MIDDLEWARE
// ============================================
export const errorLogger = (err: Error, req: any, res: any, next: any) => {
  logger.logError(err, `Request: ${req.method} ${req.url}`);
  next(err);
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default logger;
