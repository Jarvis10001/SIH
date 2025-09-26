const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
require('dotenv').config();

const newStudentsData = [
  // Computer Science Students (Semester 5 - Section A)
  {
    studentId: 'STU001',
    email: 'rahul.sharma@student.college.edu',
    password: 'student123',
    name: {
      firstName: 'Rahul',
      lastName: 'Sharma'
    },
    year: 3,
    semester: 5,
    branch: 'Computer Science Engineering',
    personalInfo: {
      dateOfBirth: new Date('2003-05-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543210',
        secondary: '9876543211'
      },
      address: {
        permanent: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India'
        },
        current: {
          street: '456 College Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400002',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Mr. Suresh Sharma',
        occupation: 'Engineer',
        phone: '9876543201',
        email: 'suresh.sharma@email.com',
        annualIncome: 800000
      },
      mother: {
        name: 'Mrs. Sunita Sharma',
        occupation: 'Teacher',
        phone: '9876543202',
        email: 'sunita.sharma@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-07-01'),
      admissionType: 'Regular',
      rollNumber: 'CS21001',
      section: 'A',
      cgpa: 8.5,
      courseDuration: 4
    },
    status: {
      isActive: true,
      accountStatus: 'Active'
    }
  },
  {
    studentId: 'STU002',
    email: 'priya.patel@student.college.edu',
    password: 'student123',
    name: {
      firstName: 'Priya',
      lastName: 'Patel'
    },
    year: 3,
    semester: 5,
    branch: 'Computer Science Engineering',
    personalInfo: {
      dateOfBirth: new Date('2003-08-22'),
      gender: 'Female',
      bloodGroup: 'A+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543212',
        secondary: '9876543213'
      },
      address: {
        permanent: {
          street: '789 Garden Street',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411001',
          country: 'India'
        },
        current: {
          street: '456 College Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400002',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Mr. Rajesh Patel',
        occupation: 'Business',
        phone: '9876543203',
        email: 'rajesh.patel@email.com',
        annualIncome: 900000
      },
      mother: {
        name: 'Mrs. Meera Patel',
        occupation: 'Homemaker',
        phone: '9876543204',
        email: 'meera.patel@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-07-01'),
      admissionType: 'Regular',
      rollNumber: 'CS21002',
      section: 'A',
      cgpa: 9.0,
      courseDuration: 4
    },
    status: {
      isActive: true,
      accountStatus: 'Active'
    }
  },
  {
    studentId: 'STU003',
    email: 'arjun.kumar@student.college.edu',
    password: 'student123',
    name: {
      firstName: 'Arjun',
      lastName: 'Kumar'
    },
    year: 3,
    semester: 5,
    branch: 'Computer Science Engineering',
    personalInfo: {
      dateOfBirth: new Date('2003-12-10'),
      gender: 'Male',
      bloodGroup: 'B+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543214',
        secondary: '9876543215'
      },
      address: {
        permanent: {
          street: '321 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          country: 'India'
        },
        current: {
          street: '456 College Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400002',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Mr. Vikas Kumar',
        occupation: 'Government Service',
        phone: '9876543205',
        email: 'vikas.kumar@email.com',
        annualIncome: 750000
      },
      mother: {
        name: 'Mrs. Priya Kumar',
        occupation: 'Nurse',
        phone: '9876543206',
        email: 'priya.kumar@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-07-01'),
      admissionType: 'Regular',
      rollNumber: 'CS21003',
      section: 'A',
      cgpa: 8.2,
      courseDuration: 4
    },
    status: {
      isActive: true,
      accountStatus: 'Active'
    }
  },
  {
    studentId: 'STU004',
    email: 'sneha.singh@student.college.edu',
    password: 'student123',
    name: {
      firstName: 'Sneha',
      lastName: 'Singh'
    },
    year: 3,
    semester: 5,
    branch: 'Computer Science Engineering',
    personalInfo: {
      dateOfBirth: new Date('2003-03-18'),
      gender: 'Female',
      bloodGroup: 'AB+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543216',
        secondary: '9876543217'
      },
      address: {
        permanent: {
          street: '654 Hill Station',
          city: 'Bangalore',
          state: 'Karnataka',
          pinCode: '560001',
          country: 'India'
        },
        current: {
          street: '456 College Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400002',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Mr. Ravi Singh',
        occupation: 'Doctor',
        phone: '9876543207',
        email: 'ravi.singh@email.com',
        annualIncome: 1200000
      },
      mother: {
        name: 'Mrs. Kavita Singh',
        occupation: 'Professor',
        phone: '9876543208',
        email: 'kavita.singh@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-07-01'),
      admissionType: 'Regular',
      rollNumber: 'CS21004',
      section: 'A',
      cgpa: 8.8,
      courseDuration: 4
    },
    status: {
      isActive: true,
      accountStatus: 'Active'
    }
  },
  {
    studentId: 'STU005',
    email: 'vikram.mehta@student.college.edu',
    password: 'student123',
    name: {
      firstName: 'Vikram',
      lastName: 'Mehta'
    },
    year: 3,
    semester: 5,
    branch: 'Computer Science Engineering',
    personalInfo: {
      dateOfBirth: new Date('2003-11-05'),
      gender: 'Male',
      bloodGroup: 'O-',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543218',
        secondary: '9876543219'
      },
      address: {
        permanent: {
          street: '987 Business District',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pinCode: '600001',
          country: 'India'
        },
        current: {
          street: '456 College Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400002',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Mr. Anil Mehta',
        occupation: 'Businessman',
        phone: '9876543209',
        email: 'anil.mehta@email.com',
        annualIncome: 1500000
      },
      mother: {
        name: 'Mrs. Rashmi Mehta',
        occupation: 'Chartered Accountant',
        phone: '9876543210',
        email: 'rashmi.mehta@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-07-01'),
      admissionType: 'Regular',
      rollNumber: 'CS21005',
      section: 'A',
      cgpa: 8.7,
      courseDuration: 4
    },
    status: {
      isActive: true,
      accountStatus: 'Active'
    }
  }
];

const seedStudents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing students');

    // Hash passwords manually for all students before bulk insert
    const studentsWithHashedPasswords = [];
    
    for (let studentData of newStudentsData) {
      // Hash password
      const hashedPassword = await bcrypt.hash(studentData.password, 12);
      studentData.password = hashedPassword;
      studentsWithHashedPasswords.push(studentData);
    }

    // Use insertMany to bypass pre-save middleware and avoid double hashing
    const createdStudents = await Student.insertMany(studentsWithHashedPasswords);
    console.log(`Created ${createdStudents.length} students successfully!`);

    console.log('Student seeding completed successfully!');
    console.log('\n=== NEW STUDENT CREDENTIALS ===');
    
    for (const student of newStudentsData) {
      console.log(`Student ID: ${student.studentId}`);
      console.log(`Email: ${student.email}`);
      console.log(`Password: student123`); // Original password before hashing
      console.log(`Name: ${student.name.firstName} ${student.name.lastName}`);
      console.log(`Branch: ${student.branch}, Section: ${student.section}`);
      console.log(`Roll Number: ${student.academics.rollNumber}`);
      console.log('---');
    }

  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedStudents();