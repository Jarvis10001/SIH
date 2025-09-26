const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
require('dotenv').config();

// First, let's add the student with raju@gmail.com if they don't exist
const additionalStudent = {
  studentId: 'STU021',
  email: 'raju@gmail.com',
  password: 'student123',
  name: {
    firstName: 'Raju',
    lastName: 'Patel'
  },
  year: 3,
  semester: 5,
  branch: 'Computer Science Engineering',
  personalInfo: {
    dateOfBirth: new Date('2003-03-10'),
    gender: 'Male',
    bloodGroup: 'B+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General'
  },
  contact: {
    phone: {
      primary: '9876543250',
      secondary: '9876543251'
    },
    address: {
      permanent: {
        street: '789 Gandhi Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400003',
        country: 'India'
      },
      current: {
        street: '789 Gandhi Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400003',
        country: 'India',
        isSameAsPermanent: true
      }
    }
  },
  guardian: {
    father: {
      name: 'Mohan Patel',
      occupation: 'Engineer',
      phone: '9876543252',
      email: 'mohan.patel@email.com'
    },
    mother: {
      name: 'Sunita Patel',
      occupation: 'Teacher',
      phone: '9876543253',
      email: 'sunita.patel@email.com'
    }
  },
  academics: {
    rollNumber: 'CS21021',
    section: 'A',
    admissionYear: 2021,
    admissionType: 'Regular',
    admissionDate: new Date('2021-07-01'),
    currentCGPA: 8.5,
    previousEducation: {
      school: 'ABC High School',
      board: 'CBSE',
      percentage: 92.5,
      yearOfPassing: 2021
    }
  },
  fees: {
    totalFees: 120000,
    paidFees: 80000,
    pendingFees: 40000,
    lastPaymentDate: new Date('2024-08-15')
  },
  status: {
    isActive: true,
    accountStatus: 'Active'
  }
};

// Attendance data for different subjects and dates
const attendanceData = [
  // Data Structures class by Dr. Arun Kumar (TEACH001) - Computer Science Section A
  {
    classInfo: {
      subject: 'Data Structures',
      subjectCode: 'CS301',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-15'),
    timeSlot: {
      startTime: '09:00',
      endTime: '10:00'
    },
    teacherInfo: {
      teacherId: 'TEACH001',
      teacherName: 'Dr. Arun Kumar'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Present' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Absent' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Present' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Late' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Present' }
    ]
  },
  
  // Database Management class by Prof. Sunita Rao (TEACH002) - Computer Science Section A
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS302',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-16'),
    timeSlot: {
      startTime: '10:00',
      endTime: '11:00'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Absent' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Present' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Present' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Present' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Present' }
    ]
  },

  // Web Development class by Dr. Manoj Gupta (TEACH003) - Computer Science Section A
  {
    classInfo: {
      subject: 'Web Development',
      subjectCode: 'CS303',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-17'),
    timeSlot: {
      startTime: '11:00',
      endTime: '12:00'
    },
    teacherInfo: {
      teacherId: 'TEACH003',
      teacherName: 'Dr. Manoj Gupta'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Late' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Present' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Present' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Absent' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Present' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Present' }
    ]
  },

  // Operating Systems class by Prof. Rekha Sharma (TEACH004) - Computer Science Section A
  {
    classInfo: {
      subject: 'Operating Systems',
      subjectCode: 'CS304',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-18'),
    timeSlot: {
      startTime: '14:00',
      endTime: '15:00'
    },
    teacherInfo: {
      teacherId: 'TEACH004',
      teacherName: 'Prof. Rekha Sharma'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Present' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Present' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Present' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Absent' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Present' }
    ]
  },

  // Machine Learning class by Dr. Vivek Pandey (TEACH005) - Computer Science Section A
  {
    classInfo: {
      subject: 'Machine Learning',
      subjectCode: 'CS305',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-19'),
    timeSlot: {
      startTime: '15:00',
      endTime: '16:00'
    },
    teacherInfo: {
      teacherId: 'TEACH005',
      teacherName: 'Dr. Vivek Pandey'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Present' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Absent' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Late' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Present' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Present' }
    ]
  },

  // Computer Science Section B - Database Management by Prof. Sunita Rao (TEACH002)
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS302',
      className: 'Computer Science Engineering',
      section: 'B',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-16'),
    timeSlot: {
      startTime: '11:00',
      endTime: '12:00'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      { studentId: 'STU006', studentName: 'Anita Reddy', rollNumber: 'CS21006', status: 'Present' },
      { studentId: 'STU007', studentName: 'Rohit Gupta', rollNumber: 'CS21007', status: 'Present' },
      { studentId: 'STU008', studentName: 'Kavya Nair', rollNumber: 'CS21008', status: 'Late' },
      { studentId: 'STU009', studentName: 'Amit Joshi', rollNumber: 'CS21009', status: 'Present' },
      { studentId: 'STU010', studentName: 'Pooja Agarwal', rollNumber: 'CS21010', status: 'Absent' }
    ]
  },

  // Previous week's attendance for Raju (STU021) - Data Structures
  {
    classInfo: {
      subject: 'Data Structures',
      subjectCode: 'CS301',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-08'),
    timeSlot: {
      startTime: '09:00',
      endTime: '10:00'
    },
    teacherInfo: {
      teacherId: 'TEACH001',
      teacherName: 'Dr. Arun Kumar'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Late' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Present' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Present' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Absent' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Absent', remarks: 'Medical leave' }
    ]
  },

  // Another previous week's attendance for Raju (STU021) - Database Management
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS302',
      className: 'Computer Science Engineering',
      section: 'A',
      semester: 5,
      academicYear: '2024-2025'
    },
    date: new Date('2024-09-09'),
    timeSlot: {
      startTime: '10:00',
      endTime: '11:00'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      { studentId: 'STU001', studentName: 'Rahul Sharma', rollNumber: 'CS21001', status: 'Present' },
      { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: 'CS21002', status: 'Present' },
      { studentId: 'STU003', studentName: 'Arjun Kumar', rollNumber: 'CS21003', status: 'Present' },
      { studentId: 'STU004', studentName: 'Sneha Singh', rollNumber: 'CS21004', status: 'Late' },
      { studentId: 'STU005', studentName: 'Vikram Mehta', rollNumber: 'CS21005', status: 'Present' },
      { studentId: 'STU021', studentName: 'Raju Patel', rollNumber: 'CS21021', status: 'Excused', remarks: 'Medical leave' }
    ]
  }
];

