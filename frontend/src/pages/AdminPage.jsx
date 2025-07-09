import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/blog");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching blogs.");
      }
    };

    fetchAll();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin-update-blog/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/blog/${id}/admin`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        alert("Blog deleted successfully.");
      } else {
        alert("Failed to delete the blog.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting blog.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "24px",
          }}
        >
          Admin Panel - Manage Blogs
        </h1>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  backgroundColor: "#f9fafb",
                  textAlign: "left",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      width: "80px", // Fixed width for image column
                    }}
                  >
                    SN
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      width: "80px", // Fixed width for image column
                    }}
                  >
                    Image
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      display: window.innerWidth < 768 ? "none" : "table-cell",
                      width: "150px", // Fixed width for author
                    }}
                  >
                    Author
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      display: window.innerWidth < 1024 ? "none" : "table-cell",
                      width: "100px", // Fixed width for date
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      display: window.innerWidth < 768 ? "none" : "table-cell",
                    }}
                  >
                    Categories
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "1px solid #e5e7eb" }}>
                {blogs.map((blog, idx) => (
                  <tr
                    key={blog._id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fafb")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        whiteSpace: "nowrap",
                        display:
                          window.innerWidth < 1024 ? "none" : "table-cell",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#1f2937" }}>
                        {++idx}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        onClick={(e) => {
                          navigate(`/blog/${blog._id}`);
                        }}
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div
                        onClick={(e) => {
                          navigate(`/blog/${blog._id}`);
                        }}
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1f2937",
                          maxWidth: "300px", // Limit title width to prevent overflow
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        {blog.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          display: window.innerWidth < 768 ? "block" : "none",
                        }}
                      >
                        By {blog.author.name} •{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        whiteSpace: "nowrap",
                        display:
                          window.innerWidth < 768 ? "none" : "table-cell",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#1f2937" }}>
                        {blog.author.name}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        whiteSpace: "nowrap",
                        display:
                          window.innerWidth < 1024 ? "none" : "table-cell",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#1f2937" }}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        display:
                          window.innerWidth < 768 ? "none" : "table-cell",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {blog.categories.map((cat, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: "#fef9c3",
                              color: "#854d0e",
                              borderRadius: "12px",
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(blog._id)}
                          style={{
                            color: "#2563eb",
                            background: "none",
                            border: "1px solid #2563eb",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = "#1e40af";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = "#2563eb";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          style={{
                            color: "#dc2626",
                            background: "none",
                            border: "1px solid #dc2626",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = "#b91c1c";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = "#dc2626";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
