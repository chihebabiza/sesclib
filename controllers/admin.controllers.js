const majorControllers = require('../controllers/major.controllers');

exports.getMajorsDashboard = async (req, res) => {
    try {
        const majors = await majorControllers.getAllMajors();
        res.render('admin/getMajor', { majors });
    } catch (err) {
        console.error('Error fetching majors:', err);
        res.status(500).send('Server Error');
    }
};

exports.getUpdateMajor = async (req, res) => {
    try {
        const majorId = req.params.id;
        const major = await majorControllers.getMajorById(majorId);
        res.render('admin/updateMajor', { major });
    } catch (err) {
        console.error('Error fetching major:', err);
        res.status(500).send('Server Error');
    }
};

exports.getAddMajor = async (req, res) => {
    try {
        res.render('admin/addMajor');
    } catch (err) {
        console.error('Error fetching major:', err);
        res.status(500).send('Server Error');
    }
}