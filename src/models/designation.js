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
    },
    {
        tableName: 'designations',
        timestamps: true,
    }
);



export default Designation;
