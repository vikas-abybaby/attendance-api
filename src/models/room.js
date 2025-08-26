// models/Room.js
import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";

const Room = sequelize.define("Room", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    avatar_url: {
        type: DataTypes.STRING(500)
    },
    is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "rooms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Room;
