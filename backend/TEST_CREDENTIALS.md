# Test User Credentials for College Management System

This file contains login credentials for all test users created in the system. Use these credentials for testing and development purposes.

## Students

### Student 1
- **Student ID**: STU001
- **Email**: rahul.sharma@college.edu
- **Password**: password123
- **Name**: Rahul Sharma
- **Branch**: Computer Science Engineering
- **Year**: 2, Semester: 3

### Student 2
- **Student ID**: STU002
- **Email**: priya.patel@college.edu
- **Password**: password123
- **Name**: Priya Patel
- **Branch**: Information Technology
- **Year**: 3, Semester: 5

### Student 3
- **Student ID**: STU003
- **Email**: amit.singh@college.edu
- **Password**: password123
- **Name**: Amit Singh
- **Branch**: Mechanical Engineering
- **Year**: 1, Semester: 2

### Student 4
- **Student ID**: STU004
- **Email**: sneha.reddy@college.edu
- **Password**: password123
- **Name**: Sneha Reddy
- **Branch**: Electronics and Communication Engineering
- **Year**: 4, Semester: 7

### Student 5
- **Student ID**: STU005
- **Email**: arjun.gupta@college.edu
- **Password**: password123
- **Name**: Arjun Gupta
- **Branch**: Computer Science Engineering
- **Year**: 2, Semester: 4

---

## Teachers

### Teacher 1
- **Teacher ID**: T001
- **Email**: rajesh.verma@college.edu
- **Password**: password123
- **Name**: Dr. Rajesh Verma
- **Department**: Computer Science Engineering
- **Designation**: Professor
- **Subjects**: Data Structures, Machine Learning

### Teacher 2
- **Teacher ID**: T002
- **Email**: priya.sharma@college.edu
- **Password**: password123
- **Name**: Dr. Priya Sharma
- **Department**: Information Technology
- **Designation**: Associate Professor
- **Subjects**: Database Management, Data Warehousing

### Teacher 3
- **Teacher ID**: T003
- **Email**: amit.singh@college.edu
- **Password**: password123
- **Name**: Prof. Amit Singh
- **Department**: Mechanical Engineering
- **Designation**: Assistant Professor
- **Subjects**: Thermodynamics, Heat Transfer

### Teacher 4
- **Teacher ID**: T004
- **Email**: sneha.reddy@college.edu
- **Password**: password123
- **Name**: Dr. Sneha Reddy
- **Department**: Electronics and Communication Engineering
- **Designation**: Professor
- **Subjects**: Digital Signal Processing, Communication Systems

### Teacher 5
- **Teacher ID**: T005
- **Email**: arjun.gupta@college.edu
- **Password**: password123
- **Name**: Prof. Arjun Gupta
- **Department**: Computer Science Engineering
- **Designation**: Assistant Professor
- **Subjects**: Software Engineering, Web Technologies

---

## Clerks

### Clerk 1
- **Employee ID**: CLK001
- **Email**: ramesh.kumar@college.edu
- **Password**: password123
- **Name**: Ramesh Kumar
- **Department**: Admissions
- **Designation**: Senior Clerk

### Clerk 2
- **Employee ID**: CLK002
- **Email**: meera.patel@college.edu
- **Password**: password123
- **Name**: Meera Patel
- **Department**: Administration
- **Designation**: Office Clerk

### Clerk 3
- **Employee ID**: CLK003
- **Email**: suresh.singh@college.edu
- **Password**: password123
- **Name**: Suresh Singh
- **Department**: Accounts
- **Designation**: Accounts Clerk

### Clerk 4
- **Employee ID**: CLK004
- **Email**: kavita.sharma@college.edu
- **Password**: password123
- **Name**: Kavita Sharma
- **Department**: Examination
- **Designation**: Office Clerk

### Clerk 5
- **Employee ID**: CLK005
- **Email**: anil.gupta@college.edu
- **Password**: password123
- **Name**: Anil Gupta
- **Department**: IT Support
- **Designation**: Data Entry Clerk

---

## Quick Login Format

For easy copy-paste during testing:

**Students:**
- STU001 / rahul.sharma@college.edu / password123
- STU002 / priya.patel@college.edu / password123
- STU003 / amit.singh@college.edu / password123
- STU004 / sneha.reddy@college.edu / password123
- STU005 / arjun.gupta@college.edu / password123

**Teachers:**
- T001 / rajesh.verma@college.edu / password123
- T002 / priya.sharma@college.edu / password123
- T003 / amit.singh@college.edu / password123
- T004 / sneha.reddy@college.edu / password123
- T005 / arjun.gupta@college.edu / password123
password123
**Clerks:**
- CLK001 / ramesh.kumar@college.edu / password123
- CLK002 / meera.patel@college.edu / password123
- CLK003 / suresh.singh@college.edu / password123
- CLK004 / kavita.sharma@college.edu / password123
- CLK005 / anil.gupta@college.edu / password123

---

## Notes

1. All passwords are hashed using bcrypt before storing in the database
2. The plaintext password for all test users is: **password123**
3. Students can log in to view their attendance records
4. Teachers can mark attendance and manage their classes
5. Clerks have access to administrative functions based on their department
6. All test data is comprehensive with proper relationships and realistic information

---

## Seeding Commands

To recreate the test data, run these commands in the backend directory:

```bash
npm run seed:students
npm run seed:teachers
npm run seed:clerks

# Or run all at once:
npm run seed:all
```