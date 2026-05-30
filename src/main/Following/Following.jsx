import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../Loading/Loading";

import "./Following.css";

function Following() {
  const token = localStorage.getItem("token");

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getfollowing() {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/follow/Following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFollowing(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  }
  async function handleunfollow(item) {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/follow/Unfollow`,
        { followId: item.following._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);

      setFollowing((prev) =>
        prev.filter((i) => i.following._id !== item.following._id),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error");
      console.log(error);
    }
  }

  useEffect(() => {
    getfollowing();
  }, []);
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="following-container">
      <h2 className="following-title">Following</h2>

      <div className="following-list">
        {following.map((item) => (
          <div className="following-card" key={item._id}>
            <div className="following-user">
              <img
                src={
                  item.following.profileImage
                    ? `http://localhost:5000/${item.following.profileImage}`
                    : "/default.png"
                }
                alt=""
              />
              <div>
                <h4>
                  {item.following.firstName} {item.following.lastName}
                </h4>
                <p>{item.following.email}</p>
              </div>
            </div>

            <button
              className="unfollow-btn"
              onClick={() => handleunfollow(item)}
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Following;
