import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./VerfiyOtp.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../Slice/userslice";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function VerfiyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const go = useNavigate();
  const dispatch = useDispatch();

  async function handleVerfiy() {
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify_otp`, {
        otp: fullOtp,
        email: localStorage.getItem("email"),
      });

      toast.success(res.data.message || "OTP Verified Successfully!");

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userId", res.data.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      dispatch(setUser(res.data.data.user));

      go("/home");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecent() {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/recent_otp`, {
        email: localStorage.getItem("email"),
      });

      toast.success(res.data.message || "OTP Resent Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Verfiy">
      <div>
        <div className="otp-inputs mb-3">
          {otp.map((data, index) => {
            return (
              <input
                key={index}
                type="text"
                value={data}
                maxLength={1}
                onChange={(e) => {
                  const val = e.target.value;

                  if (/^[0-9]?$/.test(val)) {
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);

                    if (val && e.target.nextSibling) {
                      e.target.nextSibling.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !otp[index] &&
                    e.target.previousSibling
                  ) {
                    e.target.previousSibling.focus();
                  }
                }}
              />
            );
          })}
        </div>

        <div className="verfiy_buttons">
          <button onClick={handleVerfiy} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button onClick={handleRecent} disabled={loading}>
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerfiyOtp;
