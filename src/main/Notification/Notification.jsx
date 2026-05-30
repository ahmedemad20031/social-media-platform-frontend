import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";
import toast from "react-hot-toast";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  async function getNotificationsFromDB() {
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data.data || []);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    getNotificationsFromDB();
  }, []);

  function renderMessage(notif) {
    switch (notif?.type) {
      case "like":
        return (
          <>
            <strong>
              {notif?.sender?.firstName} {notif?.sender?.lastName}
            </strong>{" "}
            liked your post ❤️
          </>
        );

      case "comment":
        return (
          <>
            <strong>
              {notif?.sender?.firstName} {notif?.sender?.lastName}
            </strong>{" "}
            commented on your post 💬
          </>
        );

      case "follow":
        return (
          <>
            <strong>
              {notif?.sender?.firstName} {notif?.sender?.lastName}
            </strong>{" "}
            started following you 👤
          </>
        );

      case "message":
        return "You received a new message 📩";

      default:
        return "New notification";
    }
  }

  async function handledelete(id) {
    if (!id) return;

    try {
      await axios.delete(`${BASE_URL}/api/v1/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to delete notification",
      );
    }
  }

  return (
    <div className="notification-page">
      <div className="notifications-container">
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-muted text-center mt-3">No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="notification-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={
                    notif.sender?.profileImage
                      ? `${BASE_URL}/${notif.sender.profileImage.replace(/\\/g, "/")}`
                      : "/default.png"
                  }
                  alt="sender"
                  className="rounded-circle"
                  style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />
                <div>
                  <p className="m-0">{renderMessage(notif)}</p>
                  <span
                    className="time text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handledelete(notif._id)}
                className="delete btn btn-link text-decoration-none"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;
