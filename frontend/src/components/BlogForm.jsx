

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";



const BlogForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    image: null,
    content: "",
    categories: "",
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });

      if (file) {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    let imageUrl = "";

    try {
      if (form.image) {
        const imgData = new FormData();
        imgData.append("image", form.image);

        const uploadRes = await axios.post(
          "http://localhost:8000/api/upload",
          imgData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      const res = await axios.post(
        "http://localhost:8000/api/blog",
        {
          title: form.title,
          image: imageUrl,
          content: form.content,
          categories: [form.categories],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    toast.success("✅ Blog published successfully!");
    navigate("/profile");
      console.log(res.data);

      setForm({
        title: "",
        image: null,
        content: "",
        categories: "",
      });
      setPreview(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
    toast.error("❌ Something went wrong while publishing!");
    }
  };

  // Inline styles
  const styles = {
    formContainer: {
      maxWidth: 900,
      margin: "auto",
      padding: 24,
      border: "1px solid #ddd",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
    },
    flexRow: {
      display: "flex",
      gap: 24,
      alignItems: "flex-start",
    },
    leftSide: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 16,
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      height: 320, // fixed height ~ 20rem
      padding: "12px 16px",
      borderRadius: 6,
      border: "1px solid #ccc",
      resize: "none",
      fontSize: 16,
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 16,
      fontFamily: "inherit",
      boxSizing: "border-box",
      backgroundColor: "#fff",
    },
    button: {
      padding: "12px 0",
      backgroundColor: "#2563eb", // blue-600
      color: "#fff",
      fontSize: 18,
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#1e40af", // blue-700
    },
    previewWrapper: {
      width: 256,
      height: 320,
      border: "1px solid #ccc",
      borderRadius: 6,
      padding: 8,
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fafafa",
      overflow: "hidden",
    },
    previewImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      borderRadius: 6,
      objectFit: "contain",
    },
    previewText: {
      color: "#999",
      fontStyle: "italic",
      textAlign: "center",
      fontSize: 14,
      padding: "0 8px",
    },
  };

  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      <div style={styles.flexRow}>
        <div style={styles.leftSide}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="categories"
            value={form.categories}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Music">Music</option>
            <option value="Movies">Movies</option>
            <option value="Sports">Sports</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Nature">Nature</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Bollywood">Bollywood</option>
            <option value="Fashion">Fashion</option>
            <option value="Personal">Personal</option>
            <option value="News">News</option>
          </select>

          <textarea
            name="content"
            placeholder="Write your blog content here..."
            value={form.content}
            onChange={handleChange}
            required
            style={styles.textarea}
          ></textarea>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            color="#fff"
          >
            Publish Blog
          </button>
        </div>

        <div style={styles.previewWrapper}>
          {preview ? (
            <img
              src={preview}
              alt="Selected preview"
              style={styles.previewImage}
            />
          ) : (
            <p style={styles.previewText}>Image preview will appear here</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
