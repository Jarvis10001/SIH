const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Clerk = require('../models/Clerk');
require('dotenv').config();

const testClerks = [
  {
    employeeId: 'CLK001',
    password: 'password123',
    personalInfo: {
      fullName: 'Ramesh Kumar',
      email: 'ramesh.kumar@college.edu',
      phone: '9876543230',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'Male',
      address: {
        street: '123 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Sunita Kumar',
        relationship: 'Wife',
        phone: '9876543231'
      }
    },
    professionalInfo: {
      designation: 'Senior Clerk',
      department: 'Admissions',
      joiningDate: new Date('2020-04-01'),
      experience: 3,
      reportingTo: 'ADM001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['student_verification', 'document_processing', 'admission_processing'],
      level: 'read'
    },
    isActive: true
  },
  {
    employeeId: 'CLK002',
    password: 'password123',
    personalInfo: {
      fullName: 'Meera Patel',
      email: 'meera.patel@college.edu',
      phone: '9876543232',
      dateOfBirth: new Date('1988-07-22'),
      gender: 'Female',
      address: {
        street: '124 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Rajesh Patel',
        relationship: 'Husband',
        phone: '9876543233'
      }
    },
    professionalInfo: {
      designation: 'Office Clerk',
      department: 'Administration',
      joiningDate: new Date('2021-08-15'),
      experience: 2,
      reportingTo: 'ADM002',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['student_verification', 'data_entry', 'record_management'],
      level: 'read'
    },
    isActive: true
  },
  {
    employeeId: 'CLK003',
    password: 'password123',
    personalInfo: {
      fullName: 'Suresh Singh',
      email: 'suresh.singh@college.edu',
      phone: '9876543234',
      dateOfBirth: new Date('1982-12-10'),
      gender: 'Male',
      address: {
        street: '125 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Priya Singh',
        relationship: 'Wife',
        phone: '9876543235'
      }
    },
    professionalInfo: {
      designation: 'Accounts Clerk',
      department: 'Accounts',
      joiningDate: new Date('2019-03-01'),
      experience: 4,
      reportingTo: 'ACC001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['fee_management', 'financial_records', 'account_verification'],
      level: 'write'
    },
    isActive: true
  },
  {
    employeeId: 'CLK004',
    password: 'password123',
    personalInfo: {
      fullName: 'Kavita Sharma',
      email: 'kavita.sharma@college.edu',
      phone: '9876543236',
      dateOfBirth: new Date('1990-06-18'),
      gender: 'Female',
      address: {
        street: '126 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Vikash Sharma',
        relationship: 'Husband',
        phone: '9876543237'
      }
    },
    professionalInfo: {
      designation: 'Office Clerk',
      department: 'Examination',
      joiningDate: new Date('2022-01-10'),
      experience: 1,
      reportingTo: 'EXM001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['exam_management', 'result_processing', 'student_records'],
      level: 'read'
    },
    isActive: true
  },
  {
    employeeId: 'CLK005',
    password: 'password123',
    personalInfo: {
      fullName: 'Anil Gupta',
      email: 'anil.gupta@college.edu',
      phone: '9876543238',
      dateOfBirth: new Date('1987-09-25'),
      gender: 'Male',
      address: {
        street: '127 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Ritu Gupta',
        relationship: 'Wife',
        phone: '9876543239'
      }
    },
    professionalInfo: {
      designation: 'Data Entry Clerk',
      department: 'IT Support',
      joiningDate: new Date('2020-11-05'),
      experience: 3,
      reportingTo: 'IT001',
      workShift: 'Evening'
    },
    permissions: {
      modules: ['data_entry', 'student_records', 'database_management'],
      level: 'read'
    },
    isActive: true
  }
];

const seedClerks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-erp');
    console.log('Connected to MongoDB');

    // Clear existing clerks
    await Clerk.deleteMany({});
    console.log('Cleared existing clerks');

    // Create clerks
    // Hash passwords manually for all clerks before bulk insert
    const clerksWithHashedPasswords = [];
    
    for (let clerkData of testClerks) {
      // Hash password
      const hashedPassword = await bcrypt.hash(clerkData.password, 12);
      clerkData.password = hashedPassword;
      clerksWithHashedPasswords.push(clerkData);
    }

    // Use insertMany to bypass pre-save middleware and avoid double hashing
    const createdClerks = await Clerk.insertMany(clerksWithHashedPasswords);
    console.log(`Created ${createdClerks.length} clerks successfully!`);

    console.log('Clerk seeding completed successfully!');
    console.log('\n=== TEST CLERK CREDENTIALS ===');
    
    for (const clerk of testClerks) {
      console.log(`Employee ID: ${clerk.employeeId}`);
      console.log(`Email: ${clerk.personalInfo.email}`);
      console.log(`Password: password123`); // Original password before hashing
      console.log(`Name: ${clerk.personalInfo.fullName}`);
      console.log(`Department: ${clerk.professionalInfo.department}`);
      console.log(`Designation: ${clerk.professionalInfo.designation}`);
      console.log('---');
    }

  } catch (error) {
    console.error('Error seeding clerks:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedClerks();