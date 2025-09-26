const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
require('dotenv').config();

const checkRajuData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if Raju exists in Students collection
    const rajuStudent = await Student.findOne({ email: 'raju@gmail.com' });
    
    if (rajuStudent) {
      console.log('\n=== RAJU STUDENT RECORD FOUND ===');
      console.log(`Student ID: ${rajuStudent.studentId}`);
      console.log(`Email: ${rajuStudent.email}`);
      console.log(`Name: ${rajuStudent.name.firstName} ${rajuStudent.name.lastName}`);
      console.log(`Roll Number: ${rajuStudent.academics.rollNumber}`);
      console.log(`Branch: ${rajuStudent.branch}`);
      console.log(`Section: ${rajuStudent.academics.section}`);
      console.log(`Semester: ${rajuStudent.semester}`);
    } else {
      console.log('\n❌ RAJU STUDENT RECORD NOT FOUND!');
      console.log('Checking all students with similar names...');
      
      const similarStudents = await Student.find({
        $or: [
          { 'name.firstName': /raju/i },
          { email: /raju/i },
          { studentId: 'STU021' }
        ]
      });
      
      console.log(`Found ${similarStudents.length} similar students:`);
      similarStudents.forEach(student => {
        console.log(`- ${student.studentId}: ${student.name.firstName} ${student.name.lastName} (${student.email})`);
      });
    }

    // Check attendance records for Raju (STU021)
    console.log('\n=== CHECKING ATTENDANCE RECORDS ===');
    
    // Method 1: Find by student ID in attendance array
    const attendanceByStudentId = await Attendance.find({
      'studentAttendance.studentId': 'STU021'
    });
    
    console.log(`\nAttendance records with STU021: ${attendanceByStudentId.length}`);
    
    if (attendanceByStudentId.length > 0) {
      console.log('\n=== RAJU\'S ATTENDANCE DETAILS ===');
      attendanceByStudentId.forEach((record, index) => {
        const rajuRecord = record.studentAttendance.find(student => student.studentId === 'STU021');
        if (rajuRecord) {
          console.log(`${index + 1}. Date: ${record.date.toISOString().split('T')[0]}`);
          console.log(`   Subject: ${record.classInfo.subject} (${record.classInfo.subjectCode})`);
          console.log(`   Section: ${record.classInfo.section}`);
          console.log(`   Teacher: ${record.teacherInfo.teacherName}`);
          console.log(`   Status: ${rajuRecord.status} ${rajuRecord.remarks ? '(' + rajuRecord.remarks + ')' : ''}`);
          console.log(`   Time: ${record.timeSlot.startTime} - ${record.timeSlot.endTime}`);
          console.log('');
        }
      });
      
      // Calculate attendance percentage
      const totalClasses = attendanceByStudentId.length;
      const presentCount = attendanceByStudentId.filter(record => {
        const rajuRecord = record.studentAttendance.find(student => student.studentId === 'STU021');
        return rajuRecord && (rajuRecord.status === 'Present' || rajuRecord.status === 'Late');
      }).length;
      
      const attendancePercentage = Math.round((presentCount / totalClasses) * 100);
      console.log(`=== ATTENDANCE SUMMARY ===`);
      console.log(`Total Classes: ${totalClasses}`);
      console.log(`Present/Late: ${presentCount}`);
      console.log(`Attendance %: ${attendancePercentage}%`);
    }

    // Method 2: Find by email (if studentId in attendance doesn't match)
    if (rajuStudent) {
      const attendanceByEmail = await Attendance.find({
        'studentAttendance.studentId': rajuStudent.studentId
      });
      
      if (attendanceByEmail.length !== attendanceByStudentId.length) {
        console.log(`\n⚠️  Mismatch: Found ${attendanceByEmail.length} records by actual student ID vs ${attendanceByStudentId.length} by STU021`);
      }
    }

    // Check all attendance records to see what student IDs exist
    console.log('\n=== ALL STUDENT IDs IN ATTENDANCE ===');
    const allAttendance = await Attendance.find({});
    const allStudentIds = new Set();
    
    allAttendance.forEach(record => {
      record.studentAttendance.forEach(student => {
        allStudentIds.add(student.studentId);
      });
    });
    
    console.log('Student IDs found in attendance records:');
    Array.from(allStudentIds).sort().forEach(id => {
      console.log(`- ${id}`);
    });

    // Check if there's a mismatch in student ID
    if (rajuStudent && !allStudentIds.has(rajuStudent.studentId)) {
      console.log(`\n❌ PROBLEM FOUND: Student ${rajuStudent.studentId} exists but has no attendance records!`);
      console.log(`Student record ID: ${rajuStudent.studentId}`);
      console.log(`Expected in attendance: STU021`);
    }

  } catch (error) {
    console.error('Error checking Raju data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

checkRajuData();