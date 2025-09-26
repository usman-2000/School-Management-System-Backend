const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: require("sequelize").DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    username: {
    type: require("sequelize").DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true,
        len: [3, 50],
    },
  },
  email: {
    type: require("sequelize").DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    },
    password: { 
    type: require("sequelize").DataTypes.STRING,
    allowNull: false,
    validate: {
        notEmpty: true,
        len: [6, 100],
    },
    },
    role: {
    type: require("sequelize").DataTypes.ENUM("admin", "teacher", "student"),
    allowNull: false,
    defaultValue: "student",
    },
}, {
  tableName: "users",
});


module.exports = User;

// Ensure the model is synced with the database
User.sync({ alter: process.env.NODE_ENV === 'development' });
// In development, use 'alter' to update the table structure without dropping it

// In production, consider using migrations for schema changes
// User.sync(); // Uncomment this line for production use, but be cautious as it may drop existing data
// User.sync({ force: true }); // Use with caution: this will drop the table if it exists
// and recreate it, leading to data loss.
// Always back up your data before running such operations in a production environment.
// For production, it's recommended to use a migration tool like Sequelize CLI or Umzug
// to manage schema changes safely.
// This ensures that the model is in sync with the database schema.
// Always back up your data before running such operations in a production environment.
// For production, it's recommended to use a migration tool like Sequelize CLI or Umzug
// to manage schema changes safely.
