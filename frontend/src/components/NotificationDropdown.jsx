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
        width: "100%",
        maxWidth: "100%",
        minHeight: "100vh",
        margin: "20px auto",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow:
          "0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1f2937",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          position: "relative",
        }}
      >
        <FaBell size={24} color="#facc15" />
        <h2
          style={{
            margin: 0,
            marginLeft: 12,
            fontWeight: 700,
            fontSize: 20,
            color: "#111827",
            flexGrow: 1,
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
          maxHeight: 400,
          overflowY: "auto",
          padding: "16px 24px",
          backgroundColor: "#fff",
        }}
      >
        {notifications.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: 16,
              marginTop: 40,
            }}
          >
            No new notifications
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              style={{
                backgroundColor: n.read ? "#f9fafb" : "#e0e7ff",
                borderRadius: 10,
                padding: "14px 20px",
                marginBottom: 14,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.1)",
                cursor: "default",
                transition: "background-color 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                if (!n.read) e.currentTarget.style.backgroundColor = "#c7d2fe";
              }}
              onMouseLeave={(e) => {
                if (!n.read) e.currentTarget.style.backgroundColor = "#e0e7ff";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <strong
                  onClick={() => goToSenderProfile(n.sender._id)}
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: 16,
                    userSelect: "none",
                  }}
                  title={`Go to ${n.sender?.name}'s profile`}
                >
                  {n.sender?.name}
                </strong>
                <span
                  style={{
                    color: "#374151",
                    fontSize: 15,
                    userSelect: "text",
                  }}
                >
                  {n.type === "follow" ? "followed you" : n.message}
                </span>
              </div>
              <small
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  userSelect: "none",
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
