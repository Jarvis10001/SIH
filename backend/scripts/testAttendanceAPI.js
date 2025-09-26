const axios = require('axios');

const testAttendanceAPI = async () => {
  try {
    console.log('=== TESTING ATTENDANCE API FOR RAJU ===');
    
    // First, try to login as Raju to get authentication token
    console.log('\n1. Testing student login...');
    
    const loginData = {
      email: 'raju@gmail.com',
      password: 'student123'
    };
    
    let authToken = null;
    
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/students/login', loginData);
      
      if (loginResponse.data.success) {
        authToken = loginResponse.data.data.token;
        console.log('✅ Login successful!');
        
        if (loginResponse.data.data.student) {
          console.log(`Student ID: ${loginResponse.data.data.student.studentId}`);
          console.log(`Name: ${loginResponse.data.data.student.name.firstName} ${loginResponse.data.data.student.name.lastName}`);
        } else {
          console.log('No student object in response');
        }
      } else {
        console.log('❌ Login failed:', loginResponse.data.message);
      }
    } catch (loginError) {
      console.log('❌ Login error:', loginError.response?.data?.message || loginError.message);
      
      // Let's check what the student login endpoint expects
      console.log('\n🔍 Checking student login endpoint...');
      console.log('Request data:', JSON.stringify(loginData, null, 2));
    }
    
    // Test different login methods if email fails
    if (!authToken) {
      console.log('\n2. Trying login with studentId...');
      try {
        const loginDataById = {
          studentId: 'STU021',
          password: 'student123'
        };
        
        const loginResponse = await axios.post('http://localhost:5000/api/students/login', loginDataById);
        if (loginResponse.data.success) {
          authToken = loginResponse.data.data.token;
          console.log('✅ Login with studentId successful!');
        }
      } catch (error) {
        console.log('❌ Login with studentId failed:', error.response?.data?.message || error.message);
      }
    }
    
    if (!authToken) {
      console.log('\n3. Trying login with rollNumber...');
      try {
        const loginDataByRoll = {
          rollNumber: 'CS21021',
          password: 'student123'
        };
        
        const loginResponse = await axios.post('http://localhost:5000/api/students/login', loginDataByRoll);
        if (loginResponse.data.success) {
          authToken = loginResponse.data.data.token;
          console.log('✅ Login with rollNumber successful!');
        }
      } catch (error) {
        console.log('❌ Login with rollNumber failed:', error.response?.data?.message || error.message);
      }
    }
    
    // If we have an auth token, test the attendance API
    if (authToken) {
      console.log('\n4. Testing attendance API...');
      
      try {
        const attendanceResponse = await axios.get('http://localhost:5000/api/attendance/student/STU021', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (attendanceResponse.data.success) {
          console.log('✅ Attendance API successful!');
          console.log(`Found ${attendanceResponse.data.count} attendance records`);
          
          if (attendanceResponse.data.data.length > 0) {
            console.log('\n📊 Attendance Records:');
            attendanceResponse.data.data.forEach((record, index) => {
              console.log(`${index + 1}. ${record.date.split('T')[0]} - ${record.classInfo.subject}: ${record.attendance.status}`);
            });
          } else {
            console.log('⚠️  No attendance records found');
          }
        } else {
          console.log('❌ Attendance API failed:', attendanceResponse.data.message);
        }
      } catch (attendanceError) {
        console.log('❌ Attendance API error:', attendanceError.response?.data?.message || attendanceError.message);
      }
    } else {
      console.log('\n❌ Cannot test attendance API without authentication token');
      
      // Let's see what endpoints are available
      console.log('\n🔍 Let\'s check what routes are available...');
      try {
        const healthCheck = await axios.get('http://localhost:5000/api/health');
        console.log('✅ Server is running');
      } catch (error) {
        console.log('❌ Server might not be running:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};

testAttendanceAPI();