import React, { use, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import Loading from "../../Loading/Loading";
import { likePost, dislikePost } from "../../../Slice/Postsilce";
import { useDispatch, useSelector } from "react-redux";
import "./Search.css";

function Search() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const searchref = useRef();

  const go = useNavigate();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  async function getallPostsbysearch(id) {
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/post/search/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const fetchedPosts = res.data.data || [];
      console.log(fetchedPosts);
      setSearchResults(fetchedPosts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  }

  async function handlelike(post) {
    if (user?._id === post.user?._id) {
      toast.error("You can't like your own post");
      return;
    }
    try {
      const res = await axios.patch(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/post/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedPost = res.data.data?.post || res.data.data;
      dispatch(likePost(updatedPost));

      setSearchResults((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
      );
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
        `https://social-media-platform-production-4442.up.railway.app/api/v1/post/${post._id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedPost = res.data.data?.post || res.data.data;
      dispatch(dislikePost(updatedPost));

      setSearchResults((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  useEffect(() => {
    getallPostsbysearch(id);
  }, [id]);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-4">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          ref={searchref}
        />

        <button
          className="search-btn"
          onClick={() => {
            const value = searchref.current?.value;
            if (!value?.trim()) return;
            go(`/search/${value}`);
            searchref.current.value = "";
          }}
        >
          search
        </button>
      </div>

      <h4 className="mb-4">Results for: {id}</h4>

      {searchResults.length === 0 && (
        <div className="w-100 vh-100 text-center">
          <h1>No Posts match this Search</h1>
        </div>
      )}

      <div className="mt-3">
        {!loading &&
          searchResults.map((item) => (
            <div className="card mb-3" key={item._id}>
              <div className="card-body">
                <div className="d-flex gap-2 align-items-center">
                  <img
                    src={
                      item.user?.profileImage
                        ? `https://social-media-platform-production-4442.up.railway.app/${item.user.profileImage}`
                        : "https://via.placeholder.com/45"
                    }
                    className="rounded-circle"
                    width="45"
                    height="45"
                    alt="avatar"
                  />
                  <div>
                    <Link
                      to={`/profile/${item.user?._id}`}
                      className="text-decoration-none"
                    >
                      <h6 className="m-0">
                        {item.user?.firstName} {item.user?.lastName}
                      </h6>
                    </Link>
                    <small>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </small>
                  </div>
                </div>

                <p className="mt-3">{item.title}</p>

                {item.image && (
                  <img
                    className="img-fluid rounded"
                    src={`https://social-media-platform-production-4442.up.railway.app/${item.image}`}
                    alt="post-img"
                  />
                )}

                <div className="post-actions d-flex gap-3 mt-3">
                  <button
                    className={`action-btn ${item.likes?.includes(user?._id) ? "liked" : ""}`}
                    onClick={() => handlelike(item)}
                  >
                    <AiOutlineLike /> <span>{item.likes?.length || 0}</span>
                  </button>
                  <button
                    className={`action-btn ${item.dislikes?.includes(user?._id) ? "disliked" : ""}`}
                    onClick={() => handledislike(item)}
                  >
                    <AiOutlineDislike />{" "}
                    <span>{item.dislikes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => go(`/${item._id}/comments`)}
                    className="action-btn"
                  >
                    <FaRegComment /> <span>{item.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Search;
