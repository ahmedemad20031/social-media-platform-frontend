import React, { use, useState } from "react";
import "./LeftSide.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import notificationSlice from "../../../Slice/notificaionslice";
import {
  setNotifications,
  deleteNotification,
  markAllRead,
} from "../../../Slice/notificaionslice";
function LeftSide() {
  const token = localStorage.getItem("token");
  const [suggestion, setSuggestion] = React.useState([]);

  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.notifications,
  );

  console.log(notifications);

  async function getSuggestion() {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/suggest/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data.users);
      setSuggestion(res.data.data.users);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response?.data?.message);
    }
  }

  async function handlefollow(followId) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/follow/Follow",
        { followId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const isFollowing = res.data.data.isFollowing;
      setSuggestion((prev) => prev.filter((user) => user._id !== followId));

      toast.success("Followed successfully");

      setSuggestion((prev) =>
        prev.map((user) =>
          user._id === followId ? { ...user, isFollowing } : user,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    }
  }
  async function getNotifications() {
    const res = await axios.get("http://localhost:5000/api/v1/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setNotifications(res.data.data));
  }
  async function handledelete(id) {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(deleteNotification(id));
      toast.success("notificatio deleted");
    } catch (error) {
      console.log(error.response.message);
      toast.error(error.response?.data?.message);
    }
  }
  async function markAsRead() {
    await axios.put(
      "http://localhost:5000/api/v1/notifications/read",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    dispatch(markAllRead());
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
                    src={`http://localhost:5000/${item.profileImage}`}
                    alt=""
                  />
                </div>
                <div className="suggest_item_info">
                  <h5>
                    {item.firstName}
                    {item.lastName}
                  </h5>
                  <p>{item.username}</p>
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
        <div className="d-flex justify-content-between align-items-center">
          <h4>Notifications</h4>
          <button onClick={markAsRead} className="w-50 markasread">
            Mark all as read
          </button>
        </div>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div key={n._id} className="notification_item">
              <img
                className="notification_item_img"
                src={`http://localhost:5000/${n.sender.profileImage}`}
              />

              <div className="notification_item_info">
                <p>
                  {n.sender?.firstName} {n.sender?.lastName}
                  <span>
                    {{
                      like: "liked your post",
                      comment: "commented on your post",
                      follow: "started following you",
                    }[n.type] || "new notification"}
                  </span>
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <small>
                    {new Date(n.createdAt).toLocaleString().split(",")[0]}
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
