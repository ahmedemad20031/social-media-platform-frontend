import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Components/Login/Login";
import Register from "./Auth/Components/Register/Register";
import VerfiyOtp from "./Auth/Components/VerifyOtp/VerfiyOtp";
import ResetPassword from "./Auth/Components/ResetPassword/ResetPassword";
import NotFound from "./Auth/Components/NotFound/NotFound";
import Likes from "./main/Likes/Likes";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import Profile from "./main/Profile/Profile";
import Comments from "./main/Comments/Comments";
import { useSelector } from "react-redux";
import "./App.css";
import Home from "./main/Home/Home";
import Chat from "./main/Chat/Chat";
import Notification from "./main/Notification/Notification";
import socket from "./socket";
import Frineds from "./main/Friends/Frineds";
import Following from "./main/Following/Following";
import Layout from "./main/Layout/Layout"; // تفعيل الليأوت لو تحب
import Search from "./main/Search/Search";

function App() {
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user._id) {
      const userId = user._id.toString();

      const emitAddUser = () => {
        socket.emit("addUser", userId);
        console.log("Socket: User added successfully ->", userId);
      };

      if (socket.connected) {
        emitAddUser();
      } else {
        socket.once("connect", emitAddUser);
      }

      return () => {
        socket.off("connect", emitAddUser);
      };
    }
  }, [user]);

  return (
    <div>
      <Toaster position="top-center" />
      <Routes>
        {/* مسارات المصادقة (مستقرة ولا تتأثر) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerfiyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        {/* المسارات الثابتة الواضحة صريحة (وضعناها بالأعلى لتجنب التضارب) */}
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/friends" element={<Frineds />} />
        <Route path="/following" element={<Following />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:id" element={<Search />} />
        {/* المسارات الديناميكية (تم نقلها للأسفل عشان الـ Router يطابق الثوابت أولاً) */}
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/posts/:id/likes" element={<Likes />} />{" "}
        {/* 💡 نصيحة: تغيير /:id/likes لـ /posts/:id/likes يمنع أي تضارب مستقبلي كلياً */}
        <Route path="/posts/:id/comments" element={<Comments />} />
        {/* صفحة الخطأ الافتراضية */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
