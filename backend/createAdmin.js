const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

// Get database URL from environment or command line
const databaseUrl = process.argv[2] || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not provided!');
  console.log('\nUsage:');
  console.log('  node createAdmin.js <DATABASE_URL> [name] [email] [password]');
  console.log('\nOr set DATABASE_URL in .env file and run:');
  console.log('  node createAdmin.js [name] [email] [password]');
  console.log('\nExample:');
  console.log('  node createAdmin.js "postgresql://user:pass@host:5432/dbname" "Admin" "admin@example.com" "admin123"');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
});

async function createAdmin() {
  // Parse arguments - if DATABASE_URL was provided as first arg, shift the rest
  let name, email, password;
  
  if (process.argv[2] && process.argv[2].startsWith('postgresql://')) {
    // DATABASE_URL provided as first argument
    name = process.argv[3] || 'Admin';
    email = process.argv[4] || 'admin@example.com';
    password = process.argv[5] || 'admin123';
  } else {
    // DATABASE_URL from environment
    name = process.argv[2] || 'Admin';
    email = process.argv[3] || 'admin@example.com';
    password = process.argv[4] || 'admin123';
  }

  try {
    console.log('🔌 Connecting to database...');
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id, email FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingAdmin.rows.length > 0) {
      console.log('❌ Admin with this email already exists!');
      console.log('   Email:', existingAdmin.rows[0].email);
      console.log('   ID:', existingAdmin.rows[0].id);
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    console.log('👤 Creating admin account...');
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, 'admin']
    );

    const admin = result.rows[0];
    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', admin.email);
    console.log('👤 Name:     ', admin.name);
    console.log('🔑 Password: ', password);
    console.log('🆔 User ID:  ', admin.id);
    console.log('👑 Role:     ', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now log in with these credentials!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Could not connect to database. Check your DATABASE_URL.');
    } else if (error.code === '28P01') {
      console.error('   Authentication failed. Check your database credentials.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   Could not resolve database hostname. Check your DATABASE_URL.');
    }
    await pool.end();
    process.exit(1);
  }
}

createAdmin();

