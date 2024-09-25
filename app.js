const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const homeRoute = require('./routes/home.route');
const adminRoute = require('./routes/admin.route');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: 'sescLib_chiheb_abiza',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000 
    }
}));

// Use routes
app.use('/', homeRoute);
app.use('/', adminRoute);

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});