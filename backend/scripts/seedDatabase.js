const mongoose = require('mongoose');
const User = require('../models/UserMongo');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sih_backend');
    console.log('Connected to MongoDB');

    // Clear existing users (optional - remove in production)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create sample users
    const sampleUsers = [
      {
        name: 'Admin User',
        email: 'admin@sih.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          phone: '+1234567890',
          address: {
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India'
          }
        }
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        profile: {
          phone: '+1234567891'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'teacher',
        profile: {
          phone: '+1234567892'
        }
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'student',
        profile: {
          phone: '+1234567893'
        }
      }
    ];

    // Insert sample users
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} sample users`);

    // Print created users (without passwords)
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSample credentials:');
    console.log('Admin: admin@sih.com / admin123');
    console.log('User: john@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;