const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller");
const verifyToken = require("../../middleware/auth.middleware");
const Blog = require("./blog.model");
const mongoose = require("mongoose");

// 🔍 Public Routes FIRST
router.get("/all", verifyToken, async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);

    // 1. Get 10 posts liked by the user
    const likedPosts = await Blog.find({ likes: userId })
      .limit(10)
      .select("_id")
      .lean();

    if (!likedPosts.length) {
      // If user hasn't liked anything, fallback to latest 20 blogs
      const fallbackBlogs = await Blog.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("_id title content")
        .lean();
      return res.json({ blogs: fallbackBlogs });
    }

    const likedPostIds = likedPosts.map((post) => post._id);

    // 2. Find neighbor users who liked these posts, excluding current user
    const neighbors = await Blog.aggregate([
      { $match: { _id: { $in: likedPostIds } } },
      { $unwind: "$likes" },
      { $match: { likes: { $ne: userId } } },
      { $sample: { size: 20 } }, // sample neighbors (2 per liked post)
      { $group: { _id: null, userIds: { $addToSet: "$likes" } } },
    ]);

    const neighborUserIds = neighbors.length > 0 ? neighbors[0].userIds : [];

    if (!neighborUserIds.length) {
      // No neighbors found, fallback again
      const fallbackBlogs = await Blog.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select("_id title content")
        .lean();
      return res.json({ blogs: fallbackBlogs });
    }

    // 3. Find posts liked by neighbors but not by current user
    const recommendedBlogs = await Blog.find({
      likes: { $in: neighborUserIds, $nin: [userId] },
      _id: { $nin: likedPostIds },
    })
      .limit(20)
      .select("_id title content")
      .lean();

    return res.json({ blogs: recommendedBlogs });
  } catch (err) {
    console.error("Error fetching recommended blogs:", err);
    return res.status(500).json({ message: "Failed to fetch blogs", err });
  }
});

// Add this route before dynamic routes
router.get("/latest", async (req, res) => {
  try {
    const latestBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5) // Get latest 5 blogs
      .populate("author", "name"); // populate author name if you want
    res.status(200).json(latestBlogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch latest blogs", error: error.message });
  }
});

router.get("/trending", blogController.getTrendingBlogs);
router.get("/category/:category", blogController.getBlogsByCategory);

// 🔥 FIX: move this line ABOVE `/:id`
router.get("/recommendation-data", blogController.getAllBlogsForRecommendation);
router.get(
  "/recommend-content/:title",
  blogController.getContentRecommendations
);
router.get(
  "/recommend-category-public",
  blogController.recommendByCategoryPublic
);
router.get(
  "/recommend-collab",
  verifyToken,
  blogController.getCollaborativeRecommendations
);
router.get(
  "/recommend-user/:userId",
  blogController.getUserCollaborativeRecommendations
);

router.get("/metadata", blogController.getMetadataByIds);

router.get("/related/:blogId", blogController.getRelatedBlogs);

// General list — must be before dynamic `/:id`
router.get("/", blogController.getAllBlogs);

// 🔒 User-specific & protected routes
router.get("/user/:userId", verifyToken, blogController.getBlogsByUser);
router.get(
  "/user/recommendations",
  verifyToken,
  blogController.getUserRecommendations
);

// POST, PATCH, DELETE
router.post("/", verifyToken, blogController.createBlog);
router.patch("/:id", verifyToken, blogController.updateBlog);
router.delete("/:id", verifyToken, blogController.deleteBlog);
// router.patch('/:id/like', verifyToken, blogController.toggleLike);
// router.get('/:blogId/like-status', verifyToken, blogController.getLikeStatus); // optional, for frontend to check
router.patch("/:id/comment", verifyToken, blogController.addComment);
router.delete(
  "/:blogId/comment/:commentId",
  verifyToken,
  blogController.deleteComment
);

// 👇 LAST — dynamic route to avoid catching everything before
router.get("/:id", blogController.getBlogById);

// Admin route
router.patch("/:id/admin", async (req, res) => {
  try {
    const blogId = req.params.id;
    const updateData = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Update only allowed fields
    ["title", "content", "categories", "image"].forEach((field) => {
      if (updateData[field] !== undefined) blog[field] = updateData[field];
    });

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id/admin", async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
