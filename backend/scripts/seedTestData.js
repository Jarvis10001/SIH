const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Clerk = require('../models/Clerk');
const Admin = require('../models/Admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_erp');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Hash password function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Test Students Data
const studentsData = [
  // Computer Science Students (Semester 5 - Section A)
  {
    studentId: 'STU001',
    personalInfo: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@student.college.edu',
      phone: '9876543201',
      dateOfBirth: new Date('2001-03-15'),
      gender: 'Male',
      address: {
        street: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21001',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU002',
    personalInfo: {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@student.college.edu',
      phone: '9876543202',
      dateOfBirth: new Date('2001-07-22'),
      gender: 'Female',
      address: {
        street: '456 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21002',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU003',
    personalInfo: {
      firstName: 'Arjun',
      lastName: 'Kumar',
      email: 'arjun.kumar@student.college.edu',
      phone: '9876543203',
      dateOfBirth: new Date('2001-11-10'),
      gender: 'Male',
      address: {
        street: '789 Commercial Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21003',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU004',
    personalInfo: {
      firstName: 'Sneha',
      lastName: 'Singh',
      email: 'sneha.singh@student.college.edu',
      phone: '9876543204',
      dateOfBirth: new Date('2001-05-18'),
      gender: 'Female',
      address: {
        street: '321 Residency Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21004',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU005',
    personalInfo: {
      firstName: 'Vikram',
      lastName: 'Mehta',
      email: 'vikram.mehta@student.college.edu',
      phone: '9876543205',
      dateOfBirth: new Date('2001-09-25'),
      gender: 'Male',
      address: {
        street: '654 Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21005',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  // Computer Science Students (Semester 5 - Section B)
  {
    studentId: 'STU006',
    personalInfo: {
      firstName: 'Anita',
      lastName: 'Reddy',
      email: 'anita.reddy@student.college.edu',
      phone: '9876543206',
      dateOfBirth: new Date('2001-02-14'),
      gender: 'Female',
      address: {
        street: '987 Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21006',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'B',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU007',
    personalInfo: {
      firstName: 'Rohit',
      lastName: 'Gupta',
      email: 'rohit.gupta@student.college.edu',
      phone: '9876543207',
      dateOfBirth: new Date('2001-12-08'),
      gender: 'Male',
      address: {
        street: '147 Jayanagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560011',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'CS21007',
      year: 3,
      semester: 5,
      branch: 'Computer Science',
      section: 'B',
      academicYear: '2024-25',
      admissionDate: new Date('2021-08-01')
    },
    password: 'student123',
    isActive: true
  },
  // Mechanical Engineering Students (Semester 3)
  {
    studentId: 'STU011',
    personalInfo: {
      firstName: 'Ravi',
      lastName: 'Chandra',
      email: 'ravi.chandra@student.college.edu',
      phone: '9876543211',
      dateOfBirth: new Date('2002-04-12'),
      gender: 'Male',
      address: {
        street: '258 Malleshwaram',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560003',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'ME22001',
      year: 2,
      semester: 3,
      branch: 'Mechanical Engineering',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2022-08-01')
    },
    password: 'student123',
    isActive: true
  },
  {
    studentId: 'STU012',
    personalInfo: {
      firstName: 'Meera',
      lastName: 'Iyer',
      email: 'meera.iyer@student.college.edu',
      phone: '9876543212',
      dateOfBirth: new Date('2002-08-30'),
      gender: 'Female',
      address: {
        street: '369 Basavanagudi',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560004',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'ME22002',
      year: 2,
      semester: 3,
      branch: 'Mechanical Engineering',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2022-08-01')
    },
    password: 'student123',
    isActive: true
  },
  // Electronics & Communication Students (Semester 7)
  {
    studentId: 'STU016',
    personalInfo: {
      firstName: 'Asha',
      lastName: 'Krishnan',
      email: 'asha.krishnan@student.college.edu',
      phone: '9876543216',
      dateOfBirth: new Date('2000-06-20'),
      gender: 'Female',
      address: {
        street: '741 RT Nagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560032',
        country: 'India'
      }
    },
    academicInfo: {
      rollNumber: 'EC20001',
      year: 4,
      semester: 7,
      branch: 'Electronics & Communication',
      section: 'A',
      academicYear: '2024-25',
      admissionDate: new Date('2020-08-01')
    },
    password: 'student123',
    isActive: true
  }
];

// Test Teachers Data
const teachersData = [
  {
    teacherId: 'TEACH001',
    personalInfo: {
      firstName: 'Dr. Arun',
      lastName: 'Kumar',
      email: 'arun.kumar@teacher.college.edu',
      phone: '9876543301',
      dateOfBirth: new Date('1985-01-15'),
      gender: 'Male',
      address: {
        street: '123 Teacher Colony',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP001',
      department: 'Computer Science',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Computer Science',
      experience: 12,
      joiningDate: new Date('2015-06-01'),
      subjects: ['Data Structures', 'Algorithms', 'Programming Fundamentals']
    },
    password: 'teacher123',
    isActive: true
  },
  {
    teacherId: 'TEACH002',
    personalInfo: {
      firstName: 'Prof. Sunita',
      lastName: 'Rao',
      email: 'sunita.rao@teacher.college.edu',
      phone: '9876543302',
      dateOfBirth: new Date('1980-08-22'),
      gender: 'Female',
      address: {
        street: '456 Faculty Quarters',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP002',
      department: 'Computer Science',
      designation: 'Professor',
      qualification: 'M.Tech in Database Systems',
      experience: 15,
      joiningDate: new Date('2012-07-01'),
      subjects: ['Database Management', 'SQL', 'Data Warehousing']
    },
    password: 'teacher123',
    isActive: true
  },
  {
    teacherId: 'TEACH003',
    personalInfo: {
      firstName: 'Dr. Manoj',
      lastName: 'Gupta',
      email: 'manoj.gupta@teacher.college.edu',
      phone: '9876543303',
      dateOfBirth: new Date('1978-11-10'),
      gender: 'Male',
      address: {
        street: '789 Academic Block',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP003',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Web Technologies',
      experience: 8,
      joiningDate: new Date('2018-08-01'),
      subjects: ['Web Development', 'JavaScript', 'React.js']
    },
    password: 'teacher123',
    isActive: true
  },
  {
    teacherId: 'TEACH006',
    personalInfo: {
      firstName: 'Prof. Ramesh',
      lastName: 'Joshi',
      email: 'ramesh.joshi@teacher.college.edu',
      phone: '9876543306',
      dateOfBirth: new Date('1975-05-18'),
      gender: 'Male',
      address: {
        street: '321 Mechanical Block',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP006',
      department: 'Mechanical Engineering',
      designation: 'Professor',
      qualification: 'Ph.D. in Thermal Engineering',
      experience: 20,
      joiningDate: new Date('2008-06-01'),
      subjects: ['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics']
    },
    password: 'teacher123',
    isActive: true
  },
  {
    teacherId: 'TEACH009',
    personalInfo: {
      firstName: 'Dr. Pradeep',
      lastName: 'Singh',
      email: 'pradeep.singh@teacher.college.edu',
      phone: '9876543309',
      dateOfBirth: new Date('1982-09-25'),
      gender: 'Male',
      address: {
        street: '654 ECE Department',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        country: 'India'
      }
    },
    professionalInfo: {
      employeeId: 'EMP009',
      department: 'Electronics & Communication',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in VLSI Design',
      experience: 10,
      joiningDate: new Date('2016-07-01'),
      subjects: ['Digital Electronics', 'VLSI Design', 'Microprocessors']
    },
    password: 'teacher123',
    isActive: true
  }
];

// Test Clerks Data
const clerksData = [
  {
    clerkId: 'CLERK001',
    personalInfo: {
      firstName: 'Sunil',
      lastName: 'Verma',
      email: 'sunil.verma@clerk.college.edu',
      phone: '9876543401',
      dateOfBirth: new Date('1988-03-15'),
      gender: 'Male',
      address: {
        street: '123 Admin Block',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    employmentInfo: {
      employeeId: 'CLK001',
      department: 'Admissions',
      designation: 'Senior Clerk',
      joiningDate: new Date('2018-04-01'),
      experience: 6
    },
    permissions: {
      modules: ['student_admission', 'document_verification', 'student_records'],
      accessLevel: 'high'
    },
    password: 'clerk123',
    isActive: true
  },
  {
    clerkId: 'CLERK002',
    personalInfo: {
      firstName: 'Meena',
      lastName: 'Kumari',
      email: 'meena.kumari@clerk.college.edu',
      phone: '9876543402',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'Female',
      address: {
        street: '456 Accounts Section',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'India'
      }
    },
    employmentInfo: {
      employeeId: 'CLK002',
      department: 'Accounts',
      designation: 'Accounts Clerk',
      joiningDate: new Date('2019-06-01'),
      experience: 5
    },
    permissions: {
      modules: ['fee_management', 'financial_records', 'payment_processing'],
      accessLevel: 'medium'
    },
    password: 'clerk123',
    isActive: true
  },
  {
    clerkId: 'CLERK003',
    personalInfo: {
      firstName: 'Rajesh',
      lastName: 'Tiwari',
      email: 'rajesh.tiwari@clerk.college.edu',
      phone: '9876543403',
      dateOfBirth: new Date('1985-11-10'),
      gender: 'Male',
      address: {
        street: '789 Academic Office',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    employmentInfo: {
      employeeId: 'CLK003',
      department: 'Academic',
      designation: 'Academic Clerk',
      joiningDate: new Date('2017-08-01'),
      experience: 7
    },
    permissions: {
      modules: ['grade_management', 'transcript_generation', 'academic_records'],
      accessLevel: 'high'
    },
    password: 'clerk123',
    isActive: true
  }
];

// Seed function for Students
const seedStudents = async () => {
  try {
    await Student.deleteMany({});
    console.log('Cleared existing students');

    for (const studentData of studentsData) {
      const hashedPassword = await hashPassword(studentData.password);
      studentData.password = hashedPassword;
      
      const student = new Student(studentData);
      await student.save();
      console.log(`Created student: ${studentData.personalInfo.firstName} ${studentData.personalInfo.lastName} (${studentData.studentId})`);
    }
    
    console.log(`✅ Successfully seeded ${studentsData.length} students`);
  } catch (error) {
    console.error('Error seeding students:', error);
  }
};

// Seed function for Teachers
const seedTeachers = async () => {
  try {
    await Teacher.deleteMany({});
    console.log('Cleared existing teachers');

    for (const teacherData of teachersData) {
      const hashedPassword = await hashPassword(teacherData.password);
      teacherData.password = hashedPassword;
      
      const teacher = new Teacher(teacherData);
      await teacher.save();
      console.log(`Created teacher: ${teacherData.personalInfo.firstName} ${teacherData.personalInfo.lastName} (${teacherData.teacherId})`);
    }
    
    console.log(`✅ Successfully seeded ${teachersData.length} teachers`);
  } catch (error) {
    console.error('Error seeding teachers:', error);
  }
};

// Seed function for Clerks
const seedClerks = async () => {
  try {
    await Clerk.deleteMany({});
    console.log('Cleared existing clerks');

    for (const clerkData of clerksData) {
      const hashedPassword = await hashPassword(clerkData.password);
      clerkData.password = hashedPassword;
      
      const clerk = new Clerk(clerkData);
      await clerk.save();
      console.log(`Created clerk: ${clerkData.personalInfo.firstName} ${clerkData.personalInfo.lastName} (${clerkData.clerkId})`);
    }
    
    console.log(`✅ Successfully seeded ${clerksData.length} clerks`);
  } catch (error) {
    console.error('Error seeding clerks:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    console.log('================================');
    
    await seedStudents();
    console.log('--------------------------------');
    
    await seedTeachers();
    console.log('--------------------------------');
    
    await seedClerks();
    console.log('--------------------------------');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   Students: ${studentsData.length}`);
    console.log(`   Teachers: ${teachersData.length}`);
    console.log(`   Clerks: ${clerksData.length}`);
    console.log('');
    console.log('🔑 Test credentials saved in TEST_CREDENTIALS.md');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Export functions for individual use
module.exports = {
  seedDatabase,
  seedStudents,
  seedTeachers,
  seedClerks,
  connectDB
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}