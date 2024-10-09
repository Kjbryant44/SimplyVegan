const mongoose = require('mongoose');

const connectTestDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.TEST_MONGO_URI, {});
        console.log(`Test MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectTestDB;