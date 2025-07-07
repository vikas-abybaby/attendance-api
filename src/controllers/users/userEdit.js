import User from '../../models/user.js';


export const userEdit = async (req, res) => {
  try {
    const userId = req.body.id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', status_code: 404, data: null });
    }

    const userObj = updatedUser.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    delete userObj.__v;

    res.status(200).json({ message: 'User updated', status_code: 200, data: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', status_code: 500, data: null });
  }
};
 