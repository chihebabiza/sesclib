const majorControllers = require('../controllers/major.controllers');

exports.getHome = async (req, res) => {
    try {
        const majors = await majorControllers.getAllMajors();

        res.render('user/index', { majors });
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    }
};

exports.getMajor = async (req, res) => {
    try {
        const majorId = req.params.id;
        const major = await majorControllers.getMajorById(majorId);

        res.render('user/major', { major });
    } catch (err) {
        console.error('Error fetching major:', err);
        res.status(500).send('Internal Server Error');
    }
};