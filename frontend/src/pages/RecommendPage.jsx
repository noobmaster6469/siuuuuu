// src/pages/RecommendPage.jsx

import React, { useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard"; // adjust the path as needed
import { toast } from "react-toastify";
import "./RecommendPage.css";  // import your css


const RecommendPage = () => {
  const [inputTitle, setInputTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  const handleRecommend = async () => {
    if (!inputTitle.trim()) return;
    try {
      setLoading(true);
      const encodedTitle = encodeURIComponent(inputTitle.trim());
      const res = await axios.get(
        `http://localhost:8000/api/blog/recommend-content/${encodedTitle}`
      );
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error("Recommendation fetch failed", err);
      toast.error("Something went wrong while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  
return (
    <div style={{ padding: "1.5rem", maxWidth: "80rem", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#D97706" /* yellow-500 */ }}>
        Blog Recommendations
      </h2>
      <h2>Search here</h2>

      {/* Input group styles inline or you can move to CSS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter blog title or keyword"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "0.5rem 1rem",
            border: "1px solid #ccc",
            borderRadius: "0.375rem",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={handleRecommend}
          disabled={loading}
          style={{
            backgroundColor: "#2563EB", // blue-600
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            width:"200px"
          }}
        >
          {loading ? "Searching..." : "Recommend"}
        </button>
      </div>

      {/* Recommendation grid */}
      {recommendations.length > 0 ? (
        <div className="recommend-grid">
          {recommendations.map((blog) => (
            <div key={blog._id}>
              <BlogCard blog={blog} currentUserId={currentUserId} compact={true} />
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "2.5rem" }}>
            No recommendations found. Try searching again.
          </p>
        )
      )}
    </div>
  );
};

export default RecommendPage;
