


const mongoose = require('mongoose');
const Blog = require('./blog.model');
const { exec } = require("child_process");
const path = require("path");
const Like = require('../like/like.model'); // Adjust path if needed


const scriptPath = path.join(__dirname, "../../recommendation/recommend.py");

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, categories, image } = req.body;
    const author = new mongoose.Types.ObjectId(req.user.id);

    const normalizedCategories = Array.isArray(categories)
      ? categories.map(cat => cat.toLowerCase())
      : [];

    const newBlog = await Blog.create({
      title,
      content,
      image,
      categories: normalizedCategories,
      author,
    });

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Blogs (latest first, public)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog (only author)
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    // Update only allowed fields
    ['title', 'content', 'categories', 'image'].forEach(field => {
      if (updateData[field] !== undefined) blog[field] = updateData[field];
    });

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Blog (only author)

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId); // ✅ recommended method

    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = {
      text: comment.trim(),
      user: { _id: req.user.id, name: req.user.name },
      date: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Comment (only comment owner)
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    comment.remove();
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get blogs by user
exports.getBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserRecommendations = async (req, res) => {
  try {
    const likeCounts = await Like.aggregate([
      { $group: { _id: "$blogId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 7 }
    ]);

    const blogIds = likeCounts.map(l => l._id);
    const blogs = await Blog.find({ _id: { $in: blogIds } })
      .populate("author", "name")
      .lean();

    const result = blogs.map(blog => {
      const likeObj = likeCounts.find(l => l._id.toString() === blog._id.toString());
      return {
        ...blog,
        likeCount: likeObj?.count || 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("User Recommendations error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getTrendingBlogs = async (req, res) => {
  try {
    const trendingBlogs = await Blog.aggregate([
      {
        $lookup: {
          from: "likes", // collection name in MongoDB (usually plural lowercase)
          localField: "_id",
          foreignField: "blogId",
          as: "likesData",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likesData" },
        },
      },
      {
        $sort: { likeCount: -1, createdAt: -1 },
      },
      { $limit: 7 },
      {
        $project: {
          title: 1,
          content: 1,
          image: 1,
          categories: 1,
          author: 1,
          likeCount: 1,
          createdAt: 1,
        },
      },
    ]).exec();

    // Populate author name (if needed)
    await Blog.populate(trendingBlogs, { path: "author", select: "name" });

    res.status(200).json(trendingBlogs);
  } catch (error) {
    console.error("Trending blog error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/blog/category/:category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const blogs = await Blog.find({
      categories: { $regex: new RegExp(`^${category}$`, "i") }, // case-insensitive match
    })
      .populate("author", "name email") // optional
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blogs with full details for recommendations
exports.getAllBlogsForRecommendation = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Recommendation blog fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getContentRecommendations = (req, res) => {
  const userQuery = decodeURIComponent(req.params.title).trim(); // ✅ Fix added
  const scriptPath = path.join(__dirname, "../recommendation/recommend.py");
  const command = `python "${scriptPath}" "${userQuery.replace(/"/g, '\\"')}"`; // Escape quotes if needed

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python Error:", error.message);
      return res.status(500).json({ message: "Recommendation failed" });
    }

    if (stderr) {
      console.warn("Python stderr:", stderr);
    }

    try {
      const output = JSON.parse(stdout);
      return res.status(200).json(output);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      return res.status(500).json({ message: "Invalid recommendation format" });
    }
  });
};

// blog.controller.js


exports.getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const category = blog.categories?.[0];
    const relatedBlogs = await Blog.find({
      categories: category,
      _id: { $ne: blog._id }
    }).limit(3);

    res.status(200).json({ relatedBlogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// blog.controller.js
exports.getCollaborativeRecommendations = (req, res) => {
  const userId = req.user.id; // must be from verifyToken middleware
  const scriptPath = path.join(__dirname, "../recommendation/recommend_collab.py");
  const command = `python "${scriptPath}" "${userId}"`;

  console.log("Running collaborative recommend command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python Error:", error);
      return res.status(500).json({ message: "Recommendation failed", error: error.message });
    }

    if (stderr) {
      console.warn("Python stderr:", stderr);
    }

    try {
      const output = JSON.parse(stdout);
      // Expected output format: { recommendations: [blogId1, blogId2, ...] }
      return res.status(200).json(output);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      return res.status(500).json({ message: "Invalid recommendation format" });
    }
  });
};

exports.getMetadataByIds = async (req, res) => {
  const ids = req.query.ids?.split(",");
  if (!ids || ids.length === 0) return res.status(400).json({ message: "No blog IDs provided" });

  try {
    const blogs = await Blog.find({ _id: { $in: ids } }).populate("author", "name");
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


exports.getUserCollaborativeRecommendations = (req, res) => {
  const userId = req.params.userId;  // <-- userId not blogId
  const scriptPath = path.join(__dirname, "../recommendation/recommend_collab.py");

  const command = `python "${scriptPath}" "${userId}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python Error:", error);
      return res.status(500).json({ message: "Recommendation failed", error: error.message });
    }

    try {
      const output = JSON.parse(stdout);
      return res.status(200).json(output);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      return res.status(500).json({ message: "Invalid recommendation format" });
    }
  });
};


// 🚀 CATEGORY-BASED RECOMMENDATION
exports.recommendByCategoryPublic = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query" });
    }

    // Find blogs the user liked
    const likedBlogs = await Like.find({ userId }).populate("blogId");

    const categories = [
      ...new Set(
        likedBlogs
          .map((like) => like.blogId?.categories)
          .flat()
          .filter(Boolean)
      ),
    ];

    if (!categories.length) {
      return res.json({ recommendations: [] });
    }

    const likedBlogIds = likedBlogs.map((like) => like.blogId?._id?.toString());

    // Find other blogs in same categories, excluding already liked
    const blogs = await Blog.find({
      categories: { $in: categories },
      _id: { $nin: likedBlogIds },
    }).populate("author", "name");

    const blogIds = blogs.map((blog) => blog._id);

    // Get real like counts from Like collection
    const likeCounts = await Like.aggregate([
      { $match: { blogId: { $in: blogIds } } },
      { $group: { _id: "$blogId", count: { $sum: 1 } } },
    ]);

    const likeMap = {};
    likeCounts.forEach((l) => (likeMap[l._id.toString()] = l.count));

    const enrichedBlogs = blogs.map((blog) => ({
      ...blog.toObject(),
      likeCount: likeMap[blog._id.toString()] || 0,
    }));

    // ✅ Sort: by likeCount desc → commentCount desc → recent
    enrichedBlogs.sort((a, b) => {
      const likeDiff = b.likeCount - a.likeCount;
      if (likeDiff !== 0) return likeDiff;

      const commentDiff = (b.comments?.length || 0) - (a.comments?.length || 0);
      if (commentDiff !== 0) return commentDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ recommendations: enrichedBlogs });
  } catch (err) {
    console.error("Category recommendation error:", err);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};







