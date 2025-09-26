const axios = require('axios');

const testFrontendAPI = async () => {
  try {
    console.log('=== TESTING FRONTEND API CALLS ===');
    
    // First, login as Raju to get the token and user data structure
    console.log('\n1. Logging in as Raju...');
    
    const loginData = {
      email: 'raju@gmail.com',
      password: 'student123'
    };
    
    const loginResponse = await axios.post('http://localhost:5000/api/students/login', loginData);
    
    if (loginResponse.data.success) {
      const userData = loginResponse.data.data.student;
      const token = loginResponse.data.data.token;
      
      console.log('✅ Login successful!');
      console.log('User data structure:', JSON.stringify(userData, null, 2));
      
      // Simulate what frontend stores in localStorage
      const storedUser = userData; // This is what gets stored as 'user'
      const storedToken = token;   // This is what gets stored as 'token'
      
      console.log('\n2. Extracting studentId like frontend does...');
      const studentId = storedUser.studentId || storedUser.id || 'STU001';
      console.log(`Extracted studentId: ${studentId}`);
      
      // Test the attendance API call with different academic year formats
      console.log('\n3. Testing attendance API with different academic years...');
      
      const academicYears = ['2024-25', '2024-2025'];
      
      for (const academicYear of academicYears) {
        console.log(`\nTesting with academic year: ${academicYear}`);
        
        const queryParams = new URLSearchParams();
        queryParams.append('academicYear', academicYear);
        
        try {
          const attendanceResponse = await axios.get(
            `http://localhost:5000/api/attendance/student/${studentId}?${queryParams}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (attendanceResponse.data.success) {
            console.log(`✅ Success! Found ${attendanceResponse.data.count} records`);
            if (attendanceResponse.data.data.length > 0) {
              console.log('Sample record:', JSON.stringify(attendanceResponse.data.data[0], null, 2));
            }
          } else {
            console.log(`❌ Failed: ${attendanceResponse.data.message}`);
          }
        } catch (error) {
          console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
        }
      }
      
      // Test without any filters
      console.log('\n4. Testing without academic year filter...');
      try {
        const attendanceResponse = await axios.get(
          `http://localhost:5000/api/attendance/student/${studentId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (attendanceResponse.data.success) {
          console.log(`✅ Success! Found ${attendanceResponse.data.count} records without filter`);
          
          // Analyze the data structure
          if (attendanceResponse.data.data.length > 0) {
            const sampleRecord = attendanceResponse.data.data[0];
            console.log('\nSample record structure:');
            console.log('- classInfo.academicYear:', sampleRecord.classInfo.academicYear);
            console.log('- attendance.status:', sampleRecord.attendance?.status);
            console.log('- date:', sampleRecord.date);
          }
          
          // Calculate statistics like frontend does
          const records = attendanceResponse.data.data;
          const totalClasses = records.length;
          const attendedClasses = records.filter(record => 
            record.attendance && ['Present', 'Late'].includes(record.attendance.status)
          ).length;
          const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
          
          console.log('\n📊 Frontend-like calculation:');
          console.log(`Total Classes: ${totalClasses}`);
          console.log(`Attended Classes: ${attendedClasses}`);
          console.log(`Overall Percentage: ${overallPercentage}%`);
          
        } else {
          console.log(`❌ Failed: ${attendanceResponse.data.message}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};

testFrontendAPI();