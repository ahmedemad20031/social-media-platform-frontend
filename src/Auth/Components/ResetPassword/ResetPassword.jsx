import React, { useRef, useState } from "react";
import "./Reset.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// توحيد الرابط في متغير ثابت لضمان الاستقرار ومنع أخطاء الروابط المدمجة
const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function ResetPassword() {
  const go = useNavigate();
  // تعديل المسافات إلى نصوص فارغة تماماً لضمان إرسال رمز الـ OTP بشكل صحيح للباك إند
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const passwordref = useRef();

  async function handleRest() {
    const fullOtp = otp.join("");

    // التحقق من أن المستخدم أدخل الـ OTP كاملاً المكون من 6 أرقام
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    if (!passwordref.current.value) {
      toast.error("Please enter your new password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/resetPassword`, {
        email: localStorage.getItem("email"),
        otp: fullOtp,
        password: passwordref.current.value,
      });
      toast.success(res.data.message || "Password reset successfully!");
      console.log(res.data);
      go("/");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/resendforgetotp`, {
        email: localStorage.getItem("email"),
      });
      toast.success(res.data.message || "OTP resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="resetPassword">
      <div className="main">
        <div className="Enter">
          <p className="text-light fs-5">Enter your Otp</p>
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
                  const val = e.target.value;
                  // السماح فقط بإدخال الأرقام وتحديث المصفوفة
                  if (/^[0-9]?$/.test(val)) {
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);

                    // حركة ذكية لتنقل التركيز (Focus) تلقائياً للمربع التالي عند الكتابة
                    if (val && e.target.nextSibling) {
                      e.target.nextSibling.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // العودة للمربع السابق تلقائياً عند الضغط على Backspace والمربع فارغ
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

        <button
          className="mt-4 w-100 bn"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Otp"}
        </button>

        <div className="rest">
          <p className="text-light fs-5">New Password</p>
          <input
            type="password"
            ref={passwordref}
            required
            minLength={6}
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
