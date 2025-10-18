const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Teacher = require('./Teacher');

const Salary = sequelize.define('Salary', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'pending'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'salary',
  timestamps: true,   // adds created_at & updated_at
  underscored: true,
});

// Associations
Salary.belongsTo(Teacher, {
  foreignKey: {
    name: 'teacher_id',
    allowNull: false,
  },
  as: 'teacher',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Teacher.hasMany(Salary, {
  foreignKey: {
    name: 'teacher_id',
    allowNull: false,
  },
  as: 'salaryRecords',
});

module.exports = Salary;
