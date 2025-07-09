// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/api/notification/${currentUser.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data.notifications || []);
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   // Mark notifications as read
//   const markNotificationsRead = async () => {
//     try {
//       await axios.post(
//         `http://localhost:8000/api/notification/mark-read/${currentUser.id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update local state to mark all as read
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, read: true }))
//       );
//     } catch (err) {
//       console.error("Error marking notifications as read", err);
//     }
//   };

//   useEffect(() => {
//     if (token && currentUser?.id) {
//       fetchNotifications();
//     }
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const toggleOpen = () => {
//     setOpen(!open);
//     if (!open && unreadCount > 0) {
//       // If opening and there are unread notifications, mark them read
//       markNotificationsRead();
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <FaBell
//         size={22}
//         onClick={toggleOpen}
//         style={{ cursor: "pointer", color: "#facc15" }}
//       />

//       {/* Show badge only if unread notifications */}
//       {unreadCount > 0 && (
//         <span
//           style={{
//             position: "absolute",
//             top: -4,
//             right: -4,
//             backgroundColor: "red",
//             color: "white",
//             borderRadius: "50%",
//             padding: "2px 6px",
//             fontSize: "12px",
//             fontWeight: "bold",
//             minWidth: "18px",
//             textAlign: "center",
//             lineHeight: 1,
//             pointerEvents: "none",
//           }}
//         >
//           {unreadCount}
//         </span>
//       )}

//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "30px",
//             right: 0,
//             width: "250px",
//             backgroundColor: "#fff",
//             boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
//             borderRadius: "8px",
//             zIndex: 100,
//             padding: "10px",
//           }}
//         >
//           <h4 style={{ fontSize: "16px", marginBottom: 8, color: "black" }}>
//             Notifications
//           </h4>
//           {notifications.length === 0 ? (
//             <p style={{ fontSize: "14px", color: "#666" }}>No new notifications</p>
//           ) : (
//             notifications.map((n) => (
//               <div key={n._id} style={{ fontSize: "14px", marginBottom: 6, color: "black" }}>
//                 <strong>{n.sender?.name}</strong>{" "}
//                 {n.type === "follow" ? "followed you" : n.message}
//                 <br />
//                 <small style={{ color: "#888" }}>{new Date(n.createdAt).toLocaleString()}</small>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();  // Initialize navigate

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/notification/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Function to handle clicking sender's name
  const goToSenderProfile = (senderId) => {
    navigate(`/user/${senderId}`);  // Changed here to /user/:userId
    setOpen(false); // Optional: close the dropdown on click
  };

  return (
    <div style={{ position: "relative" }}>
      <FaBell
        size={22}
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", color: "#facc15" }}
      />

      {/* Notification count badge */}
      {notifications.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
            fontWeight: "bold",
            minWidth: "18px",
            textAlign: "center",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {notifications.length}
        </span>
      )}

      {open && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: 0,
            width: "280px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            zIndex: 100,
            padding: "10px",
          }}
        >
          <h4 style={{ fontSize: "16px", marginBottom: 8, color: "black" }}>
            Notifications
          </h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666" }}>No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                style={{ fontSize: "14px", marginBottom: 6, color: "black" }}
              >
                <strong
                  onClick={() => goToSenderProfile(n.sender._id)}
                  style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }}
                  title={`Go to ${n.sender?.name}'s profile`}
                >
                  {n.sender?.name}
                </strong>{" "}
                {n.type === "follow" ? "followed you" : n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
