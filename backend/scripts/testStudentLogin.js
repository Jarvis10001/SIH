const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

const testStudentLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test different ways to find Raju
    console.log('=== TESTING STUDENT LOOKUP METHODS ===');
    
    // Method 1: By email
    const rajuByEmail = await Student.findOne({ email: 'raju@gmail.com' }).select('+password');
    console.log('\n1. By email (raju@gmail.com):');
    if (rajuByEmail) {
      console.log(`   Found: ${rajuByEmail.studentId} - ${rajuByEmail.name.firstName} ${rajuByEmail.name.lastName}`);
    } else {
      console.log('   Not found');
    }

    // Method 2: By studentId
    const rajuByStudentId = await Student.findOne({ studentId: 'STU021' });
    console.log('\n2. By studentId (STU021):');
    if (rajuByStudentId) {
      console.log(`   Found: ${rajuByStudentId.studentId} - ${rajuByStudentId.name.firstName} ${rajuByStudentId.name.lastName}`);
      console.log(`   Email: ${rajuByStudentId.email}`);
    } else {
      console.log('   Not found');
    }

    // Method 3: By roll number
    const rajuByRollNumber = await Student.findOne({ 'academics.rollNumber': 'CS21021' });
    console.log('\n3. By roll number (CS21021):');
    if (rajuByRollNumber) {
      console.log(`   Found: ${rajuByRollNumber.studentId} - ${rajuByRollNumber.name.firstName} ${rajuByRollNumber.name.lastName}`);
      console.log(`   Email: ${rajuByRollNumber.email}`);
    } else {
      console.log('   Not found');
    }

    // Check password verification
    if (rajuByEmail) {
      console.log('\n=== PASSWORD VERIFICATION ===');
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare('student123', rajuByEmail.password);
      console.log(`Password 'student123' is valid: ${isValidPassword}`);
    }

    // List all students to see what's in the database
    console.log('\n=== ALL STUDENTS IN DATABASE ===');
    const allStudents = await Student.find({}).select('studentId name.firstName name.lastName email academics.rollNumber');
    allStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.studentId} - ${student.name.firstName} ${student.name.lastName} (${student.email}) - Roll: ${student.academics.rollNumber}`);
    });

  } catch (error) {
    console.error('Error testing student login:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

testStudentLogin();