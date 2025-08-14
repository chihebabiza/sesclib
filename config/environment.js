const config = {
    development: {
        port: process.env.PORT || 4000,
        mongoUri: process.env.MONGO_URI,
        sessionSecret: process.env.SESSION_SECRET || 'dev-secret-key',
        logLevel: 'dev',
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 1000, // Very high for development
        authRateLimitMax: 50,
        fileUploadSizeLimit: 10 * 1024 * 1024, // 10MB
        sessionMaxAge: 24 * 60 * 60 * 1000, // 24 hours
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:4000'],
            credentials: true
        }
    },

    production: {
        port: process.env.PORT || 4000,
        mongoUri: process.env.MONGO_URI,
        sessionSecret: process.env.SESSION_SECRET,
        logLevel: 'combined',
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 100, // Stricter for production
        authRateLimitMax: 5,
        fileUploadSizeLimit: 10 * 1024 * 1024, // 10MB
        sessionMaxAge: 24 * 60 * 60 * 1000, // 24 hours
        cors: {
            origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://sesclib.onrender.com'],
            credentials: true
        }
    },

    test: {
        port: process.env.PORT || 5000,
        mongoUri: process.env.TEST_MONGO_URI || process.env.MONGO_URI,
        sessionSecret: 'test-secret-key',
        logLevel: 'dev',
        rateLimitWindow: 15 * 60 * 1000,
        rateLimitMax: 1000,
        authRateLimitMax: 100,
        fileUploadSizeLimit: 5 * 1024 * 1024, // 5MB for testing
        sessionMaxAge: 60 * 60 * 1000, // 1 hour
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true
        }
    }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
