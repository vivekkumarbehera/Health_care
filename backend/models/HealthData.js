const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const HealthData = sequelize.define('HealthData', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  heartRate: { type: DataTypes.FLOAT, allowNull: false },
  oxygenLevel: { type: DataTypes.FLOAT, allowNull: false },
  bloodPressure: { type: DataTypes.STRING, allowNull: false },
});

// Relationships
HealthData.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(HealthData, { foreignKey: 'patientId', as: 'healthRecords' });

module.exports = HealthData;
