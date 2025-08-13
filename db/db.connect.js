const mongoose = require("mongoose");

const initializeDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
};

module.exports = { initializeDatabase };
