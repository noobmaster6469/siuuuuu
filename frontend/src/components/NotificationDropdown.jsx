import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/notification/${currentUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (token && currentUser?.id) {
      fetchNotifications();
    }
  }, []);

  const goToSenderProfile = (senderId) => {
    navigate(`/user/${senderId}`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100vw",
        minHeight: "100vh",
        height: "100vh",
        margin: 0,
        background: "#fff",
        borderRadius: 0,
        boxShadow: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1f2937",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "none",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "22px 32px 18px 32px",
          borderBottom: "1.5px solid #e5e7eb",
          background: "#f1f5f9",
          position: "relative",
          minHeight: 70,
        }}
      >
        <div
          style={{
            background: "#facc15",
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(250,204,21,0.18)",
          }}
        >
          <FaBell size={24} color="#fff" />
        </div>
        <h2
          style={{
            margin: 0,
            marginLeft: 18,
            fontWeight: 800,
            fontSize: 24,
            color: "#1e293b",
            flexGrow: 1,
            letterSpacing: 0.5,
          }}
        >
          Notifications
        </h2>

        {unreadCount > 0 && (
          <span
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "9999px",
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 14,
              minWidth: 28,
              textAlign: "center",
              boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
              userSelect: "none",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification List */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "24px 32px 24px 32px",
          background: "#fff",
        }}
      >
        {notifications.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: 18,
              marginTop: 60,
              fontWeight: 500,
              letterSpacing: 0.2,
            }}
          >
            No new notifications
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              style={{
                background: n.read ? "#f9fafb" : "#fff",
                borderRadius: 10,
                padding: "16px 24px 12px 24px",
                marginBottom: 14,
                boxShadow: "0 1px 2px rgba(30,64,175,0.04)",
                cursor:
                  n.type === "like" || n.type === "comment"
                    ? "pointer"
                    : "default",
                transition: "background 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
                border: n.read ? "1px solid #e5e7eb" : "1.5px solid #e5e7eb",
                position: "relative",
              }}
              onClick={() => {
                if ((n.type === "like" || n.type === "comment") && n.blogId) {
                  navigate(`/blog/${n.blogId}`);
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSenderProfile(n.sender._id);
                  }}
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: 16,
                    userSelect: "none",
                    display: "inline-block",
                  }}
                  title={`Go to ${n.sender?.name}'s profile`}
                >
                  {n.sender?.name}
                </span>
                {n.type === "like" || n.type === "comment" ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (n.blogId) navigate(`/blog/${n.blogId}`);
                    }}
                    style={{
                      color: "#374151",
                      fontSize: 15.5,
                      userSelect: "text",
                      marginLeft: 6,
                      fontWeight: 500,
                      textDecoration: "underline",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#1e40af")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#374151")
                    }
                    title="Go to blog post"
                  >
                    {n.message}
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#374151",
                      fontSize: 15.5,
                      userSelect: "text",
                      marginLeft: 6,
                      fontWeight: 500,
                    }}
                  >
                    {n.type === "follow" ? "followed you" : n.message}
                  </span>
                )}
              </div>
              <small
                style={{
                  color: "#64748b",
                  fontSize: 13.5,
                  userSelect: "none",
                  marginTop: 2,
                  fontWeight: 400,
                  letterSpacing: 0.1,
                }}
              >
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
