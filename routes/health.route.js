const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        // Basic system info
        const healthCheck = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: dbStatus,
                name: mongoose.connection.name || 'unknown'
            },
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            },
            version: process.env.npm_package_version || '1.0.0'
        };

        // If database is disconnected, set status to ERROR
        if (dbStatus === 'disconnected') {
            healthCheck.status = 'ERROR';
            return res.status(503).json(healthCheck);
        }

        res.status(200).json(healthCheck);
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : error.message
        });
    }
});

// Readiness probe (for container orchestration)
router.get('/ready', async (req, res) => {
    try {
        // Check if database is ready
        const dbReady = mongoose.connection.readyState === 1;

        if (dbReady) {
            res.status(200).json({ status: 'ready' });
        } else {
            res.status(503).json({ status: 'not ready', reason: 'database not connected' });
        }
    } catch (error) {
        res.status(503).json({
            status: 'not ready',
            reason: process.env.NODE_ENV === 'production' ? 'service error' : error.message
        });
    }
});

// Liveness probe (for container orchestration)
router.get('/live', (req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;
