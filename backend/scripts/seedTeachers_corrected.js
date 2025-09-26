const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
require('dotenv').config();

const testTeachers = [
  {
    teacherId: 'T001',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Rajesh',
      lastName: 'Verma',
      email: 'rajesh.verma@college.edu',
      phone: '9876543220',
      alternatePhone: '9876543221',
      dateOfBirth: new Date('1980-03-15'),
      gender: 'Male',
      bloodGroup: 'B+',
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F'
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
      employeeId: 'EMP001',
      designation: 'Professor',
      department: 'Computer Science Engineering',
      specialization: 'Machine Learning and Data Science',
      qualification: 'PhD',
      experience: 15,
      joiningDate: new Date('2008-07-01'),
      employmentType: 'Permanent',
      salary: {
        basic: 80000,
        allowances: 20000,
        total: 100000
      }
    },
    academicInfo: {
      subjects: [
        { name: 'Data Structures', code: 'CS201', semester: 3, branch: 'Computer Science Engineering', credits: 4 },
        { name: 'Machine Learning', code: 'CS401', semester: 7, branch: 'Computer Science Engineering', credits: 3 }
      ],
      researchAreas: ['Machine Learning', 'Data Science', 'AI']
    },
    systemInfo: {
      status: 'Active'
    }
  },
  {
    teacherId: 'T002',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@college.edu',
      phone: '9876543222',
      alternatePhone: '9876543223',
      dateOfBirth: new Date('1985-08-20'),
      gender: 'Female',
      bloodGroup: 'A+',
      aadharNumber: '123456789013',
      panNumber: 'ABCDE1234G'
    },
    address: {
      currentAddress: {
        street: '456 Faculty Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        country: 'India'
      },
      permanentAddress: {
        street: '456 Faculty Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      employeeId: 'EMP002',
      designation: 'Associate Professor',
      department: 'Information Technology',
      specialization: 'Database Management Systems',
      qualification: 'PhD',
      experience: 12,
      joiningDate: new Date('2011-08-01'),
      employmentType: 'Permanent',
      salary: {
        basic: 70000,
        allowances: 18000,
        total: 88000
      }
    },
    academicInfo: {
      subjects: [
        { name: 'Database Management', code: 'IT301', semester: 5, branch: 'Information Technology', credits: 4 },
        { name: 'Data Warehousing', code: 'IT402', semester: 8, branch: 'Information Technology', credits: 3 }
      ],
      researchAreas: ['Database Systems', 'Big Data', 'Data Mining']
    },
    systemInfo: {
      status: 'Active'
    }
  },
  {
    teacherId: 'T003',
    password: 'password123',
    personalInfo: {
      firstName: 'Prof. Amit',
      lastName: 'Singh',
      email: 'amit.singh@college.edu',
      phone: '9876543224',
      alternatePhone: '9876543225',
      dateOfBirth: new Date('1978-12-10'),
      gender: 'Male',
      bloodGroup: 'O+',
      aadharNumber: '123456789014',
      panNumber: 'ABCDE1234H'
    },
    address: {
      currentAddress: {
        street: '789 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400003',
        country: 'India'
      },
      permanentAddress: {
        street: '789 Staff Quarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400003',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      employeeId: 'EMP003',
      designation: 'Assistant Professor',
      department: 'Mechanical Engineering',
      specialization: 'Thermal Engineering',
      qualification: 'M.Tech',
      experience: 8,
      joiningDate: new Date('2015-07-01'),
      employmentType: 'Permanent',
      salary: {
        basic: 55000,
        allowances: 15000,
        total: 70000
      }
    },
    academicInfo: {
      subjects: [
        { name: 'Thermodynamics', code: 'ME201', semester: 3, branch: 'Mechanical Engineering', credits: 4 },
        { name: 'Heat Transfer', code: 'ME301', semester: 5, branch: 'Mechanical Engineering', credits: 3 }
      ],
      researchAreas: ['Thermal Systems', 'Heat Transfer', 'Energy Systems']
    },
    systemInfo: {
      status: 'Active'
    }
  },
  {
    teacherId: 'T004',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Sneha',
      lastName: 'Reddy',
      email: 'sneha.reddy@college.edu',
      phone: '9876543226',
      alternatePhone: '9876543227',
      dateOfBirth: new Date('1982-05-25'),
      gender: 'Female',
      bloodGroup: 'AB+',
      aadharNumber: '123456789015',
      panNumber: 'ABCDE1234I'
    },
    address: {
      currentAddress: {
        street: '321 Faculty Residences',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400004',
        country: 'India'
      },
      permanentAddress: {
        street: '321 Faculty Residences',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400004',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      employeeId: 'EMP004',
      designation: 'Professor',
      department: 'Electronics and Communication Engineering',
      specialization: 'Digital Signal Processing',
      qualification: 'PhD',
      experience: 18,
      joiningDate: new Date('2005-08-01'),
      employmentType: 'Permanent',
      salary: {
        basic: 85000,
        allowances: 22000,
        total: 107000
      }
    },
    academicInfo: {
      subjects: [
        { name: 'Digital Signal Processing', code: 'EC401', semester: 7, branch: 'Electronics and Communication Engineering', credits: 4 },
        { name: 'Communication Systems', code: 'EC301', semester: 5, branch: 'Electronics and Communication Engineering', credits: 3 }
      ],
      researchAreas: ['Signal Processing', 'Communications', 'Image Processing']
    },
    systemInfo: {
      status: 'Active'
    }
  },
  {
    teacherId: 'T005',
    password: 'password123',
    personalInfo: {
      firstName: 'Prof. Arjun',
      lastName: 'Gupta',
      email: 'arjun.gupta@college.edu',
      phone: '9876543228',
      alternatePhone: '9876543229',
      dateOfBirth: new Date('1988-09-12'),
      gender: 'Male',
      bloodGroup: 'O-',
      aadharNumber: '123456789016',
      panNumber: 'ABCDE1234J'
    },
    address: {
      currentAddress: {
        street: '654 Teacher Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400005',
        country: 'India'
      },
      permanentAddress: {
        street: '654 Teacher Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400005',
        country: 'India'
      },
      isSameAddress: true
    },
    professionalInfo: {
      employeeId: 'EMP005',
      designation: 'Assistant Professor',
      department: 'Computer Science Engineering',
      specialization: 'Software Engineering',
      qualification: 'M.Tech',
      experience: 6,
      joiningDate: new Date('2017-07-01'),
      employmentType: 'Permanent',
      salary: {
        basic: 50000,
        allowances: 12000,
        total: 62000
      }
    },
    academicInfo: {
      subjects: [
        { name: 'Software Engineering', code: 'CS301', semester: 5, branch: 'Computer Science Engineering', credits: 4 },
        { name: 'Web Technologies', code: 'CS302', semester: 6, branch: 'Computer Science Engineering', credits: 3 }
      ],
      researchAreas: ['Software Engineering', 'Web Development', 'Software Testing']
    },
    systemInfo: {
      status: 'Active'
    }
  }
];

async function seedTeachers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_management');
    console.log('Connected to MongoDB');

    // Clear existing teachers
    await Teacher.deleteMany({});
    console.log('Cleared existing teachers');

    // Create teachers with pre-hashed passwords
    const teachersWithHashedPasswords = [];
    
    for (const teacherData of testTeachers) {
      // Hash password manually
      const hashedPassword = await bcrypt.hash(teacherData.password, 10);
      teachersWithHashedPasswords.push({
        ...teacherData,
        password: hashedPassword
      });
    }
    
    // Insert directly to bypass any middleware
    const insertedTeachers = await Teacher.insertMany(teachersWithHashedPasswords);
    console.log(`Created ${insertedTeachers.length} teachers successfully`);

    console.log('Teacher seeding completed successfully!');
    console.log('\n=== TEST TEACHER CREDENTIALS ===');
    
    for (const teacher of testTeachers) {
      console.log(`Teacher ID: ${teacher.teacherId}`);
      console.log(`Email: ${teacher.personalInfo.email}`);
      console.log(`Password: password123`); // Original password before hashing
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
}

// Run the seeding function
seedTeachers();