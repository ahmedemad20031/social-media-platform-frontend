import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./form.css";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Comments() {
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const commentref = useRef();
  const token = localStorage.getItem("token");

  async function getComments(postId) {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/post/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setComments(res.data.data.comments || res.data.comments || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load comments");
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const content = commentref.current.value;

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/v1/post/${id}/comment`,
        { content: content },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      commentref.current.value = "";
      getComments(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(`${BASE_URL}/api/v1/post/${id}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Comment deleted successfully");
      getComments(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  }

  useEffect(() => {
    if (id) {
      getComments(id);
    }
  }, [id]);

  return (
    <div className="comments">
      <div className="comments_container">
        {comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <img
              src={
                comment.user?.profileImage
                  ? `${BASE_URL}/${comment.user.profileImage.replace(/\\/g, "/")}`
                  : "default-avatar.png"
              }
              alt="avatar"
            />

            <div className="comment_body">
              <div className="comment_header">
                <div>
                  <h5>
                    {comment.user?.firstName} {comment.user?.lastName}
                  </h5>
                  <h6 className="time">
                    {new Date(comment.createdAt).toLocaleString()}
                  </h6>
                </div>

                <button
                  className="delete_btn"
                  onClick={() => deleteComment(comment._id)}
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
