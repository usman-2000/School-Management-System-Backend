// test-db.js
const { sequelize, connectDB } = require('./src/config/database');

const testConnection = async () => {
  try {
    await connectDB();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('✅ Query test successful:', results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

testConnection();