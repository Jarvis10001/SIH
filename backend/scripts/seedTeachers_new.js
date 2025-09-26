const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
require('dotenv').config();

const newTeachersData = [
  // Computer Science Department
  {
    teacherId: 'TEACH001',
    password: 'teacher123',
    personalInfo: {
      firstName: 'Dr. Arun',
      lastName: 'Kumar',
      email: 'arun.kumar@teacher.college.edu',
      phone: '9876543220',
      alternatePhone: '9876543221',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'Male',
      bloodGroup: 'B+',
      aadharNumber: '123456789013',
      panNumber: 'ABCDE1235F'
    },
    address: {
      currentAddress: {
        street: '123 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '123 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      salary: {
        basic: 85000,
        allowances: 25000,
        total: 110000
      },
      employeeId: 'EMP001',
      designation: 'Professor',
      department: 'Computer Science Engineering',
      specialization: 'Data Structures and Algorithms',
      qualification: 'PhD',
      experience: 15,
      joiningDate: new Date('2008-07-01'),
      employmentType: 'Permanent'
    },
    academicInfo: {
      subjects: [{
        name: 'Data Structures',
        code: 'CS201',
        semester: 3,
        branch: 'Computer Science Engineering',
        credits: 4
      }],
      researchAreas: ['Computer Science', 'Data Structures', 'Algorithm Design'],
      publications: [],
      projects: []
    },
    systemInfo: {
      status: 'Active',
      loginAttempts: 0,
      accountLocked: false
    },
    documents: {
      certificates: ''
    }
  },
  {
    teacherId: 'TEACH002',
    password: 'teacher123',
    personalInfo: {
      firstName: 'Prof. Sunita',
      lastName: 'Rao',
      email: 'sunita.rao@teacher.college.edu',
      phone: '9876543222',
      alternatePhone: '9876543223',
      dateOfBirth: new Date('1982-03-20'),
      gender: 'Female',
      bloodGroup: 'A+',
      aadharNumber: '123456789014',
      panNumber: 'ABCDE1236F'
    },
    address: {
      currentAddress: {
        street: '124 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '124 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      salary: {
        basic: 80000,
        allowances: 22000,
        total: 102000
      },
      employeeId: 'EMP002',
      designation: 'Associate Professor',
      department: 'Computer Science Engineering',
      specialization: 'Database Management Systems',
      qualification: 'PhD',
      experience: 12,
      joiningDate: new Date('2011-07-01'),
      employmentType: 'Permanent'
    },
    academicInfo: {
      subjects: [{
        name: 'Database Management',
        code: 'CS301',
        semester: 5,
        branch: 'Computer Science Engineering',
        credits: 4
      }],
      researchAreas: ['Database Systems', 'Data Warehousing'],
      publications: [],
      projects: []
    },
    systemInfo: {
      status: 'Active',
      loginAttempts: 0,
      accountLocked: false
    },
    documents: {
      certificates: ''
    }
  },
  {
    teacherId: 'TEACH003',
    password: 'teacher123',
    personalInfo: {
      firstName: 'Dr. Manoj',
      lastName: 'Gupta',
      email: 'manoj.gupta@teacher.college.edu',
      phone: '9876543224',
      alternatePhone: '9876543225',
      dateOfBirth: new Date('1978-11-12'),
      gender: 'Male',
      bloodGroup: 'O+',
      aadharNumber: '123456789015',
      panNumber: 'ABCDE1237F'
    },
    address: {
      currentAddress: {
        street: '125 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '125 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      salary: {
        basic: 82000,
        allowances: 23000,
        total: 105000
      },
      employeeId: 'EMP003',
      designation: 'Professor',
      department: 'Computer Science Engineering',
      specialization: 'Web Development',
      qualification: 'PhD',
      experience: 16,
      joiningDate: new Date('2007-07-01'),
      employmentType: 'Permanent'
    },
    academicInfo: {
      subjects: [{
        name: 'Web Development',
        code: 'CS401',
        semester: 7,
        branch: 'Computer Science Engineering',
        credits: 3
      }],
      researchAreas: ['Web Technologies', 'Frontend Development'],
      publications: [],
      projects: []
    },
    systemInfo: {
      status: 'Active',
      loginAttempts: 0,
      accountLocked: false
    },
    documents: {
      certificates: ''
    }
  },
  {
    teacherId: 'TEACH004',
    password: 'teacher123',
    personalInfo: {
      firstName: 'Prof. Rekha',
      lastName: 'Sharma',
      email: 'rekha.sharma@teacher.college.edu',
      phone: '9876543226',
      alternatePhone: '9876543227',
      dateOfBirth: new Date('1981-07-30'),
      gender: 'Female',
      bloodGroup: 'AB+',
      aadharNumber: '123456789016',
      panNumber: 'ABCDE1238F'
    },
    address: {
      currentAddress: {
        street: '126 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '126 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      salary: {
        basic: 78000,
        allowances: 21000,
        total: 99000
      },
      employeeId: 'EMP004',
      designation: 'Associate Professor',
      department: 'Computer Science Engineering',
      specialization: 'Operating Systems',
      qualification: 'PhD',
      experience: 11,
      joiningDate: new Date('2012-07-01'),
      employmentType: 'Permanent'
    },
    academicInfo: {
      subjects: [{
        name: 'Operating Systems',
        code: 'CS302',
        semester: 5,
        branch: 'Computer Science Engineering',
        credits: 4
      }],
      researchAreas: ['System Software', 'Linux Administration'],
      publications: [],
      projects: []
    },
    systemInfo: {
      status: 'Active',
      loginAttempts: 0,
      accountLocked: false
    },
    documents: {
      certificates: ''
    }
  },
  {
    teacherId: 'TEACH005',
    password: 'teacher123',
    personalInfo: {
      firstName: 'Dr. Vivek',
      lastName: 'Pandey',
      email: 'vivek.pandey@teacher.college.edu',
      phone: '9876543228',
      alternatePhone: '9876543229',
      dateOfBirth: new Date('1979-09-25'),
      gender: 'Male',
      bloodGroup: 'B-',
      aadharNumber: '123456789017',
      panNumber: 'ABCDE1239F'
    },
    address: {
      currentAddress: {
        street: '127 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '127 Faculty Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      salary: {
        basic: 88000,
        allowances: 27000,
        total: 115000
      },
      employeeId: 'EMP005',
      designation: 'Professor',
      department: 'Computer Science Engineering',
      specialization: 'Machine Learning',
      qualification: 'PhD',
      experience: 17,
      joiningDate: new Date('2006-07-01'),
      employmentType: 'Permanent'
    },
    academicInfo: {
      subjects: [{
        name: 'Machine Learning',
        code: 'CS501',
        semester: 8,
        branch: 'Computer Science Engineering',
        credits: 4
      }],
      researchAreas: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
      publications: [],
      projects: []
    },
    systemInfo: {
      status: 'Active',
      loginAttempts: 0,
      accountLocked: false
    },
    documents: {
      certificates: ''
    }
  }
];

const seedTeachers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing teachers
    await Teacher.deleteMany({});
    console.log('Cleared existing teachers');

    // Hash passwords manually for all teachers before bulk insert
    const teachersWithHashedPasswords = [];
    
    for (let teacherData of newTeachersData) {
      // Hash password
      const hashedPassword = await bcrypt.hash(teacherData.password, 12);
      teacherData.password = hashedPassword;
      teachersWithHashedPasswords.push(teacherData);
    }

    // Use insertMany to bypass pre-save middleware and avoid double hashing
    const createdTeachers = await Teacher.insertMany(teachersWithHashedPasswords);
    console.log(`Created ${createdTeachers.length} teachers successfully!`);

    console.log('Teacher seeding completed successfully!');
    console.log('\n=== NEW TEACHER CREDENTIALS ===');
    
    for (const teacher of newTeachersData) {
      console.log(`Teacher ID: ${teacher.teacherId}`);
      console.log(`Email: ${teacher.personalInfo.email}`);
      console.log(`Password: teacher123`); // Original password before hashing
      console.log(`Name: ${teacher.personalInfo.firstName} ${teacher.personalInfo.lastName}`);
      console.log(`Department: ${teacher.professionalInfo.department}`);
      console.log(`Designation: ${teacher.professionalInfo.designation}`);
      console.log('---');
    }

  } catch (error) {
    console.error('Error seeding teachers:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedTeachers();