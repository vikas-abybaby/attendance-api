import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/connection.js"; // your Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
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
      validate: { isEmail: true },
    },
    designationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 100] },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
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
    profile_url: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,

    },
    reportingTo: {
      type: DataTypes.BIGINT,
      allowNull: true,

    },
    status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: true,
      defaultValue: "1",
      comment: "0 = inActive, 1 = active",
    }
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

// Password compare helper
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
