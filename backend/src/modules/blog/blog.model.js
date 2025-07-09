const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  content: { type: String, required: true },
  categories: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],  // Embed comments as subdocuments
}, {
  timestamps: true,
});

module.exports = mongoose.model("Blog", blogSchema);
