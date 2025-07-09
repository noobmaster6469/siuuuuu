// // src/modules/auth/auth.model.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isActive: { type: Boolean, default: false }, // optional: for email activation
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;
