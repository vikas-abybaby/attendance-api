const User = require('../../models/user');

exports.getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

// exports.getUserById = async (userId) => {
//   const user = await User.findOne({
//     _id: userId,
//     isActive: true
//   });
//   return user;
// };