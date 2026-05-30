import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./Profile.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../Slice/userslice";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.user.user);
  const [profileUser, setProfileUser] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const nameref = useRef();
  const lastNameref = useRef();
  const phoneref = useRef();
  const imageref = useRef();

  async function getUser() {
    try {
      const url = id
        ? `${BASE_URL}/api/v1/auth/getuser/${id}`
        : `${BASE_URL}/api/v1/auth/profile`;

      const res = await axios.get(url, { headers });
      setProfileUser(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  }

  async function getFollowers() {
    try {
      const url = id
        ? `${BASE_URL}/api/v1/follow/Followers`
        : `${BASE_URL}/api/v1/follow/Followers`;

      const res = await axios.get(url, { headers });
      const followersList = res.data.data || [];
      setFollowers(followersList);
    } catch (error) {
      console.log(error);
    }
  }

  async function getFollowing() {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/follow/Following`, {
        headers,
      });
      const followingList = res.data.data || [];
      setFollowing(followingList);

      if (id) {
        const check = followingList.some((item) => item.following?._id === id);
        setIsFollowing(check);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function countPosts() {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/post/count`, { headers });
      setPosts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFollow() {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/follow/Follow`,
        { followId: profileUser?._id },
        { headers },
      );

      toast.success(`You are now following ${profileUser?.firstName}`);
      setIsFollowing(true);
      getFollowers();
      getFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow");
    }
  }

  async function handleUnfollow() {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/follow/Unfollow`,
        { followId: profileUser?._id },
        { headers },
      );

      toast.success(`You unfollowed ${profileUser?.firstName}`);
      setIsFollowing(false);
      getFollowers();
      getFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfollow");
    }
  }

  async function handleMessage() {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/chat/`,
        {
          userId: profileUser?._id,
          currentUser: loggedInUser?._id,
        },
        { headers },
      );

      if (res.data.data?._id) {
        navigate(`/chat/${res.data.data._id}`);
      }
    } catch (error) {
      toast.error("Failed to open chat");
    }
  }

  async function editprofile() {
    try {
      const formdata = new FormData();

      if (imageref?.current?.files?.[0]) {
        formdata.append("profileImage", imageref.current.files[0]);
      }

      formdata.append("phone", phoneref.current.value);
      formdata.append("firstName", nameref.current.value);
      formdata.append("lastName", lastNameref.current.value);

      const res = await axios.put(
        `${BASE_URL}/api/v1/auth/UpdateProfile`,
        formdata,
        { headers },
      );

      const updatedUser = res.data.data;
      dispatch(updateProfile(updatedUser));
      setProfileUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(res.data.message || "Profile updated successfully");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }

  useEffect(() => {
    getUser();
    getFollowers();
    getFollowing();
    countPosts();
  }, [id]);

  return (
    <div className="profile-container">
      {/* PROFILE IMAGE */}
      <div className="profile">
        <img
          src={
            profileUser?.profileImage
              ? `${BASE_URL}/${profileUser.profileImage.replace(/\\/g, "/")}`
              : "/default.png"
          }
          alt="Profile"
        />
      </div>

      {/* NAME */}
      <div className="Name">
        <h1>
          {profileUser?.firstName} {profileUser?.lastName}
        </h1>
        <h3>{profileUser?.phone}</h3>
      </div>

      {/* INFO */}
      <div className="d-flex gap-3 justify-content-center my-3">
        <h4>Followers: {followers?.length || 0}</h4>
        <h4>Following: {following?.length || 0}</h4>
        <h4>Posts: {posts?.count || 0}</h4>
      </div>

      {/* BUTTONS */}
      <div className="d-flex justify-content-center gap-2">
        {loggedInUser?._id === profileUser?._id ? (
          <Button onClick={handleShow} className="EditProfile">
            Edit Profile
          </Button>
        ) : (
          profileUser && (
            <div className="d-flex gap-2">
              <button onClick={handleMessage} className="btn btn-primary">
                Message
              </button>

              {isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  className="btn btn-outline-danger"
                >
                  Unfollow
                </button>
              ) : (
                <button onClick={handleFollow} className="btn btn-success">
                  Follow
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        className="model_profile"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-2">
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                defaultValue={profileUser?.firstName}
                ref={nameref}
                placeholder="First Name"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                defaultValue={profileUser?.lastName}
                ref={lastNameref}
                placeholder="Last Name"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                defaultValue={profileUser?.phone}
                ref={phoneref}
                placeholder="Phone"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" ref={imageref} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editprofile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
