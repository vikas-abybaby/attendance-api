import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";
import User from "./user.js";

const Attendance = sequelize.define(
    "Attendance",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.DATEONLY
        },

        checkInTime: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        checkOutTime: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        absentTime: {
            type: DataTypes.STRING,
            defaultValue: null,
        },

        checkIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        checkOut: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        absent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        late: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        checkInLocation: {
            type: DataTypes.STRING,
            defaultValue: null,
        },

        checkOutLocation: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        absentLocation: {
            type: DataTypes.STRING,
            defaultValue: null,
        },




        activityLatLong: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
    },
    {
        tableName: "attendances",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["id", "date"],
            },
        ],
    }
);


Attendance.belongsTo(User, { foreignKey: "user_id" });
User.belongsTo(User, { as: "user", foreignKey: "user_id" });

export default Attendance;
