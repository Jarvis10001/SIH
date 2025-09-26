const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Clerk = require('../models/Clerk');
require('dotenv').config();

const testClerks = [
  {
    employeeId: 'CLK001',
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
    credentials: {
      username: 'ramesh.kumar',
      password: 'password123',
      role: 'clerk',
      permissions: ['student_verification', 'document_processing', 'admission_processing']
    }
  },
  {
    employeeId: 'CLK002',
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
    credentials: {
      username: 'meera.patel',
      password: 'password123',
      role: 'clerk',
      permissions: ['student_verification', 'data_entry', 'record_management']
    }
  },
  {
    employeeId: 'CLK003',
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
      joiningDate: new Date('2019-06-01'),
      experience: 4,
      reportingTo: 'ACC001',
      workShift: 'Morning'
    },
    credentials: {
      username: 'suresh.singh',
      password: 'password123',
      role: 'clerk',
      permissions: ['fee_management', 'financial_records', 'payment_processing']
    }
  },
  {
    employeeId: 'CLK004',
    personalInfo: {
      fullName: 'Kavita Sharma',
      email: 'kavita.sharma@college.edu',
      phone: '9876543236',
      dateOfBirth: new Date('1990-09-18'),
      gender: 'Female',
      address: {
        street: '126 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Vijay Sharma',
        relationship: 'Husband',
        phone: '9876543237'
      }
    },
    professionalInfo: {
      designation: 'Reception Clerk',
      department: 'Administration',
      joiningDate: new Date('2022-01-10'),
      experience: 1,
      reportingTo: 'ADM002',
      workShift: 'Morning'
    },
    credentials: {
      username: 'kavita.sharma',
      password: 'password123',
      role: 'clerk',
      permissions: ['visitor_management', 'inquiry_handling', 'appointment_scheduling']
    }
  },
  {
    employeeId: 'CLK005',
    personalInfo: {
      fullName: 'Anil Gupta',
      email: 'anil.gupta@college.edu',
      phone: '9876543238',
      dateOfBirth: new Date('1984-11-25'),
      gender: 'Male',
      address: {
        street: '127 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Rekha Gupta',
        relationship: 'Wife',
        phone: '9876543239'
      }
    },
    professionalInfo: {
      designation: 'Data Entry Clerk',
      department: 'Student Affairs',
      joiningDate: new Date('2020-09-01'),
      experience: 3,
      reportingTo: 'STU001',
      workShift: 'Morning'
    },
    credentials: {
      username: 'anil.gupta',
      password: 'password123',
      role: 'clerk',
      permissions: ['data_entry', 'student_records', 'database_management']
    }
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

    // Hash passwords and insert clerks
    for (let clerkData of testClerks) {
      const hashedPassword = await bcrypt.hash(clerkData.credentials.password, 12);
      clerkData.credentials.password = hashedPassword;
      
      const clerk = new Clerk(clerkData);
      await clerk.save();
      console.log(`Created clerk: ${clerkData.personalInfo.fullName} (${clerkData.employeeId})`);
    }

    console.log('Clerk seeding completed successfully!');
    console.log('\n=== TEST CLERK CREDENTIALS ===');
    testClerks.forEach(clerk => {
      console.log(`Employee ID: ${clerk.employeeId}`);
      console.log(`Email: ${clerk.personalInfo.email}`);
      console.log(`Username: ${clerk.credentials.username}`);
      console.log(`Password: password123`);
      console.log(`Name: ${clerk.personalInfo.fullName}`);
      console.log(`Department: ${clerk.professionalInfo.department}`);
      console.log(`Designation: ${clerk.professionalInfo.designation}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error seeding clerks:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedClerks();
}

module.exports = seedClerks;