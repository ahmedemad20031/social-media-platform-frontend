import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import "./form.css";
import { setPosts, updatePost } from "../../../Slice/Postsilce";
import { useDispatch, useSelector } from "react-redux";
function Comments() {
  // console.log(res.data);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const commentref = useRef();
  const token = localStorage.getItem("token");

  async function getComments(id) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${id}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setComments(res.data.data.comments);
      console.log(res.data.data.comments);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/v1/post/${id}/comment`,
        { content: commentref.current.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      commentref.current.value = "";
      getComments(id);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(`http://localhost:5000/api/v1/post/${id}/comment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      getComments(id);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    getComments(id);
  }, []);

  return (
    <div className="comments">
      <div className="comments_container">
        {comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <img src={`http://localhost:5000/${comment.user.profileImage}`} />

            <div className="comment_body">
              <div className="comment_header">
                <div>
                  <h5>
                    {comment.user.firstName} {comment.user.lastName}
                  </h5>

                  <h6 className="time">
                    {new Date(comment.createdAt).toLocaleString()}
                  </h6>
                </div>

                <button
                  className="delete_btn"
                  onClick={() => deleteComment(id)}
                >
                  🗑️
                </button>
              </div>

              <p className="comment_text">{comment.content}</p>
            </div>
          </div>
        ))}

        <form
          onSubmit={handleCommentSubmit}
          className="d-flex gap-2 form w-100"
        >
          <input
            className="form-control w-75 border-0 border-bottom"
            type="text"
            placeholder="Add a comment"
            ref={commentref}
          />
          <button type="submit">Comment</button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
