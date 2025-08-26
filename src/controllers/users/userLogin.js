import Helper from '../../utils/index.js';



import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";


export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const currentDate = Helper.getTodayIST();

  try {
    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    console.log("user" + user);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email credentials",
        status_code: 401,
        data: null,
      });
    }

    // 2. Compare password (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password credentials",
        status_code: 401,
        data: null,
      });
    }

    // 3. Update last login
    user.lastLogin = currentDate;
    await user.save(); // Sequelize instance method

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id }, // in Sequelize we use "id", not "_id"
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Exclude password
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    return res.status(200).json({
      message: "Login successful",
      status_code: 200,
      data: {
        user: userWithoutPassword,
        access_token: token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error: " + err.message,
      status_code: 500,
      data: null,
    });
  }
};
