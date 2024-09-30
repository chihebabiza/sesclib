exports.isUser = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.type === 'user') {
            return next();
        } else {
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.type === 'admin') {
            return next();
        } else {
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
};