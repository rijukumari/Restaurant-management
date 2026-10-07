const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumiere_restaurant';
    
    // Connect to MongoDB with 5s timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✨ MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Check if initial seeding is needed
    try {
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Database empty. Auto-seeding initial data...');
        const seedScript = require('../seed');
      }
    } catch (seedErr) {
      // Seeding check failure ignored
    }
  } catch (error) {
    console.log('\n⚠️  MongoDB Connection Notice:');
    console.log(`   Could not connect to MongoDB at: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumiere_restaurant'}`);
    console.log(`   Reason: ${error.message}`);
    console.log('\n💡 TO RESOLVE THIS:');
    console.log('   1. Install or start local MongoDB Community Server on Windows (net start MongoDB)');
    console.log('   2. OR set a cloud MONGODB_URI in server/.env (e.g. MongoDB Atlas cluster)');
    console.log('   3. The server will continue running on http://localhost:5000 for API testing.\n');
  }
};

module.exports = connectDB;

