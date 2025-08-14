const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
    constructor() {
        this.logFile = path.join(logsDir, 'app.log');
        this.errorFile = path.join(logsDir, 'error.log');
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta
        };
        return JSON.stringify(logEntry) + '\n';
    }

    writeToFile(filename, content) {
        if (process.env.NODE_ENV !== 'test') {
            fs.appendFileSync(filename, content);
        }
    }

    info(message, meta = {}) {
        const logEntry = this.formatMessage('INFO', message, meta);
        console.log(`[INFO] ${message}`, meta);
        this.writeToFile(this.logFile, logEntry);
    }

    error(message, error = null, meta = {}) {
        const errorMeta = error ? {
            ...meta,
            stack: error.stack,
            name: error.name
        } : meta;

        const logEntry = this.formatMessage('ERROR', message, errorMeta);
        console.error(`[ERROR] ${message}`, errorMeta);
        this.writeToFile(this.errorFile, logEntry);
    }

    warn(message, meta = {}) {
        const logEntry = this.formatMessage('WARN', message, meta);
        console.warn(`[WARN] ${message}`, meta);
        this.writeToFile(this.logFile, logEntry);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV !== 'production') {
            const logEntry = this.formatMessage('DEBUG', message, meta);
            console.log(`[DEBUG] ${message}`, meta);
            this.writeToFile(this.logFile, logEntry);
        }
    }

    // Log HTTP requests
    logRequest(req, res, responseTime) {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            responseTime: responseTime + 'ms',
            statusCode: res.statusCode,
            userId: req.session?.user?.id || 'anonymous'
        };

        if (res.statusCode >= 400) {
            this.error(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, null, logData);
        } else {
            this.info(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, logData);
        }
    }

    // Log authentication events
    logAuth(action, userId, email, success, meta = {}) {
        const logData = {
            action,
            userId,
            email,
            success,
            ...meta
        };

        if (success) {
            this.info(`Authentication: ${action} successful for ${email}`, logData);
        } else {
            this.warn(`Authentication: ${action} failed for ${email}`, logData);
        }
    }

    // Log security events
    logSecurity(event, details, severity = 'WARN') {
        const logData = {
            event,
            severity,
            ...details
        };

        if (severity === 'ERROR') {
            this.error(`Security Event: ${event}`, null, logData);
        } else {
            this.warn(`Security Event: ${event}`, logData);
        }
    }
}

module.exports = new Logger();
