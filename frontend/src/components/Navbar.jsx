import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationDropdown";
import SearchUser from "./SearchUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
// import BlogSearchBox from "./BlogSearchBox"; // <-- Import here

const categories = [
  "Technology",
  "Programming",
  "Lifestyle",
  "Entertainment",
  "Music",
  "Movies",
  "Sports",
  "Travel",
  "Food",
  "Nature",
  "Health",
  "Education",
  "Bollywood",
  "Fashion",
  "Personal",
  "News",
];

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = categories.filter((cat) =>
      cat.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCategories(value ? filtered : []);
    setActiveIndex(0);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setFilteredCategories([]);
    navigate(`/category/${category.toLowerCase()}`);
  };

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    backgroundColor: "#111827",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "82px",
  };

  const brandStyle = {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#facc15",
    textDecoration: "none",
    letterSpacing: "1px",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const linkStyle = {
    fontSize: "1rem",
    textDecoration: "none",
    color: "#f3f4f6",
    fontWeight: 500,
    transition: "color 0.3s ease",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>
        IdeaFlux
      </Link>

      <div style={linkContainerStyle}>
        {!isLoggedIn ? (
          <>
            {/* <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link> */}
          </>
        ) : (
          <>
            {/* <Link to="/add-blog" style={linkStyle}>Add Blog</Link> */}

            {/* <Link to="/recommend" style={linkStyle}>Recommendation</Link> ✅ Added */}

            {/* <SearchUser /> */}

            {/* <NotificationsDropdown /> */}

            {/* Profile section */}

            {user.role == "admin" && (
              <div
                style={{
                  color: "#facc15",
                  cursor: "pointer",
                  border: "2px solid #facc15",
                  padding: "6px 14px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  display: "inline-block",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#facc15";
                  e.currentTarget.style.color = "#1f2937"; // Tailwind's gray-800
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#facc15";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => navigate("/admin")}
              >
                <span>Admin Panel</span>
              </div>
            )}

            {user.role != "admin" && <SearchUser />}

            <div
              onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
              }}
            >
              {user.role != "admin" && (
                <>
                  <div
                    style={{
                      backgroundColor: "#facc15",
                      color: "#1f2937",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      padding: "10px",
                    }}
                    title={`Logged in as ${user?.name}`}
                  >
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: "#facc15",
                    }}
                  >
                    {user?.name}
                  </span>
                </>
              )}

              {user.role == "admin" && (
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
              )}
            </div>

            {/* Logout */}
            {/* <button
              onClick={handleLogout}
              style={{
                ...linkStyle,
                background: "none",
                border: "none",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#f87171")}
              onMouseOut={(e) => (e.target.style.color = "#f3f4f6")}
            >
              Logout
            </button> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
