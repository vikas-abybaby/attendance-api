import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";


const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    room_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.BIGINT,
        allowNull: false,

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


export default Message;
