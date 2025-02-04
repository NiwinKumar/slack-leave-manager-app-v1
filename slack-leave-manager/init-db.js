// init-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/db/models/user');

async function initDb() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB Atlas');

        // Create initial admin user
        const adminUser = await User.create({
            userId: "CDFDSFSDFSVSFE3FEWF", // Replace with your Slack user ID
            email: "niwin.k@ORG.com",
            fullName: "Niwin K",
            role: "admin",
            department: "Backend"
        });

        console.log('Admin user created:', adminUser);

        // Create a test manager
        const managerUser1 = await User.create({
            userId: "U05HY79963ZSDFSDFSF", // Replace with manager's Slack user ID
            email: "sureshkumar.s@ORG.com",
            fullName: "Suresh Kumar",
            role: "manager",
            department: "Engineering"
        });

        const managerUser2 = await User.create({
            userId: "U05HY7J6NB1DSFDFSFDS", // Replace with manager's Slack user ID
            email: "sharon@ORG.com",
            fullName: "Sharon",
            role: "manager",
            department: "Recruitment"
        });

        console.log('Manager user created:', managerUser);

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
}

initDb();