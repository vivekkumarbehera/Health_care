const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Alert = sequelize.define('Alert', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: DataTypes.STRING, allowNull: false },
  severity: { type: DataTypes.ENUM('Alert', 'Warning', 'Critical'), defaultValue: 'Alert' },
});

// Relationships
Alert.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Alert, { foreignKey: 'userId' });

module.exports = Alert;
