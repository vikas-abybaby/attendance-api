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

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
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
        checkIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }, 
        checkOut: {
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

        checkOutTime: {
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
                fields: ["userId", "date"],
            },
        ],
    }
);


Attendance.belongsTo(User, { foreignKey: "userId" });

export default Attendance;
