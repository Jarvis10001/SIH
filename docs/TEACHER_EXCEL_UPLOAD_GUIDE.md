# Teacher Attendance Excel Upload Guide

## Quick Start Guide for Teachers

### 1. Excel Template Options

We provide two template formats for attendance submission:

#### Option A: Simple Format (Recommended)
- **File**: `attendance_simple_template.csv`
- **Structure**: Just Student ID (SID) and Status
- **Best for**: Quick daily attendance marking

#### Option B: Detailed Format
- **File**: `attendance_template.csv` 
- **Structure**: Complete class information per row
- **Best for**: Comprehensive record keeping

### 2. Using the Simple Format (Recommended)

**Download Template**: [attendance_simple_template.csv](./attendance_simple_template.csv)

**Steps**:
1. Fill in the header information (optional but helpful):
   ```
   Date: 2024-09-19
   Class: Computer Science - Section A - Semester 3
   Teacher: Dr. John Smith (TEACH001)
   ```

2. Update the student data:
   ```
   SID,Status
   STU001,Present
   STU002,Absent
   STU003,Late
   ```

3. **Status Options**:
   - `Present` or `P` or `1` or `Yes` or `Y`
   - `Absent` or `A` or `0` or `No` or `N`
   - `Late` or `L`
   - `Excused` or `E`

### 3. Upload Process

1. **Login** to Teacher Dashboard
2. Go to **Attendance** section
3. Click **Upload Excel** button
4. **Fill Class Information**:
   - Subject: e.g., "Computer Science"
   - Subject Code: e.g., "CS101"
   - Class Name: e.g., "CSE-A"
   - Section: e.g., "A"
   - Semester: e.g., "3"
   - Academic Year: e.g., "2024-2025" (format: YYYY-YYYY)
   - Date: Select the attendance date
   - Start Time & End Time: Class duration

5. **Select File**: Choose your filled Excel/CSV file
6. **Click Upload**

### 4. File Requirements

**Supported Formats**:
- Excel: `.xlsx`, `.xls`
- CSV: `.csv`

**File Size**: Maximum 5MB

**Required Columns** (Simple Format):
- `SID`: Student ID (required)
- `Status`: Attendance status (required)

### 5. Common Issues & Solutions

**Issue**: "No data found in uploaded file"
- **Solution**: Ensure SID column exists and has data

**Issue**: "Missing Student ID"
- **Solution**: Check that SID column is properly filled

**Issue**: "Invalid file type"
- **Solution**: Use only .xlsx, .xls, or .csv files

**Issue**: "Attendance already exists"
- **Solution**: The system found existing attendance for this class/date. Edit existing record instead.

### 6. Status Validation

The system automatically converts these values:

| What You Type | System Saves |
|---------------|--------------|
| P, Present, present, 1, YES, Yes, Y | Present |
| A, Absent, absent, 0, NO, No, N | Absent |
| L, Late, late | Late |
| E, Excused, excused | Excused |
| *Anything else* | Absent (default) |

### 7. Sample Excel Content

```csv
Date: 2024-09-19
Subject: Mathematics

SID,Status
21001,Present
21002,Absent
21003,P
21004,A
21005,Late
21006,1
21007,0
21008,Excused
```

### 8. Tips for Success

✅ **Do's**:
- Keep Student IDs consistent with your class roster
- Use clear status values (Present, Absent, Late, Excused)
- Save files in CSV format for best compatibility
- Include date information in the file header

❌ **Don'ts**:
- Don't modify column headers in templates
- Don't use special characters in Student IDs
- Don't upload files larger than 5MB
- Don't submit attendance for the same class/date twice

### 9. Download Templates

- **Simple Template**: [attendance_simple_template.csv](./attendance_simple_template.csv)
- **Blank Template**: [attendance_template_blank.csv](./attendance_template_blank.csv)
- **With Instructions**: [ATTENDANCE_TEMPLATE_INSTRUCTIONS.md](./ATTENDANCE_TEMPLATE_INSTRUCTIONS.md)

### 10. Need Help?

Contact IT Support or refer to the Teacher Dashboard help section.

---

**Last Updated**: September 19, 2025
**Version**: 1.0