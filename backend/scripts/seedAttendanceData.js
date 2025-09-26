const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Attendance = require('../models/Attendance');

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

// Sample attendance records for testing
const attendanceData = [
  // Data Structures class - CS Section A - Dr. Arun Kumar
  {
    classInfo: {
      subject: 'Data Structures',
      subjectCode: 'CS21DS',
      className: 'Computer Science',
      section: 'A',
      semester: 5,
      academicYear: '2024-25'
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
      {
        studentId: 'STU001',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS21001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU002',
        studentName: 'Priya Patel',
        rollNumber: 'CS21002',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU003',
        studentName: 'Arjun Kumar',
        rollNumber: 'CS21003',
        status: 'Absent',
        remarks: 'Medical leave'
      },
      {
        studentId: 'STU004',
        studentName: 'Sneha Singh',
        rollNumber: 'CS21004',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU005',
        studentName: 'Vikram Mehta',
        rollNumber: 'CS21005',
        status: 'Late',
        remarks: 'Traffic delay'
      }
    ]
  },
  // Database Management class - CS Section A - Prof. Sunita Rao
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS21DBMS',
      className: 'Computer Science',
      section: 'A',
      semester: 5,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-16'),
    timeSlot: {
      startTime: '10:15',
      endTime: '11:15'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      {
        studentId: 'STU001',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS21001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU002',
        studentName: 'Priya Patel',
        rollNumber: 'CS21002',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU003',
        studentName: 'Arjun Kumar',
        rollNumber: 'CS21003',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU004',
        studentName: 'Sneha Singh',
        rollNumber: 'CS21004',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU005',
        studentName: 'Vikram Mehta',
        rollNumber: 'CS21005',
        status: 'Present',
        remarks: ''
      }
    ]
  },
  // Web Development class - CS Section A - Dr. Manoj Gupta
  {
    classInfo: {
      subject: 'Web Development',
      subjectCode: 'CS21WD',
      className: 'Computer Science',
      section: 'A',
      semester: 5,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-17'),
    timeSlot: {
      startTime: '11:30',
      endTime: '12:30'
    },
    teacherInfo: {
      teacherId: 'TEACH003',
      teacherName: 'Dr. Manoj Gupta'
    },
    studentAttendance: [
      {
        studentId: 'STU001',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS21001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU002',
        studentName: 'Priya Patel',
        rollNumber: 'CS21002',
        status: 'Absent',
        remarks: 'Family function'
      },
      {
        studentId: 'STU003',
        studentName: 'Arjun Kumar',
        rollNumber: 'CS21003',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU004',
        studentName: 'Sneha Singh',
        rollNumber: 'CS21004',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU005',
        studentName: 'Vikram Mehta',
        rollNumber: 'CS21005',
        status: 'Late',
        remarks: 'Bus delay'
      }
    ]
  },
  // Data Structures class - Previous week
  {
    classInfo: {
      subject: 'Data Structures',
      subjectCode: 'CS21DS',
      className: 'Computer Science',
      section: 'A',
      semester: 5,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-10'),
    timeSlot: {
      startTime: '09:00',
      endTime: '10:00'
    },
    teacherInfo: {
      teacherId: 'TEACH001',
      teacherName: 'Dr. Arun Kumar'
    },
    studentAttendance: [
      {
        studentId: 'STU001',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS21001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU002',
        studentName: 'Priya Patel',
        rollNumber: 'CS21002',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU003',
        studentName: 'Arjun Kumar',
        rollNumber: 'CS21003',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU004',
        studentName: 'Sneha Singh',
        rollNumber: 'CS21004',
        status: 'Absent',
        remarks: 'Sick'
      },
      {
        studentId: 'STU005',
        studentName: 'Vikram Mehta',
        rollNumber: 'CS21005',
        status: 'Present',
        remarks: ''
      }
    ]
  },
  // Database Management class - Previous week
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS21DBMS',
      className: 'Computer Science',
      section: 'A',
      semester: 5,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-11'),
    timeSlot: {
      startTime: '10:15',
      endTime: '11:15'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      {
        studentId: 'STU001',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS21001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU002',
        studentName: 'Priya Patel',
        rollNumber: 'CS21002',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU003',
        studentName: 'Arjun Kumar',
        rollNumber: 'CS21003',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU004',
        studentName: 'Sneha Singh',
        rollNumber: 'CS21004',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU005',
        studentName: 'Vikram Mehta',
        rollNumber: 'CS21005',
        status: 'Present',
        remarks: ''
      }
    ]
  },
  // CS Section B - Database Management
  {
    classInfo: {
      subject: 'Database Management',
      subjectCode: 'CS21DBMS',
      className: 'Computer Science',
      section: 'B',
      semester: 5,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-16'),
    timeSlot: {
      startTime: '14:00',
      endTime: '15:00'
    },
    teacherInfo: {
      teacherId: 'TEACH002',
      teacherName: 'Prof. Sunita Rao'
    },
    studentAttendance: [
      {
        studentId: 'STU006',
        studentName: 'Anita Reddy',
        rollNumber: 'CS21006',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU007',
        studentName: 'Rohit Gupta',
        rollNumber: 'CS21007',
        status: 'Present',
        remarks: ''
      }
    ]
  },
  // Mechanical Engineering - Thermodynamics
  {
    classInfo: {
      subject: 'Thermodynamics',
      subjectCode: 'ME22TD',
      className: 'Mechanical Engineering',
      section: 'A',
      semester: 3,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-16'),
    timeSlot: {
      startTime: '11:30',
      endTime: '12:30'
    },
    teacherInfo: {
      teacherId: 'TEACH006',
      teacherName: 'Prof. Ramesh Joshi'
    },
    studentAttendance: [
      {
        studentId: 'STU011',
        studentName: 'Ravi Chandra',
        rollNumber: 'ME22001',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU012',
        studentName: 'Meera Iyer',
        rollNumber: 'ME22002',
        status: 'Present',
        remarks: ''
      }
    ]
  },
  // Electronics & Communication - Digital Electronics
  {
    classInfo: {
      subject: 'Digital Electronics',
      subjectCode: 'EC20DE',
      className: 'Electronics & Communication',
      section: 'A',
      semester: 7,
      academicYear: '2024-25'
    },
    date: new Date('2024-09-17'),
    timeSlot: {
      startTime: '09:00',
      endTime: '10:00'
    },
    teacherInfo: {
      teacherId: 'TEACH009',
      teacherName: 'Dr. Pradeep Singh'
    },
    studentAttendance: [
      {
        studentId: 'STU016',
        studentName: 'Asha Krishnan',
        rollNumber: 'EC20001',
        status: 'Present',
        remarks: ''
      }
    ]
  }
];

// Seed attendance data
const seedAttendance = async () => {
  try {
    await connectDB();
    
    // Clear existing attendance data
    await Attendance.deleteMany({});
    console.log('Cleared existing attendance records');
    
    // Insert new attendance data
    for (const record of attendanceData) {
      const attendance = new Attendance(record);
      await attendance.save();
      console.log(`Created attendance record: ${record.classInfo.subject} - ${record.classInfo.section} (${record.date.toDateString()})`);
    }
    
    console.log(`✅ Successfully seeded ${attendanceData.length} attendance records`);
    console.log('');
    console.log('📊 Attendance Summary:');
    console.log('   - Data Structures: 2 classes');
    console.log('   - Database Management: 3 classes');
    console.log('   - Web Development: 1 class');
    console.log('   - Thermodynamics: 1 class');
    console.log('   - Digital Electronics: 1 class');
    console.log('');
    console.log('🎯 Test with student credentials:');
    console.log('   STU001 (Rahul Sharma) - CS Section A');
    console.log('   STU002 (Priya Patel) - CS Section A');
    console.log('   STU011 (Ravi Chandra) - ME Section A');
    console.log('   STU016 (Asha Krishnan) - EC Section A');
    
  } catch (error) {
    console.error('❌ Error seeding attendance data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Export function
module.exports = { seedAttendance };

// Run seeding if called directly
if (require.main === module) {
  seedAttendance();
}