import React, { useRef } from "react";
import "./Login.css";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../../../socket.js";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../../Slice/userslice.js";

// توحيد الرابط في متغير ثابت لمنع نسيان البروتوكول
const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const go = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // تعديل الرابط هنا وإضافة الـ https:// عبر المتغير الموحد
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/login`,
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      localStorage.setItem("token", res.data.data.token);
      dispatch(setUser(res.data.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      toast.success("Login successful");
      go("/home");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error.response?.data?.message || error.message);
    }
  }

  async function handleForgetpassword() {
    try {
      // استخدام المتغير الموحد هنا أيضاً لضمان الأمان ونظافة الكود
      const res = await axios.post(`${BASE_URL}/api/v1/auth/forgetPassword`, {
        email: localStorage.getItem("email"),
      });
      toast.success(res.data.message);
      go("/resetpassword");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className="login">
      <Form onSubmit={handleSubmit}>
        <h1 className="text-center">Login</h1>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email" className="text-light">
            Email address
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            ref={emailRef}
            id="email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-1">
          <Form.Label htmlFor="password" className="text-light">
            Password
          </Form.Label>

          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
        </Form.Group>
        <div className="d-flex flex-column mb-2">
          <Link to={"/register"}>Register</Link>
          <Link onClick={handleForgetpassword}>Forget Password?</Link>
        </div>
        <div className="w-100 ">
          <button type="submit" className="w-100 login_btn">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
