import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const Department = sequelize.define(
    'Department',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        department_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'departments',
        timestamps: true,
    }
);

export default Department;
