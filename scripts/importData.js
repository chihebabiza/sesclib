const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Major = require('../models/major.model');
const Subject = require('../models/subject.model');
const Type = require('../models/type.model');
const User = require('../models/user.model');
const Year = require('../models/year.model');

const MONGO_URI = process.env.MONGO_URI;

// Function to transform MongoDB JSON export format to regular JSON
function transformMongoData(data) {
    return data.map(item => {
        const transformed = {};
        for (const [key, value] of Object.entries(item)) {
            if (key === '_id' && value.$oid) {
                transformed._id = new mongoose.Types.ObjectId(value.$oid);
            } else if (typeof value === 'object' && value !== null && value.$oid) {
                transformed[key] = new mongoose.Types.ObjectId(value.$oid);
            } else if (Array.isArray(value)) {
                transformed[key] = value.map(v => {
                    if (typeof v === 'object' && v !== null && v.$oid) {
                        return new mongoose.Types.ObjectId(v.$oid);
                    }
                    return v;
                });
            } else {
                transformed[key] = value;
            }
        }
        return transformed;
    });
}

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await Major.deleteMany({});
        await Subject.deleteMany({});
        await Type.deleteMany({});
        await User.deleteMany({});
        await Year.deleteMany({});

        // Import types first (they are referenced by other collections)
        console.log('Importing types...');
        const typesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../collections/sesclib.types.json'), 'utf8'));
        const transformedTypes = transformMongoData(typesData);
        await Type.insertMany(transformedTypes);
        console.log(`Imported ${transformedTypes.length} types`);

        // Import years
        console.log('Importing years...');
        const yearsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../collections/sesclib.years.json'), 'utf8'));
        const transformedYears = transformMongoData(yearsData);
        await Year.insertMany(transformedYears);
        console.log(`Imported ${transformedYears.length} years`);

        // Import majors
        console.log('Importing majors...');
        const majorsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../collections/sesclib.majors.json'), 'utf8'));
        const transformedMajors = transformMongoData(majorsData);
        await Major.insertMany(transformedMajors);
        console.log(`Imported ${transformedMajors.length} majors`);

        // Import users
        console.log('Importing users...');
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../collections/sesclib.users.json'), 'utf8'));
        const transformedUsers = transformMongoData(usersData);
        await User.insertMany(transformedUsers);
        console.log(`Imported ${transformedUsers.length} users`);

        // Import subjects (they reference majors, years, and types)
        console.log('Importing subjects...');
        const subjectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../collections/sesclib.subjects.json'), 'utf8'));
        const transformedSubjects = transformMongoData(subjectsData);
        await Subject.insertMany(transformedSubjects);
        console.log(`Imported ${transformedSubjects.length} subjects`);

        console.log('Data import completed successfully!');

    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the import
importData();
