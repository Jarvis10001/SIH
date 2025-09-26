const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'password123';
  const hash = '$2b$10$IrdK1dOLEkI.1.TKsiEU/OjOoDM6A/au9kFACGtgZMo2JNCP/TBcK';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Match result:', isMatch);
  
  // Generate a new hash for comparison
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash for same password:', newHash);
  
  const newMatch = await bcrypt.compare(password, newHash);
  console.log('Match with new hash:', newMatch);
}

testPassword();