import React from "react";
import "./side.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineMessage,
} from "react-icons/ai";
import { SlUserFollowing } from "react-icons/sl";

import { toast } from "react-hot-toast";
import { logoutUser } from "../../../Slice/userslice";
import { useDispatch, useSelector } from "react-redux";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Sidebar() {
  const go = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  console.log(user);

  const handleClick = async () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("notifications");
    localStorage.removeItem("userId");
    toast.success("Logout successful");
    go("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="d-flex flex-column justify-content-between side">
      <div>
        <nav className="side_item d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2 mb-2 px-2">
            <img
              className="profile_img"
              src={
                user?.profileImage
                  ? `${BASE_URL}/${user.profileImage.replace(/\\/g, "/")}`
                  : "/default-avatar.png"
              }
              alt="avatar"
              style={{ objectFit: "cover" }}
            />
            <div className="d-flex flex-column m-0 nan">
              <p className="m-0 p-0 fw-bold">
                {user?.firstName} {user?.lastName}
              </p>
              <small className="text-muted">{user?.email?.split("@")[0]}</small>
            </div>
          </div>

          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            <AiOutlineHome />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            <AiOutlineUser />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            <AiOutlineMessage />
            <span>Messages</span>
          </NavLink>

          <NavLink
            to="/friends"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            <AiOutlineUser />
            <span>Friends</span>
          </NavLink>

          <NavLink
            to="/following"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            <SlUserFollowing />
            <span>Following</span>
          </NavLink>
        </nav>
      </div>

      <div className="logout">
        <button className="logout_button" onClick={handleClick}>
          <AiOutlineLogout />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
