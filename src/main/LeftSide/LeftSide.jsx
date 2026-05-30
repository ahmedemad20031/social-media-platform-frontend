import React, { useEffect, useState } from "react";
import "./LeftSide.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotifications,
  deleteNotification,
  markAllRead,
} from "../../../Slice/notificaionslice";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

const NOTIFICATION_TEXTS = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
};

function LeftSide() {
  const token = localStorage.getItem("token");
  const [suggestion, setSuggestion] = useState([]);

  const dispatch = useDispatch();

  const notificationsFromRedux = useSelector(
    (state) => state.notifications?.notifications,
  );
  const notifications = Array.isArray(notificationsFromRedux)
    ? notificationsFromRedux
    : [];

  console.log(notifications);

  async function getSuggestion() {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/suggest/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuggestion(res.data.data?.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching suggestions",
      );
    }
  }

  async function handlefollow(followId) {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/follow/Follow`,
        { followId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const isFollowing = res.data.data?.isFollowing;

      setSuggestion((prev) =>
        prev.map((user) =>
          user._id === followId ? { ...user, isFollowing: true } : user,
        ),
      );

      toast.success("Followed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    }
  }

  async function getNotifications() {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setNotifications(res.data.data || []));
    } catch (error) {
      console.log("Error fetching notifications", error);
    }
  }

  async function handledelete(id) {
    try {
      await axios.delete(`${BASE_URL}/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteNotification(id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  }

  async function markAsRead() {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/notifications/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(markAllRead());
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  }

  useEffect(() => {
    getSuggestion();
    getNotifications();
  }, []);

  return (
    <div className="Left_side">
      <div className="Left_side_box">
        <div className="suggest">
          <div className="suggest_head">
            <h4>Suggestion for you</h4>
          </div>
          <div className="suggest_box">
            {suggestion.slice(0, 5).map((item) => (
              <div className="suggest_item" key={item._id}>
                <div className="suggest_item_img">
                  <img
                    src={
                      item.profileImage
                        ? `${BASE_URL}/${item.profileImage.replace(/\\/g, "/")}`
                        : "/default.png"
                    }
                    alt="avatar"
                  />
                </div>
                <div className="suggest_item_info">
                  <h5>
                    {item.firstName} {item.lastName}
                  </h5>
                  <p>@{item.username}</p>
                  <button
                    className="suggest_item_btn"
                    onClick={() => handlefollow(item._id)}
                  >
                    {item.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="suggest notifications">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Notifications</h4>
          <button onClick={markAsRead} className="w-50 markasread">
            Mark all as read
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-muted">No notifications</p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div key={n._id} className="notification_item">
              <img
                className="notification_item_img"
                src={
                  n.sender?.profileImage
                    ? `${BASE_URL}/${n.sender.profileImage.replace(/\\/g, "/")}`
                    : "/default.png"
                }
                alt="sender"
              />

              <div className="notification_item_info">
                <p>
                  <strong>
                    {n.sender?.firstName} {n.sender?.lastName}
                  </strong>{" "}
                  <span>
                    {NOTIFICATION_TEXTS[n.type] ||
                      "sent you a new notification"}
                  </span>
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString()
                      : ""}
                  </small>

                  <button
                    className="notification_item_btn"
                    onClick={() => handledelete(n._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftSide;
