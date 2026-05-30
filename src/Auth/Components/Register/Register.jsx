import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import "./Register.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../Loading/Loading";

// توحيد الرابط في متغير ثابت لضمان إرسال الطلبات مباشرة للسيرفر أونلاين
const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function Register() {
  const [loading, setLoading] = React.useState(false);

  const nameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const profileRef = useRef();
  const phoneRef = useRef();

  const go = useNavigate();

  async function handlesubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("firstName", nameRef.current.value);
      formData.append("lastName", lastnameRef.current.value);
      formData.append("email", emailRef.current.value);
      formData.append("password", passwordRef.current.value);
      formData.append("phone", phoneRef.current.value);
      formData.append("profileImage", profileRef.current.files[0]);

      // استخدام المتغير الموحد BASE_URL هنا
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      localStorage.setItem("email", emailRef.current.value);
      toast.success(res.data.message || "Registration successful!");
      go("/verify-otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register">
      <Form className="register-form p-3" onSubmit={handlesubmit}>
        <h1 className="text-center text-light">Register</h1>

        <div className="d-flex justify-content-between">
          <Form.Group className="mb-3 Name_input">
            <Form.Label htmlFor="firstname" className="text-light">
              First Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              ref={nameRef}
              id="firstname"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 Name_input">
            <Form.Label htmlFor="lastname" className="text-light">
              Last Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter lastname"
              ref={lastnameRef}
              id="lastname"
              required
            />
          </Form.Group>
        </div>

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
            autoComplete="email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password" className="text-light">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            ref={passwordRef}
            id="password"
            autoComplete="new-password"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="profile" className="text-light">
            Profile
          </Form.Label>
          <Form.Control
            type="file"
            placeholder="Enter profile information"
            ref={profileRef}
            id="profile"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="phone" className="text-light">
            Phone
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            ref={phoneRef}
            id="phone"
            required
          />
        </Form.Group>

        <button type="submit" disabled={loading} className="w-100">
          {loading ? "Creating Account..." : "Submit"}
        </button>
      </Form>
    </div>
  );
}

export default Register;
