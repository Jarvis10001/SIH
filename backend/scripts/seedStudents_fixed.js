const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
require('dotenv').config();

const testStudents = [
  {
    name: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      middleName: 'Kumar'
    },
    email: 'rahul.sharma@college.edu',
    studentId: 'STU001',
    year: 2,
    branch: 'Computer Science Engineering',
    semester: 3,
    password: 'password123',
    personalInfo: {
      dateOfBirth: new Date('2003-05-15'),
      gender: 'Male',
      bloodGroup: 'B+',
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
          street: 'Hostel Block A, Room 101',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Rajesh Sharma',
        occupation: 'Engineer',
        phone: '9876543250',
        email: 'rajesh.sharma@email.com',
        annualIncome: 800000
      },
      mother: {
        name: 'Sunita Sharma',
        occupation: 'Teacher',
        phone: '9876543251',
        email: 'sunita.sharma@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-08-01'),
      admissionType: 'Regular',
      rollNumber: 'CS2021001',
      section: 'A',
      cgpa: 8.5,
      previousEducation: {
        tenthGrade: {
          board: 'CBSE',
          school: 'Delhi Public School',
          percentage: 92,
          yearOfPassing: 2019
        },
        twelfthGrade: {
          board: 'CBSE',
          school: 'Delhi Public School',
          percentage: 88,
          yearOfPassing: 2021
        }
      }
    }
  },
  {
    name: {
      firstName: 'Priya',
      lastName: 'Patel',
      middleName: 'Rajesh'
    },
    email: 'priya.patel@college.edu',
    studentId: 'STU002',
    year: 3,
    branch: 'Information Technology',
    semester: 5,
    password: 'password123',
    personalInfo: {
      dateOfBirth: new Date('2002-08-22'),
      gender: 'Female',
      bloodGroup: 'A+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'OBC'
    },
    contact: {
      phone: {
        primary: '9876543212',
        secondary: '9876543213'
      },
      address: {
        permanent: {
          street: '456 Park Avenue',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411001',
          country: 'India'
        },
        current: {
          street: 'Hostel Block B, Room 202',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Rajesh Patel',
        occupation: 'Business',
        phone: '9876543252',
        email: 'rajesh.patel@email.com',
        annualIncome: 1200000
      },
      mother: {
        name: 'Kavita Patel',
        occupation: 'Homemaker',
        phone: '9876543253',
        email: 'kavita.patel@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2020-08-01'),
      admissionType: 'Regular',
      rollNumber: 'IT2020045',
      section: 'B',
      cgpa: 9.1,
      previousEducation: {
        tenthGrade: {
          board: 'GSEB',
          school: 'Kendriya Vidyalaya',
          percentage: 95,
          yearOfPassing: 2018
        },
        twelfthGrade: {
          board: 'GSEB',
          school: 'Kendriya Vidyalaya',
          percentage: 91,
          yearOfPassing: 2020
        }
      }
    }
  },
  {
    name: {
      firstName: 'Amit',
      lastName: 'Singh',
      middleName: 'Kumar'
    },
    email: 'amit.singh@college.edu',
    studentId: 'STU003',
    year: 1,
    branch: 'Mechanical Engineering',
    semester: 2,
    password: 'password123',
    personalInfo: {
      dateOfBirth: new Date('2004-12-10'),
      gender: 'Male',
      bloodGroup: 'O+',
      nationality: 'Indian',
      religion: 'Sikh',
      category: 'General'
    },
    contact: {
      phone: {
        primary: '9876543214',
        secondary: '9876543215'
      },
      address: {
        permanent: {
          street: '789 Gandhi Road',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          country: 'India'
        },
        current: {
          street: 'Hostel Block C, Room 303',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Suresh Singh',
        occupation: 'Government Service',
        phone: '9876543254',
        email: 'suresh.singh@email.com',
        annualIncome: 600000
      },
      mother: {
        name: 'Rekha Singh',
        occupation: 'Nurse',
        phone: '9876543255',
        email: 'rekha.singh@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2022-08-01'),
      admissionType: 'Regular',
      rollNumber: 'ME2022012',
      section: 'A',
      cgpa: 7.8,
      previousEducation: {
        tenthGrade: {
          board: 'CBSE',
          school: 'Sarvodaya Vidyalaya',
          percentage: 85,
          yearOfPassing: 2020
        },
        twelfthGrade: {
          board: 'CBSE',
          school: 'Sarvodaya Vidyalaya',
          percentage: 82,
          yearOfPassing: 2022
        }
      }
    }
  },
  {
    name: {
      firstName: 'Sneha',
      lastName: 'Reddy',
      middleName: 'Lakshmi'
    },
    email: 'sneha.reddy@college.edu',
    studentId: 'STU004',
    year: 4,
    branch: 'Electronics and Communication Engineering',
    semester: 7,
    password: 'password123',
    personalInfo: {
      dateOfBirth: new Date('2001-03-18'),
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
          street: '321 Tech Park',
          city: 'Hyderabad',
          state: 'Telangana',
          pinCode: '500001',
          country: 'India'
        },
        current: {
          street: 'Hostel Block D, Room 404',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Venkat Reddy',
        occupation: 'IT Professional',
        phone: '9876543256',
        email: 'venkat.reddy@email.com',
        annualIncome: 1500000
      },
      mother: {
        name: 'Lakshmi Reddy',
        occupation: 'Doctor',
        phone: '9876543257',
        email: 'lakshmi.reddy@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2019-08-01'),
      admissionType: 'Regular',
      rollNumber: 'EC2019089',
      section: 'A',
      cgpa: 9.3,
      previousEducation: {
        tenthGrade: {
          board: 'State Board',
          school: 'Narayana School',
          percentage: 96,
          yearOfPassing: 2017
        },
        twelfthGrade: {
          board: 'State Board',
          school: 'Narayana Junior College',
          percentage: 94,
          yearOfPassing: 2019
        }
      }
    }
  },
  {
    name: {
      firstName: 'Arjun',
      lastName: 'Gupta',
      middleName: 'Dev'
    },
    email: 'arjun.gupta@college.edu',
    studentId: 'STU005',
    year: 2,
    branch: 'Computer Science Engineering',
    semester: 4,
    password: 'password123',
    personalInfo: {
      dateOfBirth: new Date('2003-07-25'),
      gender: 'Male',
      bloodGroup: 'O-',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'SC'
    },
    contact: {
      phone: {
        primary: '9876543218',
        secondary: '9876543219'
      },
      address: {
        permanent: {
          street: '654 College Street',
          city: 'Kolkata',
          state: 'West Bengal',
          pinCode: '700001',
          country: 'India'
        },
        current: {
          street: 'Hostel Block A, Room 505',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          country: 'India',
          isSameAsPermanent: false
        }
      }
    },
    guardian: {
      father: {
        name: 'Manoj Gupta',
        occupation: 'Small Business',
        phone: '9876543258',
        email: 'manoj.gupta@email.com',
        annualIncome: 400000
      },
      mother: {
        name: 'Sita Gupta',
        occupation: 'Homemaker',
        phone: '9876543259',
        email: 'sita.gupta@email.com'
      }
    },
    academics: {
      admissionDate: new Date('2021-08-01'),
      admissionType: 'Regular',
      rollNumber: 'CS2021067',
      section: 'B',
      cgpa: 8.2,
      previousEducation: {
        tenthGrade: {
          board: 'WBBSE',
          school: 'Government High School',
          percentage: 78,
          yearOfPassing: 2019
        },
        twelfthGrade: {
          board: 'WBCHSE',
          school: 'Government Higher Secondary School',
          percentage: 80,
          yearOfPassing: 2021
        }
      }
    }
  }
];

const seedStudents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-erp');
    console.log('Connected to MongoDB');

    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing students');

    // Hash passwords and insert students
    for (let studentData of testStudents) {
      const hashedPassword = await bcrypt.hash(studentData.password, 12);
      studentData.password = hashedPassword;
    }
    
    // Use insertMany to bypass pre-save middleware and avoid double hashing
    await Student.insertMany(testStudents);
    console.log('All students created successfully!');

    console.log('Student seeding completed successfully!');
    console.log('\n=== TEST STUDENT CREDENTIALS ===');
    testStudents.forEach(student => {
      console.log(`Student ID: ${student.studentId}`);
      console.log(`Email: ${student.email}`);
      console.log(`Password: password123`);
      console.log(`Name: ${student.name.firstName} ${student.name.lastName}`);
      console.log(`Branch: ${student.branch}`);
      console.log(`Year: ${student.year}, Semester: ${student.semester}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedStudents();
}

module.exports = seedStudents;