import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/connection.js"; // your Sequelize connection instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 100] },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "employee", "hr"),
      defaultValue: "employee",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    fcmToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    platform: {
      type: DataTypes.ENUM("android", "ios", "web"),
      allowNull: true,
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER, // FK to User.id
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: true,
    },
    reportingTo: {
      type: DataTypes.INTEGER, // FK to User.id
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Method for password compare (like mongoose method)
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
