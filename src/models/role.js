import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const Role = sequelize.define(
    'Role',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'roles',
        timestamps: true,
    }
);

export default Role;
