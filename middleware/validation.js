const { body, validationResult } = require('express-validator');

// Common validation rules
const validationRules = {
    // User registration validation
    userRegistration: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),

        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        body('specialty')
            .isMongoId()
            .withMessage('Please select a valid specialty')
    ],

    // User login validation
    userLogin: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    // Major creation validation
    majorCreation: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Major name must be between 2 and 100 characters')
            .matches(/^[a-zA-Z0-9\s\-&.()]+$/)
            .withMessage('Major name contains invalid characters')
    ],

    // Subject creation validation
    subjectCreation: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Subject name must be between 2 and 100 characters'),

        body('major')
            .isMongoId()
            .withMessage('Please select a valid major'),

        body('semester')
            .isIn(['Semester 1', 'Semester 2'])
            .withMessage('Please select a valid semester'),

        body('year')
            .isMongoId()
            .withMessage('Please select a valid year'),

        body('types')
            .isArray({ min: 1 })
            .withMessage('Please select at least one type'),

        body('types.*')
            .isMongoId()
            .withMessage('Invalid type selected')
    ],

    // Document upload validation
    documentUpload: [
        body('title')
            .trim()
            .isLength({ min: 2, max: 200 })
            .withMessage('Document title must be between 2 and 200 characters'),

        body('subject')
            .isMongoId()
            .withMessage('Please select a valid subject'),

        body('type')
            .isMongoId()
            .withMessage('Please select a valid type')
    ]
};

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error', errorMessages.join('. '));

        // Redirect back to the form with errors
        return res.redirect('back');
    }

    next();
};

// Sanitize input middleware
const sanitizeInput = (req, res, next) => {
    // Remove any script tags or dangerous HTML
    const sanitizeValue = (value) => {
        if (typeof value === 'string') {
            return value
                .replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[\/\!]*?[^<>]*?>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
        }
        return value;
    };

    // Sanitize body
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeValue(req.body[key]);
            } else if (Array.isArray(req.body[key])) {
                req.body[key] = req.body[key].map(item =>
                    typeof item === 'string' ? sanitizeValue(item) : item
                );
            }
        }
    }

    // Sanitize query parameters
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeValue(req.query[key]);
            }
        }
    }

    next();
};

module.exports = {
    validationRules,
    handleValidationErrors,
    sanitizeInput
};
