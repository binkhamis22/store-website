const { dbHelpers } = require('./database');

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user for live deployment...');
    
    // Check if admin already exists
    const existingAdmin = await dbHelpers.findUserByEmail('admin@store.com');
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Password: admin123');
      console.log('   isAdmin:', existingAdmin.isAdmin);
    } else {
      console.log('📝 Creating new admin user...');
      
      // Create admin user
      const adminUser = await dbHelpers.createUser({
        name: 'Admin User',
        email: 'admin@store.com',
        password: 'admin123',
        phone: '123-456-7890'
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@store.com');
      console.log('   Password: admin123');
      console.log('   User ID:', adminUser.id);
    }
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: admin@store.com');
    console.log('   Password: admin123');
    
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  }
}

createAdminUser(); 