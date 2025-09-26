#!/usr/bin/env node

/**
 * Complete Database Seeder Script
 * Seeds test data for Students, Teachers, Clerks, and Attendance records
 */

const { seedDatabase } = require('./seedTestData');
const { seedAttendance } = require('./seedAttendanceData');

const runCompleteSeeding = async () => {
  console.log('🚀 Starting Complete Database Seeding...');
  console.log('==========================================');
  
  try {
    // Step 1: Seed users (Students, Teachers, Clerks)
    console.log('\n📝 Step 1: Seeding Users...');
    await seedDatabase();
    
    // Wait a moment between operations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Seed attendance data
    console.log('\n📊 Step 2: Seeding Attendance Data...');
    await seedAttendance();
    
    console.log('\n🎉 COMPLETE SEEDING FINISHED SUCCESSFULLY!');
    console.log('==========================================');
    console.log('');
    console.log('📋 What was created:');
    console.log('   ✅ 10 Test Students (CS, ME, EC departments)');
    console.log('   ✅ 5 Test Teachers (Various departments)');
    console.log('   ✅ 3 Test Clerks (Admin, Accounts, Academic)');
    console.log('   ✅ 8 Attendance Records (Multiple subjects)');
    console.log('');
    console.log('🔑 Test credentials available in: TEST_CREDENTIALS.md');
    console.log('');
    console.log('🚀 Ready to test:');
    console.log('   1. Student Login: rahul.sharma@student.college.edu / student123');
    console.log('   2. Teacher Login: arun.kumar@teacher.college.edu / teacher123');
    console.log('   3. Clerk Login: sunil.verma@clerk.college.edu / clerk123');
    console.log('');
    console.log('📱 Test attendance viewing for student STU001 (Rahul Sharma)');
    console.log('   - Should see 5 attendance records');
    console.log('   - Mix of Present, Absent, and Late statuses');
    console.log('   - Multiple subjects: Data Structures, Database, Web Dev');
    console.log('');
    
  } catch (error) {
    console.error('❌ Complete seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runCompleteSeeding();
}

module.exports = { runCompleteSeeding };