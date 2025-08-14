// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'Please log in to access this page');
    res.redirect('/login');
};

// Admin authorization middleware
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.type === 'admin') {
        return next();
    }
    req.flash('error', 'Access denied. Admin privileges required');
    res.redirect('/');
};

// User authorization middleware (for regular users)
const isUser = (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.type === 'user' || req.session.user.type === 'admin')) {
        return next();
    }
    req.flash('error', 'Access denied. Please log in');
    res.redirect('/login');
};

// Prevent access to auth pages when already logged in
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.type === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        return res.redirect('/');
    }
    next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Set security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    next();
};

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
    // Generate CSRF token if it doesn't exist
    if (!req.session.csrfToken) {
        req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
    }

    // Make token available in templates
    res.locals.csrfToken = req.session.csrfToken;

    // Check CSRF token for POST, PUT, DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const token = req.body.csrfToken || req.headers['x-csrf-token'];

        if (!token || token !== req.session.csrfToken) {
            req.flash('error', 'Security token mismatch. Please try again');
            return res.redirect('back');
        }
    }

    next();
};

// Input length limiter
const limitInputLength = (maxLength = 1000) => {
    return (req, res, next) => {
        const checkLength = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].length > maxLength) {
                    req.flash('error', `Input too long. Maximum ${maxLength} characters allowed`);
                    return res.redirect('back');
                }
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    checkLength(obj[key]);
                }
            }
        };

        if (req.body) checkLength(req.body);
        if (req.query) checkLength(req.query);

        next();
    };
};

// File upload security
const fileUploadSecurity = (req, res, next) => {
    if (req.file) {
        const allowedMimeTypes = {
            'application/pdf': '.pdf',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif'
        };

        // Check file type
        if (!allowedMimeTypes[req.file.mimetype]) {
            req.flash('error', 'Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, and GIF files are allowed');
            return res.redirect('back');
        }

        // Check file size (10MB limit)
        if (req.file.size > 10 * 1024 * 1024) {
            req.flash('error', 'File too large. Maximum size is 10MB');
            return res.redirect('back');
        }
    }

    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isUser,
    redirectIfAuthenticated,
    securityHeaders,
    csrfProtection,
    limitInputLength,
    fileUploadSecurity
};
