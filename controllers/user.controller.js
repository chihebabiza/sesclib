const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const { connectDB, disconnectDB } = require("../config/db");

exports.register = async (req, res) => {
    try {
        await connectDB();
        const { firstName, lastName, email, specialty, password } = req.body;

        console.log(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already exists');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            specialty,
            type: 'user'
        });

        console.log(newUser);

        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Error registering user');
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};

exports.login = async (req, res) => {
    try {
        await connectDB();

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        req.session.user = user;
        console.log(req.session)

        if (user.type === 'admin') {
            return res.redirect('/dashboard');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
        }
        res.redirect('/');
    });
};
