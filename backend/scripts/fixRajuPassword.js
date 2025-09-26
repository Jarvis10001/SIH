const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
require('dotenv').config();

const fixRajuPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Raju
    const raju = await Student.findOne({ email: 'raju@gmail.com' }).select('+password');
    
    if (!raju) {
      console.log('❌ Raju not found!');
      return;
    }

    console.log('Found Raju:', raju.name.firstName, raju.name.lastName);
    console.log('Current password hash length:', raju.password ? raju.password.length : 'No password');

    // Hash the correct password
    const correctPassword = 'student123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update Raju's password
    await Student.findByIdAndUpdate(raju._id, { password: hashedPassword });
    
    console.log('✅ Password updated successfully!');
    
    // Verify the update
    const updatedRaju = await Student.findOne({ email: 'raju@gmail.com' }).select('+password');
    const isValidPassword = await bcrypt.compare(correctPassword, updatedRaju.password);
    
    console.log('Password verification after update:', isValidPassword);

  } catch (error) {
    console.error('Error fixing Raju password:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

fixRajuPassword();