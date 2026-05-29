import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./likes.css";
import { AiOutlineLike } from "react-icons/ai";

function Likes() {
  const id = useParams().id;
  const [likes, setLikes] = useState([]);

  async function fetchLikes() {
    try {
      const res = await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/post/${id}/likes`,
      );
      console.log(res.data.data.likes);
      setLikes(res.data.data.likes);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchLikes();
  }, []);

  return (
    <div className="likes">
      {likes.map((like) => (
        <div
          key={like._id}
          className="like d-flex align-items-center gap-2 mb-3 "
        >
          <div>
            {" "}
            <img
              src={`https://social-media-platform-production-4442.up.railway.app/${like.profileImage}`}
              alt=""
            />
          </div>
          <span className="like_icon">
            <AiOutlineLike />
          </span>
          {like.firstName} {like.lastName}
        </div>
      ))}
    </div>
  );
}

export default Likes;
