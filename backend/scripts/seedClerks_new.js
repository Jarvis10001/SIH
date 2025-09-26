const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Clerk = require('../models/Clerk');
require('dotenv').config();

const newClerksData = [
  {
    employeeId: 'CLERK001',
    password: 'clerk123',
    personalInfo: {
      fullName: 'Sunil Verma',
      email: 'sunil.verma@clerk.college.edu',
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
        name: 'Sunita Verma',
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
    employeeId: 'CLERK002',
    password: 'clerk123',
    personalInfo: {
      fullName: 'Meena Kumari',
      email: 'meena.kumari@clerk.college.edu',
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
        name: 'Raj Kumari',
        relationship: 'Husband',
        phone: '9876543233'
      }
    },
    professionalInfo: {
      designation: 'Office Clerk',
      department: 'Accounts',
      joiningDate: new Date('2019-08-15'),
      experience: 4,
      reportingTo: 'ACC001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['fee_collection', 'financial_records'],
      level: 'write'
    },
    isActive: true
  },
  {
    employeeId: 'CLERK003',
    password: 'clerk123',
    personalInfo: {
      fullName: 'Rajesh Tiwari',
      email: 'rajesh.tiwari@clerk.college.edu',
      phone: '9876543234',
      dateOfBirth: new Date('1986-11-10'),
      gender: 'Male',
      address: {
        street: '125 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Priya Tiwari',
        relationship: 'Wife',
        phone: '9876543235'
      }
    },
    professionalInfo: {
      designation: 'Administrative Assistant',
      department: 'Student Affairs',
      joiningDate: new Date('2018-06-01'),
      experience: 5,
      reportingTo: 'ACD001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['grade_management', 'transcripts'],
      level: 'write'
    },
    isActive: true
  },
  {
    employeeId: 'CLERK004',
    password: 'clerk123',
    personalInfo: {
      fullName: 'Shanti Devi',
      email: 'shanti.devi@clerk.college.edu',
      phone: '9876543236',
      dateOfBirth: new Date('1984-02-28'),
      gender: 'Female',
      address: {
        street: '126 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Ram Devi',
        relationship: 'Husband',
        phone: '9876543237'
      }
    },
    professionalInfo: {
      designation: 'Office Clerk',
      department: 'Administration',
      joiningDate: new Date('2021-01-15'),
      experience: 2,
      reportingTo: 'GEN001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['student_records', 'id_cards'],
      level: 'read'
    },
    isActive: true
  },
  {
    employeeId: 'CLERK005',
    password: 'clerk123',
    personalInfo: {
      fullName: 'Prakash Sharma',
      email: 'prakash.sharma@clerk.college.edu',
      phone: '9876543238',
      dateOfBirth: new Date('1987-05-18'),
      gender: 'Male',
      address: {
        street: '127 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Kavita Sharma',
        relationship: 'Wife',
        phone: '9876543239'
      }
    },
    professionalInfo: {
      designation: 'Data Entry Clerk',
      department: 'Examination',
      joiningDate: new Date('2020-09-01'),
      experience: 3,
      reportingTo: 'EXM001',
      workShift: 'Morning'
    },
    permissions: {
      modules: ['exam_scheduling', 'results'],
      level: 'write'
    },
    isActive: true
  }
];

const seedClerks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing clerks
    await Clerk.deleteMany({});
    console.log('Cleared existing clerks');

    // Hash passwords manually for all clerks before bulk insert
    const clerksWithHashedPasswords = [];
    
    for (let clerkData of newClerksData) {
      // Hash password
      const hashedPassword = await bcrypt.hash(clerkData.password, 12);
      clerkData.password = hashedPassword;
      clerksWithHashedPasswords.push(clerkData);
    }

    // Use insertMany to bypass pre-save middleware and avoid double hashing
    const createdClerks = await Clerk.insertMany(clerksWithHashedPasswords);
    console.log(`Created ${createdClerks.length} clerks successfully!`);

    console.log('Clerk seeding completed successfully!');
    console.log('\n=== NEW CLERK CREDENTIALS ===');
    
    for (const clerk of newClerksData) {
      console.log(`Clerk ID: ${clerk.employeeId}`);
      console.log(`Email: ${clerk.personalInfo.email}`);
      console.log(`Password: clerk123`); // Original password before hashing
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