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

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.user.user);

  const [profileUser, setProfileUser] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const nameref = useRef();
  const lastNameref = useRef();
  const phoneref = useRef();
  const imageref = useRef();

  async function getUser() {
    try {
      let url = "";

      if (id) {
        url = `http://localhost:5000/api/v1/auth/getuser/${id}`;
      } else {
        url = `http://localhost:5000/api/v1/auth/profile`;
      }

      const res = await axios.get(url, { headers });

      setProfileUser(res.data.data);
    } catch (error) {
      toast.error(error.response?.data || "Failed to fetch user data");
      console.log(error.response?.data || error.message);
    }
  }

  async function getFollowers() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/follow/Followers",
        { headers },
      );

      setFollowers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getFollowing() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/follow/Following",
        { headers },
      );

      setFollowing(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function countPosts() {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/count", {
        headers,
      });

      setPosts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFollow() {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/follow/Follow",
        {
          followId: profileUser._id,
        },
        { headers },
      );

      toast.success(`You are now following ${profileUser.firstName}`);

      getFollowers();
      getFollowing();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUnfollow() {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/follow/Unfollow",
        {
          followId: profileUser._id,
        },
        { headers },
      );

      toast.success(`You unfollowed ${profileUser.firstName}`);

      getFollowers();
      getFollowing();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMessage() {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/chat/",
        {
          userId: profileUser._id,
          currentUser: loggedInUser._id,
        },
        { headers },
      );

      navigate(`/chat/${res.data.data._id}`);
    } catch (error) {
      console.log(error);
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
        "http://localhost:5000/api/v1/auth/UpdateProfile",
        formdata,
        {
          headers,
        },
      );

      const updatedUser = res.data.data;

      dispatch(updateProfile(updatedUser));

      setProfileUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(res.data.message);

      handleClose();
    } catch (error) {
      console.log(error);
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
              ? `http://localhost:5000/${profileUser.profileImage}`
              : "/default.png"
          }
          alt=""
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
      <div className="d-flex gap-3 justify-content-center">
        <h4>Followers: {followers.length}</h4>

        <h4>Following: {following.length}</h4>

        <h4>Posts: {posts?.count}</h4>
      </div>

      {/* BUTTONS */}
      <div className="d-flex justify-content-center gap-2">
        {loggedInUser?._id === profileUser?._id && (
          <Button onClick={handleShow} className="EditProfile">
            Edit Profile
          </Button>
        )}

        {loggedInUser?._id !== profileUser?._id && (
          <div>
            <button onClick={handleMessage} className="m-1">
              Message
            </button>

            {following.some(
              (item) => item.following?._id === profileUser?._id,
            ) ? (
              <button onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button onClick={handleFollow}>Follow</button>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} className="model_profile">
        <Modal.Body>
          <Form className="d-flex flex-column gap-2">
            <Form.Control
              defaultValue={profileUser?.firstName}
              ref={nameref}
              placeholder="First Name"
            />

            <Form.Control
              defaultValue={profileUser?.lastName}
              ref={lastNameref}
              placeholder="Last Name"
            />

            <Form.Control
              defaultValue={profileUser?.phone}
              ref={phoneref}
              placeholder="Phone"
            />

            <Form.Control type="file" ref={imageref} />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={editprofile}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
