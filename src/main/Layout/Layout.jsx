import React, { useEffect, useRef, useState } from "react";
import "./Layout.css";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";

import FooterRigth from "../FooterRigth/FooterRirth";
import Sidebar from "../Sidebar/Sidebar";
import LeftSide from "../LeftSide/LeftSide";

import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  addPost,
  deletePost,
  updatePost,
  setPosts,
  likePost,
  dislikePost,
} from "../../../Slice/Postsilce";

function Layout() {
  const textref = useRef();
  const imgeref = useRef();
  const dispatch = useDispatch();

  const postsFromRedux = useSelector((state) => state.posts.posts);
  const posts = Array.isArray(postsFromRedux) ? postsFromRedux : [];

  const [show, setShow] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [currentPost, setCurrentPost] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLeft, setShowLeft] = useState(false);

  const token = localStorage.getItem("token");
  const go = useNavigate();

  const user = useSelector((state) => state.user.user);

  console.log(user._id);

  const profileImage = user?.profileImage;

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  async function handleClick() {
    try {
      const formdata = new FormData();
      if (imgeref.current?.files?.[0]) {
        formdata.append("image", imgeref.current.files[0]);
      }
      formdata.append("title", textref.current.value);

      const res = await axios.post(
        "http://localhost:5000/api/v1/post/",
        formdata,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newPost = res.data.data?.post || res.data.data || res.data.post;
      dispatch(addPost(newPost));
      toast.success("Post Created");

      textref.current.value = "";
      imgeref.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  async function getallposts() {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/");
      const fetchedPosts = res.data.data?.posts || res.data.data;
      dispatch(setPosts(fetchedPosts));
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  async function handlelike(post) {
    if (user?._id === post.user?._id) {
      toast.error("You can't like your own post");
      return;
    }
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/v1/post/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedPost = res.data.data?.post || res.data.data;
      dispatch(likePost(updatedPost));
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  async function handledislike(post) {
    try {
      if (user?._id === post.user?._id) {
        toast.error("You can't dislike your own post");
        return;
      }

      const res = await axios.patch(
        `http://localhost:5000/api/v1/post/${post._id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedPost = res.data.data?.post || res.data.data;
      dispatch(dislikePost(updatedPost));
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  async function handleDelete(postId) {
    try {
      await axios.delete(`http://localhost:5000/api/v1/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(deletePost(postId));
      toast.success("Post Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  async function handleUpdate() {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/post/${currentPost._id}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedPost = res.data.data?.post || res.data.data;
      dispatch(updatePost(updatedPost));
      setShow(false);
      toast.success("Post Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    }
  }

  function handleEdit(post) {
    setEditTitle(post.title);
    setCurrentPost(post);
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    getallposts();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;

  return (
    <div className="layout">
      <div
        className={`sidbar ${showSidebar ? "show-mobile-sidebar" : "d-none d-lg-block"}`}
      >
        <button
          className="btn-close d-lg-none close-sidebar-btn "
          onClick={() => setShowSidebar(false)}
        ></button>
        <Sidebar />
      </div>

      <div className="main">
        <div className="ci">
          <div className="post">
            <div className="d-flex align-items-center img">
              <img
                src={
                  profileImage
                    ? `http://localhost:5000/${profileImage}`
                    : "https://via.placeholder.com/50"
                }
                className="rounded-circle"
                width="50px"
                height="50px"
                alt=""
              />
              <input
                className="form-control nam"
                type="text"
                placeholder="What's on your mind?"
                ref={textref}
              />
            </div>
            <div className="d-flex my-2 w-100 ">
              <input type="file" className="form-control" ref={imgeref} />
              <button onClick={handleClick} className="post_btn btn-primary">
                Post
              </button>
            </div>
          </div>

          <div className="mt-3">
            {currentPosts.map((item) => (
              <div className="card mb-3" key={item._id}>
                <div className="card-body">
                  <div className="d-flex gap-2 align-items-center">
                    <img
                      src={
                        item.user?.profileImage
                          ? `http://localhost:5000/${item.user.profileImage}`
                          : "https://via.placeholder.com/45"
                      }
                      className="rounded-circle"
                      width="45"
                      height="45"
                      alt=""
                    />

                    <div>
                      <Link
                        to={`/profile/${item.user?._id}`}
                        className="text-decoration-none"
                      >
                        <h6 className="m-0 ">
                          {item.user?.firstName} {item.user?.lastName}
                        </h6>
                      </Link>
                      <small>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ""}
                      </small>
                    </div>
                    {user._id.toString() === item.user._id?.toString() && (
                      <div className="d-flex gap-2 buttons ">
                        <button
                          className="btn_layout"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn_layout"
                          onClick={() => handleDelete(item?._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-3">{item.title}</p>

                  {item.image && (
                    <img
                      className="img-fluid rounded"
                      src={`http://localhost:5000/${item.image}`}
                      alt=""
                    />
                  )}

                  <div className="post-actions">
                    <button
                      onClick={() => handlelike(item)}
                      className={`action-btn ${item.likes?.includes(user?._id) ? "liked" : ""}`}
                    >
                      <AiOutlineLike className="action-icon" />
                      <span>{item.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handledislike(item)}
                      className={`action-btn ${item.dislikes?.includes(user?._id) ? "disliked" : ""}`}
                    >
                      <AiOutlineDislike className="action-icon" />
                      <span>{item.dislikes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => go(`/${item._id}/comments`)}
                      className="action-btn"
                    >
                      <FaRegComment className="action-icon" />
                      <span>{item.comments?.length || 0}</span>
                    </button>
                  </div>

                  <div
                    className="likes-count"
                    onClick={() => go(`/${item._id}/likes`)}
                  >
                    {item.likes?.length || 0} Likes
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-2 mt-3 pagination-container">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span className="d-flex align-items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div
        className={`left_side ${showLeft ? "show-mobile-left" : "d-none d-lg-block"}`}
      >
        <button
          className="btn-close d-lg-none close-left-btn"
          onClick={() => setShowLeft(false)}
        ></button>
        <LeftSide />
      </div>

      <div className="d-lg-none mobile-footer">
        <FooterRigth
          setShowSidebar={setShowSidebar}
          setShowLeft={setShowLeft}
          userId={user?._id}
        />
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Layout;
