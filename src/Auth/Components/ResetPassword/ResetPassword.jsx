import React, { useRef, useState } from "react";
import "./Reset.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const go = useNavigate();
  const [otp, setOtp] = useState([" ", " ", " ", " ", " ", " "]);
  const [loading, setLoading] = useState(false);
  const passwordref = useRef();
  async function handleRest() {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/resetPassword",
        {
          email: localStorage.getItem("email"),
          otp: otp.join(""),
          password: passwordref.current.value,
        },
      );
      toast.success(res.data.message);
      console.log(res.data);
      go("/");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
      // console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/resendforgetotp",
        {
          email: localStorage.getItem("email"),
        },
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="resetPassword">
      <div className="main">
        <div className="Enter">
          <p className="text-light fs-5 ">Enter your Otp</p>
        </div>

        <div className="inputs">
          {otp.map((data, index) => {
            return (
              <input
                type="text"
                key={index}
                value={data}
                maxLength={1}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[index] = e.target.value;
                  setOtp(newOtp);
                }}
              />
            );
          })}
        </div>
        <button className="mt-4 w-100 bn" onClick={handleResend}>
          Resend Otp
        </button>
        <div className="rest">
          <p className="text-light fs-5">New Password</p>
          <input
            type="password"
            ref={passwordref}
            required
            minLength={1}
            placeholder="Enter your New password"
          />
        </div>
        <button
          className="mt-4 w-100 bn"
          onClick={handleRest}
          disabled={loading}
        >
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
