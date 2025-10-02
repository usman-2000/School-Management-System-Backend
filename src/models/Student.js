const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'teacher', 'student', 'parent'),
    allowNull: false,
    defaultValue: 'student',
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  guardianName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guardianPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guardianEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  medicalConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated', 'transferred'),
    defaultValue: 'active',
  },
});

module.exports = Student;