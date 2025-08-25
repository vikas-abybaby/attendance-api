// models/chatMessage.js
import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";

export const ChatMessage = sequelize.define("ChatMessage", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
