const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

const seedStudents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sih_backend');
    console.log('Connected to MongoDB');

    // Clear existing students (optional - remove in production)
    await Student.deleteMany({});
    console.log('Cleared existing students');

    // Create sample students
    const sampleStudents = [
      {
        name: {
          firstName: 'Rahul',
          lastName: 'Sharma',
          middleName: 'Kumar'
        },
        email: 'rahul.sharma@college.edu',
        studentId: 'CS2024001',
        year: 2,
        branch: 'Computer Science Engineering',
        semester: 4,
        password: 'student123',
        personalInfo: {
          dateOfBirth: new Date('2002-05-15'),
          gender: 'Male',
          bloodGroup: 'O+',
          nationality: 'Indian',
          category: 'General'
        },
        contact: {
          phone: {
            primary: '+919876543210',
            secondary: '+918765432109'
          },
          address: {
            permanent: {
              street: '123 Main Street',
              city: 'New Delhi',
              state: 'Delhi',
              pinCode: '110001',
              country: 'India'
            },
            current: {
              street: '456 College Hostel',
              city: 'New Delhi',
              state: 'Delhi',
              pinCode: '110002',
              country: 'India',
              isSameAsPermanent: false
            }
          }
        },
        guardian: {
          father: {
            name: 'Suresh Sharma',
            occupation: 'Engineer',
            phone: '+919876543211',
            email: 'suresh.sharma@email.com',
            annualIncome: 800000
          },
          mother: {
            name: 'Priya Sharma',
            occupation: 'Teacher',
            phone: '+919876543212',
            email: 'priya.sharma@email.com'
          }
        },
        academics: {
          admissionDate: new Date('2022-08-01'),
          admissionType: 'Regular',
          section: 'A',
          cgpa: 8.5,
          previousEducation: {
            tenthGrade: {
              board: 'CBSE',
              school: 'Delhi Public School',
              percentage: 92,
              yearOfPassing: 2020
            },
            twelfthGrade: {
              board: 'CBSE',
              school: 'Delhi Public School',
              percentage: 88,
              yearOfPassing: 2022
            }
          }
        },
        fees: {
          totalFees: 150000,
          paidAmount: 100000,
          pendingAmount: 50000
        },
        hostel: {
          isHostelStudent: true,
          hostelName: 'Boys Hostel A',
          roomNumber: '201',
          floorNumber: 2
        }
      },
      {
        name: {
          firstName: 'Priya',
          lastName: 'Patel'
        },
        email: 'priya.patel@college.edu',
        studentId: 'IT2024002',
        year: 3,
        branch: 'Information Technology',
        semester: 6,
        password: 'student123',
        personalInfo: {
          dateOfBirth: new Date('2001-12-20'),
          gender: 'Female',
          bloodGroup: 'A+',
          nationality: 'Indian',
          category: 'OBC'
        },
        contact: {
          phone: {
            primary: '+919876543213'
          },
          address: {
            permanent: {
              street: '789 Gandhi Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              pinCode: '400001',
              country: 'India'
            },
            current: {
              isSameAsPermanent: true
            }
          }
        },
        guardian: {
          father: {
            name: 'Amit Patel',
            occupation: 'Business Owner',
            phone: '+919876543214',
            annualIncome: 1200000
          },
          mother: {
            name: 'Sunita Patel',
            occupation: 'Homemaker',
            phone: '+919876543215'
          }
        },
        academics: {
          admissionDate: new Date('2021-08-01'),
          admissionType: 'Regular',
          section: 'B',
          cgpa: 9.2,
          previousEducation: {
            tenthGrade: {
              board: 'Maharashtra State Board',
              school: 'Vidya Mandir',
              percentage: 95,
              yearOfPassing: 2019
            },
            twelfthGrade: {
              board: 'Maharashtra State Board',
              school: 'Vidya Mandir',
              percentage: 91,
              yearOfPassing: 2021
            }
          }
        },
        fees: {
          totalFees: 150000,
          paidAmount: 150000,
          pendingAmount: 0
        },
        hostel: {
          isHostelStudent: false
        },
        transport: {
          usesTransport: true,
          routeNumber: 'R-15',
          stopName: 'Bandra Station'
        }
      },
      {
        name: {
          firstName: 'Arjun',
          lastName: 'Singh'
        },
        email: 'arjun.singh@college.edu',
        studentId: 'ECE2024003',
        year: 1,
        branch: 'Electronics and Communication Engineering',
        semester: 2,
        password: 'student123',
        personalInfo: {
          dateOfBirth: new Date('2003-08-10'),
          gender: 'Male',
          bloodGroup: 'B+',
          nationality: 'Indian',
          category: 'General'
        },
        contact: {
          phone: {
            primary: '+919876543216'
          },
          address: {
            permanent: {
              street: '321 Park Avenue',
              city: 'Bangalore',
              state: 'Karnataka',
              pinCode: '560001',
              country: 'India'
            },
            current: {
              street: '654 College Campus',
              city: 'New Delhi',
              state: 'Delhi',
              pinCode: '110003',
              country: 'India',
              isSameAsPermanent: false
            }
          }
        },
        guardian: {
          father: {
            name: 'Vikram Singh',
            occupation: 'Software Engineer',
            phone: '+919876543217',
            annualIncome: 1500000
          },
          mother: {
            name: 'Kavita Singh',
            occupation: 'Doctor',
            phone: '+919876543218'
          }
        },
        academics: {
          admissionDate: new Date('2023-08-01'),
          admissionType: 'Regular',
          section: 'A',
          cgpa: 7.8,
          previousEducation: {
            tenthGrade: {
              board: 'ICSE',
              school: 'St. Josephs School',
              percentage: 89,
              yearOfPassing: 2021
            },
            twelfthGrade: {
              board: 'ISC',
              school: 'St. Josephs School',
              percentage: 85,
              yearOfPassing: 2023
            }
          }
        },
        fees: {
          totalFees: 150000,
          paidAmount: 75000,
          pendingAmount: 75000
        },
        hostel: {
          isHostelStudent: true,
          hostelName: 'Boys Hostel B',
          roomNumber: '105',
          floorNumber: 1
        }
      },
      {
        name: {
          firstName: 'Sneha',
          lastName: 'Gupta'
        },
        email: 'sneha.gupta@college.edu',
        studentId: 'ME2024004',
        year: 4,
        branch: 'Mechanical Engineering',
        semester: 8,
        password: 'student123',
        personalInfo: {
          dateOfBirth: new Date('2000-03-25'),
          gender: 'Female',
          bloodGroup: 'AB+',
          nationality: 'Indian',
          category: 'SC'
        },
        contact: {
          phone: {
            primary: '+919876543219'
          },
          address: {
            permanent: {
              street: '147 Nehru Colony',
              city: 'Jaipur',
              state: 'Rajasthan',
              pinCode: '302001',
              country: 'India'
            },
            current: {
              isSameAsPermanent: true
            }
          }
        },
        guardian: {
          father: {
            name: 'Rajesh Gupta',
            occupation: 'Government Employee',
            phone: '+919876543220',
            annualIncome: 600000
          },
          mother: {
            name: 'Meera Gupta',
            occupation: 'School Principal',
            phone: '+919876543221'
          }
        },
        academics: {
          admissionDate: new Date('2020-08-01'),
          admissionType: 'Regular',
          section: 'A',
          cgpa: 8.9,
          previousEducation: {
            tenthGrade: {
              board: 'RBSE',
              school: 'Govt. Sr. Sec School',
              percentage: 87,
              yearOfPassing: 2018
            },
            twelfthGrade: {
              board: 'RBSE',
              school: 'Govt. Sr. Sec School',
              percentage: 84,
              yearOfPassing: 2020
            }
          }
        },
        fees: {
          totalFees: 120000, // Different fee structure for SC category
          paidAmount: 120000,
          pendingAmount: 0
        },
        hostel: {
          isHostelStudent: false
        },
        transport: {
          usesTransport: true,
          routeNumber: 'R-08',
          stopName: 'Malviya Nagar'
        }
      }
    ];

    // Insert sample students
    const students = await Student.create(sampleStudents);
    console.log(`Created ${students.length} sample students`);

    // Print created students
    students.forEach(student => {
      console.log(`- ${student.getFullName()} (${student.studentId}) - ${student.branch} Year ${student.year}`);
    });

    console.log('\n✅ Student database seeding completed successfully!');
    console.log('\nSample credentials:');
    console.log('Student ID: CS2024001 / Password: student123');
    console.log('Student ID: IT2024002 / Password: student123');
    console.log('Student ID: ECE2024003 / Password: student123');
    console.log('Student ID: ME2024004 / Password: student123');
    
  } catch (error) {
    console.error('❌ Error seeding student database:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedStudents();
}

module.exports = seedStudents;