import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const AccessToken = sequelize.define('AccessToken', {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
}, {
  tableName: 'access_tokens', 
  timestamps: true,
});

export default AccessToken;
