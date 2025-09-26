const mongoose = require('mongoose');
const Clerk = require('../models/Clerk');
require('dotenv').config();

const createTestClerk = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test clerk already exists
    const existingClerk = await Clerk.findOne({ employeeId: 'test123' });
    if (existingClerk) {
      console.log('Test clerk already exists');
      console.log('Employee ID: test123');
      console.log('Password: test123');
      return;
    }

    // Create test clerk (password will be hashed by the pre-save middleware)
    const testClerk = new Clerk({
      employeeId: 'test123',
      password: 'test123', // Raw password - will be hashed automatically
      personalInfo: {
        fullName: 'Test Clerk',
        email: 'test@clerk.com',
        phone: '1234567890',
        gender: 'Male',
        address: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          country: 'India'
        }
      },
      professionalInfo: {
        department: 'Administration',
        designation: 'Admission Clerk',
        joiningDate: new Date('2024-01-01'),
        workLocation: 'Main Campus',
        reportingManager: 'Admin',
        employmentType: 'full-time'
      },
      systemAccess: {
        modules: ['admission_processing', 'student_management'],
        permissions: ['read', 'write', 'verify']
      },
      isActive: true
    });

    await testClerk.save();
    console.log('✅ Test clerk created successfully!');
    console.log('Credentials:');
    console.log('Employee ID: test123');
    console.log('Password: test123');

  } catch (error) {
    console.error('❌ Error creating test clerk:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
createTestClerk();