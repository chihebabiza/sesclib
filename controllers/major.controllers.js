const Major = require('../models/major.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getAllMajors = async () => {
    try {
        await connectDB();
        return await Major.find({});
    } catch (error) {
        console.error('Error fetching majors:', error);
        throw error;
    } finally {
        await disconnectDB();
    }
};