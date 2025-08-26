// models/Message.js
import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";
import Room from "./room.js";
import User from "./user.js";

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    room_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "rooms",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    sender_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    content: {
        type: DataTypes.TEXT
    },
    media_url: {
        type: DataTypes.STRING(500)
    },
    message_type: {
        type: DataTypes.ENUM("text", "image", "video", "file"),
        defaultValue: "text"
    }
}, {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});
User.hasMany(Message, { foreignKey: "sender_id" });
Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });

Room.hasMany(Message, { foreignKey: "room_id" });
Message.belongsTo(Room, { foreignKey: "room_id" });

export default Message;
