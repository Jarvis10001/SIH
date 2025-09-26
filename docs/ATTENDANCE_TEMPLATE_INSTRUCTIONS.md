# Student Attendance Excel Template

## Instructions for Teachers

1. **Download this template** and save it with a descriptive name (e.g., "CS101_Attendance_2024-09-19.csv")
2. **Fill in the class information** (same for all rows in one session):
   - Subject: Full subject name
   - Subject Code: Course code (e.g., CS101, MATH201)
   - Class Name: Class designation (e.g., CSE-A, ECE-B)
   - Section: Section letter (A, B, C, etc.)
   - Semester: Number from 1-8
   - Academic Year: Format YYYY-YYYY (e.g., 2024-2025)
   - Date: YYYY-MM-DD format
   - Start Time & End Time: HH:MM format (24-hour)
   - Teacher ID: Your teacher ID (e.g., TEACH001)
   - Teacher Name: Your full name

3. **For each student**, add a new row with:
   - Student ID: Student's unique ID
   - Student Name: Full name
   - Roll Number: Class roll number
   - Status: Must be one of: Present, Absent, Late, Excused
   - Remarks: Optional notes (max 200 characters)

4. **Upload the completed file** through the Teacher Dashboard → Attendance → Upload Excel

## Sample Data (Replace with actual student data)

Subject,Subject Code,Class Name,Section,Semester,Academic Year,Date,Start Time,End Time,Teacher ID,Teacher Name,Student ID,Student Name,Roll Number,Status,Remarks
Mathematics,MATH201,CSE-A,A,3,2024-2025,2024-09-19,09:00,10:00,TEACH001,Dr. John Smith,STU001,Rahul Kumar,21001,Present,
Mathematics,MATH201,CSE-A,A,3,2024-2025,2024-09-19,09:00,10:00,TEACH001,Dr. John Smith,STU002,Priya Singh,21002,Absent,Medical leave
Mathematics,MATH201,CSE-A,A,3,2024-2025,2024-09-19,09:00,10:00,TEACH001,Dr. John Smith,STU003,Amit Sharma,21003,Present,
Mathematics,MATH201,CSE-A,A,3,2024-2025,2024-09-19,09:00,10:00,TEACH001,Dr. John Smith,STU004,Neha Patel,21004,Late,Traffic delay
Mathematics,MATH201,CSE-A,A,3,2024-2025,2024-09-19,09:00,10:00,TEACH001,Dr. John Smith,STU005,Vikash Gupta,21005,Excused,College event

## Important Notes

- All fields are required except Remarks
- Status must be exactly: Present, Absent, Late, or Excused (case-sensitive)
- Date format: YYYY-MM-DD
- Time format: HH:MM (24-hour format)
- Academic Year format: YYYY-YYYY
- Do not modify the header row
- Save as CSV format for upload