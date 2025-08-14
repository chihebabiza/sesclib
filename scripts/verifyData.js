const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Major = require('../models/major.model');
const Subject = require('../models/subject.model');
const Type = require('../models/type.model');
const User = require('../models/user.model');
const Year = require('../models/year.model');

const MONGO_URI = process.env.MONGO_URI;

async function verifyData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Count documents in each collection
        const typesCount = await Type.countDocuments();
        const yearsCount = await Year.countDocuments();
        const majorsCount = await Major.countDocuments();
        const usersCount = await User.countDocuments();
        const subjectsCount = await Subject.countDocuments();

        console.log('\n=== Data Verification ===');
        console.log(`Types: ${typesCount} documents`);
        console.log(`Years: ${yearsCount} documents`);
        console.log(`Majors: ${majorsCount} documents`);
        console.log(`Users: ${usersCount} documents`);
        console.log(`Subjects: ${subjectsCount} documents`);
        console.log('========================\n');

        // Show sample data from each collection
        console.log('=== Sample Data ===');

        console.log('Types:');
        const types = await Type.find().limit(3);
        types.forEach(type => console.log(`  - ${type.name}`));

        console.log('\nYears:');
        const years = await Year.find().limit(3);
        years.forEach(year => console.log(`  - ${year.name}`));

        console.log('\nMajors:');
        const majors = await Major.find().limit(3);
        majors.forEach(major => console.log(`  - ${major.name}`));

        console.log('\nUsers:');
        const users = await User.find().limit(2);
        users.forEach(user => console.log(`  - ${user.name} (${user.email}) - ${user.type}`));

        console.log('\nSubjects (first 5):');
        const subjects = await Subject.find().populate('major').populate('year').limit(5);
        subjects.forEach(subject => {
            console.log(`  - ${subject.name} (${subject.major?.name || 'N/A'}, ${subject.year?.name || 'N/A'})`);
        });

        console.log('\n=== Verification Complete ===');

    } catch (error) {
        console.error('Error verifying data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the verification
verifyData();
