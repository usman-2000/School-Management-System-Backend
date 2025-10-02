const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Role = require('./Role');  // assuming you have a Role model

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  qualification: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  subjectSpecialization: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18, // assuming min teacher age
    },
  },
  hireDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  resignDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'teachers',
  timestamps: true,    // enables createdAt + updatedAt
  underscored: true,   // maps to created_at, updated_at
});

// Associations
Teacher.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
});

module.exports = Teacher;
