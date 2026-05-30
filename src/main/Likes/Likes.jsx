import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./likes.css";
import { AiOutlineLike } from "react-icons/ai";
const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Likes() {
  const { id } = useParams();
  const [likes, setLikes] = useState([]);

  async function fetchLikes() {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/post/${id}/likes`);

      const likesData = res.data.data?.likes || res.data.likes || [];
      setLikes(likesData);
      console.log(likesData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch likes");
    }
  }

  useEffect(() => {
    if (id) {
      fetchLikes();
    }
  }, [id]);

  return (
    <div className="likes">
      {likes.length === 0 ? (
        <p className="text-muted text-center mt-3">No likes yet on this post</p>
      ) : (
        likes.map((like) => (
          <div
            key={like._id}
            className="like d-flex align-items-center gap-2 mb-3"
          >
            <div>
              <img
                src={
                  like.profileImage
                    ? `${BASE_URL}/${like.profileImage.replace(/\\/g, "/")}`
                    : "/default.png"
                }
                alt="profile"
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            </div>
            <span className="like_icon">
              <AiOutlineLike />
            </span>
            <span className="like_name">
              {like.firstName} {like.lastName}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Likes;
