const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  }
}
// , {
//   tableName: 'roles',
//   timestamps: true,    // createdAt & updatedAt
//   underscored: true,
// }
);

module.exports = Role;