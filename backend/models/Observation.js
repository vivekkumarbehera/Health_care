const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Observation = sequelize.define('Observation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  note: { type: DataTypes.STRING, allowNull: false },
});

// Relationships
Observation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Observation, { foreignKey: 'userId' });

module.exports = Observation;
