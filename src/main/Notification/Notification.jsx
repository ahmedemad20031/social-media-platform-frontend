import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";
import toast from "react-hot-toast";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getNotificationsFromDB();
  }, []);

  async function getNotificationsFromDB() {
    if (!token) return;

    try {
      const res = await axios.get(
        "https://social-media-platform-production-4442.up.railway.app/api/v1/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications(res.data.data);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  }

  function renderMessage(notif) {
    switch (notif.type) {
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
    try {
      const res = await axios.delete(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      getNotificationsFromDB();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="notification-page">
      <div className="notifications-container">
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="notification-item d-flex justify-content-between"
            >
              <div>
                {" "}
                <p>{renderMessage(notif)}</p>
                <span className="time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  handledelete(notif._id);
                }}
                className="delete"
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
