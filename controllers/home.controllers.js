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
        if (!major) return res.status(404).send('Major not found');

        const years = await majorControllers.getYears();
        res.render('user/major', { major, years });
    } catch (error) {
        console.error('Error fetching major:', error);
        res.status(500).send('Server Error');
    }
};