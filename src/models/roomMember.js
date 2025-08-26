// models/RoomMember.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RoomMember = sequelize.define("RoomMember", {
    member_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM("member", "admin", "owner"),
        defaultValue: "member"
    },
    muted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "room_members",
    timestamps: true,
    createdAt: "joined_at",
    updatedAt: false
});

export default RoomMember;
