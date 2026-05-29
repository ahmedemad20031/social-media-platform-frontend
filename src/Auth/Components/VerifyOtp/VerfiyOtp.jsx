import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./VerfiyOtp.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../Slice/userslice";

function VerfiyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const go = useNavigate();
  const dispatch = useDispatch();

  async function handleVerfiy() {
    try {
      const res = await axios.post(
        "https://social-media-platform-production-4442.up.railway.app/api/v1/auth/verify_otp",
        {
          otp: otp.join(""),
          email: localStorage.getItem("email"),
        },
      );

      toast.success(res.data.message);

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userId", res.data.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      dispatch(setUser(res.data.data.user));

      go("/home");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
      console.log(error.response?.data);
    }
  }

  async function handleRecent() {
    try {
      const res = await axios.post(
        "https://social-media-platform-production-4442.up.railway.app/api/v1/auth/recent_otp",
        {
          email: localStorage.getItem("email"),
        },
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
      console.log(error.response?.data);
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
                  const newOtp = [...otp];
                  newOtp[index] = e.target.value;
                  setOtp(newOtp);
                }}
              />
            );
          })}
        </div>

        <div className="verfiy_buttons">
          <button onClick={handleVerfiy}>VerfiyOtp</button>

          <button onClick={handleRecent}>RecentOtp</button>
        </div>
      </div>
    </div>
  );
}

export default VerfiyOtp;
