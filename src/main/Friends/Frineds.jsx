import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Friends.css";

function Friends() {
  const token = localStorage.getItem("token");

  const [followers, setFollowers] = useState([]);

  async function getFollowers() {
    try {
      const res = await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/follow/Followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFollowers(res.data.data || []);
      console.log(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching followers");
      console.log(error);
    }
  }

  async function handleUnfollow(userId) {
    try {
      const res = await axios.post(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/follow/Unfollow`,
        { followId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);

      setFollowers((prev) =>
        prev.filter((item) => item.follower?._id !== userId),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
      console.log(error);
    }
  }

  useEffect(() => {
    getFollowers();
  }, []);

  return (
    <div className="friends-container">
      <h2 className="friends-title">Followers</h2>

      {followers.length === 0 && <h3 className="empty">No followers</h3>}

      {followers.map((item) => {
        const user = item?.follower;

        return (
          <div
            key={item._id}
            className="follower d-flex justify-content-between w-100"
          >
            <div className="name d-flex justify-content-between align-items-center">
              <img
                src={
                  user?.profileImage
                    ? `http://localhost:5000/${user.profileImage}`
                    : "/default.png"
                }
                alt=""
                className="followerImage"
              />
              <span>
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            <div>
              <button
                className="unfollow"
                onClick={() => handleUnfollow(user?._id)}
              >
                Unfollow
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Friends;
