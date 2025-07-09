import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import CollaborativeRecommendations from "../components/CollaborativeRecommendations";
import CategoryRecommendations from "../components/CategoryRecommendations";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const { data: latestData } = await axios.get(`${API_BASE}/blog`);
      const { data: trendingData } = await axios.get(
        `${API_BASE}/blog/trending`
      );

      const sortedLatest = latestData
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBlogs(sortedLatest);
      setTrendingBlogs(trendingData);

      if (user?.id) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const visibleBlogs = showAllBlogs ? blogs : blogs.slice(0, 6);

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
        overflowX: "hidden",
      }}
    >
      <h1 style={{ fontWeight: "700", marginBottom: 8 }}>
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2
            style={{
              fontWeight: "600",
              marginBottom: 16,
              borderBottom: "2px solid #4f46e5",
              paddingBottom: 6,
              color: "#4f46e5",
            }}
          >
            🔵 Latest Blogs
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {visibleBlogs.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "#666" }}>
                No blogs available.
              </p>
            ) : (
              visibleBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </div>

          {blogs.length > 6 && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={() => setShowAllBlogs(!showAllBlogs)}
                style={{
                  width: "200px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "black",
                  color: "#fff",
                }}
              >
                {showAllBlogs ? "Show Less" : "Read More"}
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: "0 0 350px", maxWidth: "100%" }}>
          <h2
            style={{
              fontWeight: "600",
              marginBottom: 16,
              borderBottom: "2px solid #ef4444",
              paddingBottom: 6,
              color: "#ef4444",
            }}
          >
            🔥 Top Trending
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "black",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {trendingBlogs.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "#666" }}>
                No trending blogs yet.
              </p>
            ) : (
              trendingBlogs
                .slice(0, 4)
                .map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    currentUserId={currentUserId}
                    compact={true}
                  />
                ))
            )}
          </div>
        </div>
      </div>

      {user && (
        <div style={{ marginTop: "60px" }}>
          <CategoryRecommendations currentUserId={user.id} />
          <CollaborativeRecommendations userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default Home;
