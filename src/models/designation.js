import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

const Designation = sequelize.define(
    'Designation',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        designation_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
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
        tableName: 'designations',
        timestamps: true,
    }
);



export default Designation;
