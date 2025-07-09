import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ blog, compact = false, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/likes/status/${blog._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Like status response:", res.data);  // <--- check this in console
        setLiked(res.data.liked);
        setLikeCount(res.data.totalLikes);
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    };

    if (token) fetchLikeStatus();
  }, [blog._id, token]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Please register or login to like blogs.");
      navigate("/register");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/likes/${blog._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.totalLikes);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.info("Session expired. Please login again.");
        navigate("/register");
      } else {
        console.error("Like error:", err);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      navigate("/register");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/blog/${blog._id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setNewComment("");
        setShowComments(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/register");
      } else {
        console.error("Comment error:", err);
      }
    }
  };

  const truncateLength = compact ? 70 : 250;
  const truncatedContent =
    blog.content.length > truncateLength
      ? `${blog.content.substring(0, truncateLength)}... `
      : blog.content;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease-in-out",
      }}
      onClick={() => {
        if (!token) {
          toast.info("Please login to view blog details.");
          navigate("/register");
        } else {
          navigate(`/blog/${blog._id}`);
        }
      }}
    >
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 16,
            marginRight: 10,
          }}
        >
          {blog.author?.name?.charAt(0) || "U"}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/user/${blog.author?._id}`}
            style={{ fontWeight: "bold", color: "#4f46e5", textDecoration: "none" }}
          >
            {blog.author?.name || "Unknown"}
          </Link>
        </div>
      </div>

      {/* Title and Image */}
      <h3 style={{ fontSize: compact ? 18 : 24 }}>{blog.title}</h3>
      {blog.image && (
        <img
          src={blog.image}
          alt="Blog"
          style={{
            width: "100%",
            maxHeight: compact ? 110 : 200,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 10,
          }}
        />
      )}

      {/* Content */}
      <p style={{ fontSize: compact ? 14 : 16 }}>
        {truncatedContent}
        {blog.content.length > truncateLength && (
          <span
            style={{ color: "#4f46e5", fontWeight: 600 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog/${blog._id}`);
            }}
          >
            Read more
          </span>
        )}
      </p>

            {/* Category */}
      <p style={{ fontSize: compact ? 13 : 15, color: "#555", fontStyle: "italic" }}>
        <strong>Category:</strong> {blog.categories?.join(", ")}
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: "auto",
          alignItems: "center",
          fontSize: compact ? 14 : 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            color: liked ? "red" : "#444",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={liked ? solidHeart : regularHeart}
            style={{ fontSize: compact ? 20 : 28 }}
          />
          Like ({likeCount})
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
          }}
        >
          Comments ({comments.length})
        </button>

        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
          }}
        >
          Add Comment
        </button>
      </div>

      {/* Add Comment Form */}
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: 16 }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 8,
            }}
          />
          <button
            type="submit"
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </form>
      )}

      {/* Show Comments */}
      {showComments && (
        <div style={{ marginTop: "1rem" }}>
          {comments.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                <strong>{c.user?.name || "User"}:</strong> {c.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BlogCard;


