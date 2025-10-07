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
        status: {
            type: DataTypes.ENUM("0", "1"),
            allowNull: false,
            defaultValue: "1",
            comment: "0 = inActive, 1 = active",
        }
    },
    {
        tableName: 'departments',
        timestamps: true,
    }
);

export default Department;
