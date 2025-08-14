const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Mongoose connection options for production
const connectionOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, connectionOptions);
        logger.info('MongoDB connected successfully', {
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
        });
    } catch (error) {
        logger.error('Error connecting to MongoDB', error, {
            mongoUri: MONGO_URI ? 'configured' : 'missing'
        });
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected successfully');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB', error);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error', error);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to application termination');
        process.exit(0);
    } catch (error) {
        logger.error('Error during graceful shutdown', error);
        process.exit(1);
    }
});

module.exports = { connectDB, disconnectDB };
