const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if users exist
    const usersExist = await User.countDocuments();
    if (usersExist > 0) {
      console.log('Users already exist, skipping seed.');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('passwordqwerty', salt);

    const users = [
      { username: 'receptionist', password, role: 'receptionist' },
      { username: 'doctor', password, role: 'doctor' }
    ];

    await User.insertMany(users);
    console.log('Successfully seeded receptionist and doctor accounts.');
    console.log('Credentials:');
    console.log('Receptionist -> Username: receptionist | Password: passwordqwerty');
    console.log('Doctor -> Username: doctor | Password: passwordqwerty');
    
    process.exit();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
