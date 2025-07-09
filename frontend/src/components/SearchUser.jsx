import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./SearchUser.css";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/user/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(res.data.users);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          <FaSearch size={26} />
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-dropdown">
          {results.map((user) => (
            <p
              key={user._id}
              onClick={() => handleSelect(user._id)}
              className="search-result"
            >
              {user.name} ({user.email})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
