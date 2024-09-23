const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const homeRoute = require('./routes/home.route');
const adminRoute = require('./routes/admin.route');
const Year = require('./models/year.model');
const { connectDB } = require('./config/db');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', homeRoute);
app.use('/', adminRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});