const User = require("./user.model");
const bcrypt = require("bcrypt");

exports.registerUser = async ({ name, email, password, gender, bio }) => {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 409, message: "Email already registered" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    gender,
    bio,
    role: "reader", // Force default from backend (optional)
  });

  return await user.save();
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: "User not found" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 401, message: "Invalid credentials" };

  return user;
};

exports.activateUser = async (userId) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  );

  if (!updatedUser) throw { status: 404, message: "User not found" };

  return updatedUser;
};


