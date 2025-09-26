const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const seedDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📂 Connected to MongoDB');
    
    // Create default admin
    const admin = await Admin.createDefaultAdmin();
    
    console.log('\n🎉 Admin seeding completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('🌐 Admin Portal: http://localhost:5173/admin/login');
    console.log('👤 Username: admin');
    console.log('🔐 Password: Admin@123');
    console.log('\n⚠️  Please change the default password after first login for security!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

// Run the seeder if called directly
if (require.main === module) {
  seedDefaultAdmin();
}

module.exports = seedDefaultAdmin;