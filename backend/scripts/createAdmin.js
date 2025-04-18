const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Get the User model
const User = require('../src/models/User');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ phone: '0900000000' });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = new User({
      phone: '0900000000',
      password: hashedPassword,
      role: 'admin',
      name: 'Admin User',
      email: 'admin@test.com',
      verified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdminUser(); 