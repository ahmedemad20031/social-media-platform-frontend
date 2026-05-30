import React, { useState, useEffect, useRef } from "react";
import { Navbar as NAVBAR, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import socket from "../../socket.js";
import { FaBell } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "../../../Slice/notificaionslice.js";
import { NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const [theme, setTheme] = useState("light");

  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const searchinput = useRef();

  const notifications = useSelector(
    (state) => state.notifications.notifications || [],
  );

  const user = useSelector((state) => state.user.user);
  const currentUserId = user?._id;

  console.log(user);
  const unreadCount = notifications.filter((n) => !n.read).length;
  console.log(unreadCount);

  const go = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("addUser", currentUserId);
    });

    socket.on("getNotification", (data) => {
      dispatch(setNotifications(data));

      console.log("New notification received:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("getNotification");
    };
  }, [currentUserId, dispatch]);

  return (
    <div className="Nav">
      <h4 className="logo">ConnectHub</h4>
      <div className="search">
        <input
          className="search_input"
          type="search"
          placeholder="Search...."
          ref={searchinput}
        />
        <button
          className="icon_button"
          onClick={() => go(`/search/${searchinput.current.value}`)}
        >
          <CiSearch />
        </button>
      </div>
      <NAVBAR className="mobile_nav">
        <Nav className="mobile_nav_links">
          <Nav.Link as={NavLink} to="/home">
            <AiOutlineHome className="i" />
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/notifications"
            className="position-relative"
          >
            <FaBell className="i" />

            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Nav.Link>

          <Nav.Link as={NavLink} to="/profile">
            <img
              className="nav_img"
              src={
                user?.profileImage
                  ? `http://localhost:5000/${user.profileImage}`
                  : "/default-avatar.png"
              }
              alt="profile"
            />
          </Nav.Link>
        </Nav>
      </NAVBAR>
    </div>
  );
}

export default Navbar;
