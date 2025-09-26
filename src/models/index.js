const { sequelize } = require('../config/database');
const User = require('./User');

// Export models
module.exports = {
  sequelize,
  User,
};