import React from "react";
import {
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiOutlineBell,
  AiOutlineUser,
} from "react-icons/ai";
import "./footer.css";
import { useNavigate } from "react-router-dom";

function FooterRigth({ setShowSidebar, setShowLeft, userId }) {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="button-footer">
      <button
        className="footer-icon-btn"
        title="Menu"
        onClick={() => {
          setShowSidebar(true);
          setShowLeft(false);
        }}
      >
        <AiOutlineMenu size={24} />
      </button>
      <button
        className="footer-icon-btn"
        title="Search"
        onClick={() => navigate("/search")}
      >
        <AiOutlineSearch size={24} />
      </button>

      <button
        className="footer-icon-btn"
        title="Create Post"
        onClick={scrollToTop}
      >
        <AiOutlinePlusCircle size={24} />
      </button>

      <button
        className="footer-icon-btn"
        title="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <AiOutlineBell size={24} />
      </button>

      <button
        className="footer-icon-btn"
        title="Profile"
        onClick={() => {
          setShowLeft(true);
          setShowSidebar(false);
        }}
      >
        <AiOutlineUser size={24} />
      </button>
    </div>
  );
}

export default FooterRigth;
