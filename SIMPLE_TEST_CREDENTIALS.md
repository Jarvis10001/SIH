# Simple Test Credentials for Manual Testing

## 🎯 Quick Reference

Since the database models have strict validation requirements, here are simple test credentials you can use to manually create users for testing the student attendance page.

---

## 🔑 Basic Test Accounts

### Student Account (for testing attendance view)
```
Student ID: STU001
Email: student@test.com
Password: test123
Name: Test Student
Branch: Computer Science Engineering
Year: 3
Semester: 5
```

### Teacher Account (for creating attendance records)
```
Teacher ID: TEACH001  
Email: teacher@test.com
Password: test123
Name: Test Teacher
Department: Computer Science
```

### Clerk Account (for admin operations)
```
Clerk ID: CLERK001
Email: clerk@test.com  
Password: test123
Name: Test Clerk
```

---

## 🛠️ Manual Database Setup

Since the automatic seeding failed due to strict model validation, you can:

### Option 1: Use Registration Forms
1. **Start the frontend and backend servers**
2. **Register through the UI** using the signup forms
3. **Use the credentials above** when registering

### Option 2: Simplified Database Entry
You can manually insert basic records into MongoDB:

```javascript
// Student Record (minimal required fields)
{
  "studentId": "STU001",
  "name": {
    "firstName": "Test",
    "lastName": "Student"
  },
  "email": "student@test.com",
  "password": "$2a$10$hashedpassword", // Use bcrypt to hash 'test123'
  "year": 3,
  "branch": "Computer Science Engineering", 
  "semester": 5,
  "personalInfo": {
    "dateOfBirth": "2001-01-01",
    "gender": "Male",
    "nationality": "Indian",
    "category": "General"
  },
  "contact": {
    "phone": {
      "primary": "9876543210"
    },
    "address": {
      "permanent": {
        "street": "Test Street",
        "city": "Test City", 
        "state": "Test State",
        "pinCode": "123456"
      }
    }
  },
  "guardian": {
    "father": {
      "name": "Test Father"
    },
    "mother": {
      "name": "Test Mother"  
    }
  },
  "academics": {
    "admissionDate": "2021-08-01",
    "admissionType": "Regular"
  }
}
```

---

## 🎯 Testing the Student Attendance Page

### Step 1: Setup
1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd front && npm run dev`

### Step 2: Create Test User
1. **Register a student** using the signup form with above credentials
2. **Or use existing registration** if available

### Step 3: Test Login & Attendance
1. **Login** as student with: `student@test.com / test123`
2. **Navigate** to Dashboard → Attendance
3. **Verify** the page loads correctly (even if no attendance records exist)

### Step 4: Add Test Attendance (Optional)
1. **Login as teacher** to create attendance records
2. **Or manually insert** attendance records in MongoDB
3. **Refresh student dashboard** to see attendance data

---

## 📊 Expected Behavior

### When No Attendance Records Exist:
- ✅ Page loads without errors
- ✅ Shows "No attendance records found" message  
- ✅ Statistics show 0% attendance
- ✅ Filters work correctly
- ✅ Refresh button functions

### When Attendance Records Exist:
- ✅ Shows attendance records in table
- ✅ Displays statistics correctly
- ✅ Subject-wise breakdown works
- ✅ View details modal functions
- ✅ Filters apply correctly

---

## 🚀 Testing Features

### Core Functionality:
1. **Student Authentication** - Login/logout works
2. **Attendance Display** - Table shows records
3. **Statistics Calculation** - Percentages are correct
4. **Filtering** - Date, subject, semester filters
5. **Modal Views** - Detail popup works
6. **Responsive Design** - Mobile/desktop layouts

### API Endpoints to Test:
- `GET /api/attendance/student/:studentId` - Fetch student attendance
- `GET /api/auth/me` - Verify student authentication
- `POST /api/auth/login` - Student login

---

## 🔧 Troubleshooting

### Login Issues:
- Verify user exists in database
- Check password is correctly hashed
- Ensure JWT secret is configured

### Attendance Page Issues:
- Check browser console for errors
- Verify API endpoints are responding
- Check student ID is correctly stored in localStorage

### Database Issues:
- Ensure MongoDB is running
- Check connection string in .env
- Verify required fields are populated

---

## 💡 Quick Test Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/test
```

### Check if frontend is running:
```bash
curl http://localhost:3000
```

### Test student login API:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"test123"}'
```

---

*Use these simplified credentials to test the student attendance functionality while the automatic seeding is being fixed.*