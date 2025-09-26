# Test Data Setup Guide

## 🎯 Quick Start

To populate your database with test data for the College ERP system:

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies (if not done)
```bash
npm install
```

### 3. Seed Complete Database
```bash
npm run seed
```

This will create:
- **10 Students** (CS, ME, EC departments)
- **5 Teachers** (Various departments)  
- **3 Clerks** (Admin, Accounts, Academic)
- **8 Attendance Records** (Multiple subjects and dates)

## 🔑 Test Credentials

After seeding, use these credentials to test different roles:

### Student Login
```
Email: rahul.sharma@student.college.edu
Password: student123
```

### Teacher Login
```
Email: arun.kumar@teacher.college.edu
Password: teacher123
```

### Clerk Login
```
Email: sunil.verma@clerk.college.edu
Password: clerk123
```

## 📊 Individual Seeding Commands

If you want to seed specific data types:

### Seed Only Users (Students, Teachers, Clerks)
```bash
npm run seed:users
```

### Seed Only Attendance Data
```bash
npm run seed:attendance
```

## 🎓 Test Scenarios

### For Student Attendance Testing:
1. Login as **STU001 (Rahul Sharma)**
2. Navigate to **Attendance** section
3. Should see 5 attendance records with mixed statuses:
   - Data Structures: 2 classes (1 Present, 1 Present)
   - Database Management: 2 classes (Present, Present)
   - Web Development: 1 class (Present)

### For Teacher Attendance Management:
1. Login as **TEACH001 (Dr. Arun Kumar)**
2. Navigate to **Attendance Management**
3. Can upload new attendance or view existing records
4. Can see students: STU001-STU005 for CS Section A

### For Clerk Operations:
1. Login as **CLERK001 (Sunil Verma)**
2. Navigate to **Student Verification**
3. Can verify documents for students STU011-STU015

## 📋 Complete Test Data Overview

### Students by Department:
- **Computer Science (Section A)**: STU001-STU005 (Semester 5)
- **Computer Science (Section B)**: STU006-STU007 (Semester 5)
- **Mechanical Engineering**: STU011-STU012 (Semester 3)
- **Electronics & Communication**: STU016 (Semester 7)

### Teachers by Department:
- **CS Department**: TEACH001-TEACH003
- **ME Department**: TEACH006
- **EC Department**: TEACH009

### Clerk Specializations:
- **CLERK001**: Admissions & Document Verification
- **CLERK002**: Accounts & Fee Management
- **CLERK003**: Academic Records & Grades

## 🔧 Environment Setup

Make sure your `.env` file in the backend directory contains:

```env
MONGODB_URI=mongodb://localhost:27017/college_erp
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

## 🚀 Testing the Student Attendance Page

After seeding and running both frontend and backend:

1. **Start Backend**: `npm run dev` (in backend directory)
2. **Start Frontend**: `npm run dev` (in front directory)
3. **Login as Student**: Use STU001 credentials
4. **Navigate to**: Dashboard → Attendance
5. **Verify**: Should see attendance records with statistics

## 📁 Files Created

- `TEST_CREDENTIALS.md` - All login credentials
- `scripts/seedTestData.js` - User seeding script
- `scripts/seedAttendanceData.js` - Attendance seeding script
- `scripts/runCompleteSeeding.js` - Combined seeding script

## 🛠️ Troubleshooting

### Database Connection Issues:
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env file
3. Verify network connectivity

### Seeding Fails:
1. Clear existing data manually if needed
2. Check console for specific error messages
3. Ensure all required models exist

### Login Issues:
1. Verify user was created in database
2. Check password hashing is working
3. Ensure JWT secrets are configured

---

*Generated for SIH Project - Smart ERP College Management System*