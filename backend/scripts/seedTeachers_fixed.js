const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
require('dotenv').config();

const testTeachers = [
  {
    teacherId: 'TCH001',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@college.edu',
      phone: '9876543220',
      alternatePhone: '9876543221',
      dateOfBirth: new Date('1980-04-15'),
      gender: 'Male',
      bloodGroup: 'A+',
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F'
    },
    address: {
      currentAddress: {
        street: '123 Faculty Housing',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '456 Home Town',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP001',
      designation: 'Associate Professor',
      department: 'Computer Science Engineering',
      joiningDate: new Date('2015-07-01'),
      qualification: ['PhD in Computer Science', 'M.Tech CSE'],
      experience: 8,
      specialization: ['Data Structures', 'Algorithms', 'Machine Learning']
    }
  },
  {
    teacherId: 'TCH002',
    password: 'password123',
    personalInfo: {
      firstName: 'Prof. Sunita',
      lastName: 'Sharma',
      email: 'sunita.sharma@college.edu',
      phone: '9876543222',
      alternatePhone: '9876543223',
      dateOfBirth: new Date('1975-08-22'),
      gender: 'Female',
      bloodGroup: 'B+',
      aadharNumber: '123456789013',
      panNumber: 'ABCDE1234G'
    },
    address: {
      currentAddress: {
        street: '124 Faculty Housing',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '789 Native Place',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP002',
      designation: 'Professor',
      department: 'Information Technology',
      joiningDate: new Date('2010-08-15'),
      qualification: ['PhD in Information Technology', 'M.Tech IT'],
      experience: 13,
      specialization: ['Database Management', 'Web Technologies', 'Software Engineering']
    }
  },
  {
    teacherId: 'TCH003',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Amit',
      lastName: 'Patel',
      email: 'amit.patel@college.edu',
      phone: '9876543224',
      alternatePhone: '9876543225',
      dateOfBirth: new Date('1982-12-10'),
      gender: 'Male',
      bloodGroup: 'O+',
      aadharNumber: '123456789014',
      panNumber: 'ABCDE1234H'
    },
    address: {
      currentAddress: {
        street: '125 Faculty Housing',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '321 Hometown',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP003',
      designation: 'Assistant Professor',
      department: 'Mechanical Engineering',
      joiningDate: new Date('2018-09-01'),
      qualification: ['PhD in Mechanical Engineering', 'M.Tech Mechanical'],
      experience: 5,
      specialization: ['Thermodynamics', 'Heat Transfer', 'Manufacturing']
    }
  },
  {
    teacherId: 'TCH004',
    password: 'password123',
    personalInfo: {
      firstName: 'Dr. Priya',
      lastName: 'Singh',
      email: 'priya.singh@college.edu',
      phone: '9876543226',
      alternatePhone: '9876543227',
      dateOfBirth: new Date('1978-06-18'),
      gender: 'Female',
      bloodGroup: 'AB+',
      aadharNumber: '123456789015',
      panNumber: 'ABCDE1234I'
    },
    address: {
      currentAddress: {
        street: '126 Faculty Housing',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '654 Origin City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP004',
      designation: 'Associate Professor',
      department: 'Electronics and Communication Engineering',
      joiningDate: new Date('2012-06-01'),
      qualification: ['PhD in Electronics', 'M.Tech ECE'],
      experience: 11,
      specialization: ['Digital Signal Processing', 'Communication Systems', 'VLSI Design']
    }
  },
  {
    teacherId: 'TCH005',
    password: 'password123',
    personalInfo: {
      firstName: 'Prof. Vikram',
      lastName: 'Reddy',
      email: 'vikram.reddy@college.edu',
      phone: '9876543228',
      alternatePhone: '9876543229',
      dateOfBirth: new Date('1973-11-25'),
      gender: 'Male',
      bloodGroup: 'O-',
      aadharNumber: '123456789016',
      panNumber: 'ABCDE1234J'
    },
    address: {
      currentAddress: {
        street: '127 Faculty Housing',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      permanentAddress: {
        street: '987 Family Home',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP005',
      designation: 'Professor',
      department: 'Computer Science Engineering',
      joiningDate: new Date('2008-07-15'),
      qualification: ['PhD in Computer Science', 'M.Tech CSE', 'B.Tech CSE'],
      experience: 15,
      specialization: ['Operating Systems', 'Computer Networks', 'Cybersecurity']
    }
  }
];

const seedTeachers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-erp');
    console.log('Connected to MongoDB');

    // Clear existing teachers
    await Teacher.deleteMany({});
    console.log('Cleared existing teachers');

    // Hash passwords and insert teachers
    for (let teacherData of testTeachers) {
      const hashedPassword = await bcrypt.hash(teacherData.password, 12);
      teacherData.password = hashedPassword;
      
      const teacher = new Teacher(teacherData);
      await teacher.save();
      console.log(`Created teacher: ${teacherData.personalInfo.firstName} ${teacherData.personalInfo.lastName} (${teacherData.teacherId})`);
    }

    console.log('Teacher seeding completed successfully!');
    console.log('\n=== TEST TEACHER CREDENTIALS ===');
    testTeachers.forEach(teacher => {
      console.log(`Teacher ID: ${teacher.teacherId}`);
      console.log(`Email: ${teacher.personalInfo.email}`);
      console.log(`Password: password123`);
      console.log(`Name: ${teacher.personalInfo.firstName} ${teacher.personalInfo.lastName}`);
      console.log(`Department: ${teacher.professionalInfo.department}`);
      console.log(`Designation: ${teacher.professionalInfo.designation}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error seeding teachers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedTeachers();
}

module.exports = seedTeachers;