const { sequelize } = require('../config/database');
const Role = require('./Role');
const Salary = require('./Salary');
const Student = require('./Student');
const Teacher = require('./Teacher');
const User = require('./User');

// Export models
module.exports = {
  sequelize,
  User,
  Teacher,
  Student,
  Role,
  Salary
};