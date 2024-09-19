const majorControllers = require('../controllers/major.controllers');

exports.getHome = async (req, res) => {
    try {
        const majors = await majorControllers.getAllMajors();

        res.render('user/index', { majors });
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    }
};