const seedAttendance = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, add the additional student (Raju) if they don't exist
    const bcrypt = require('bcryptjs');
    const existingStudent = await Student.findOne({ email: 'raju@gmail.com' });
    
    if (!existingStudent) {
      console.log('Adding student Raju to database...');
      const hashedPassword = await bcrypt.hash(additionalStudent.password, 12);
      const studentWithHashedPassword = {
        ...additionalStudent,
        password: hashedPassword
      };
      
      await Student.create(studentWithHashedPassword);
      console.log('Student Raju added successfully!');
    } else {
      console.log('Student Raju already exists in database.');
    }

    // Clear existing attendance records
    await Attendance.deleteMany({});
    console.log('Cleared existing attendance records');

    // Insert attendance data
    const attendanceRecords = await Attendance.insertMany(attendanceData);
    console.log(`Created ${attendanceRecords.length} attendance records successfully!`);

    console.log('\n=== ATTENDANCE SUMMARY ===');
    console.log(`Total attendance sessions created: ${attendanceRecords.length}`);
    
    // Summary for Raju specifically
    const rajuAttendance = attendanceData.filter(record => 
      record.studentAttendance.some(student => student.studentId === 'STU021')
    );
    
    console.log(`\n=== RAJU'S ATTENDANCE SUMMARY ===`);
    console.log(`Email: raju@gmail.com`);
    console.log(`Student ID: STU021`);
    console.log(`Roll Number: CS21021`);
    console.log(`Total classes: ${rajuAttendance.length}`);
    
    rajuAttendance.forEach(record => {
      const rajuRecord = record.studentAttendance.find(student => student.studentId === 'STU021');
      console.log(`${record.date.toISOString().split('T')[0]} - ${record.classInfo.subject}: ${rajuRecord.status} ${rajuRecord.remarks ? '(' + rajuRecord.remarks + ')' : ''}`);
    });

    // Calculate Raju's attendance percentage
    const presentCount = rajuAttendance.filter(record => {
      const rajuRecord = record.studentAttendance.find(student => student.studentId === 'STU021');
      return rajuRecord.status === 'Present' || rajuRecord.status === 'Late';
    }).length;
    
    const attendancePercentage = Math.round((presentCount / rajuAttendance.length) * 100);
    console.log(`Raju's Overall Attendance: ${attendancePercentage}% (${presentCount}/${rajuAttendance.length})`);

    console.log('\n=== TEACHERS AND SUBJECTS ===');
    const uniqueClasses = [...new Set(attendanceData.map(record => 
      `${record.teacherInfo.teacherName} - ${record.classInfo.subject} (${record.classInfo.section})`
    ))];
    uniqueClasses.forEach(classInfo => console.log(`- ${classInfo}`));

  } catch (error) {
    console.error('Error seeding attendance:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedAttendance();