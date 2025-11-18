import login_image from "../assets/login_image.svg";
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config.js";
import { useState } from "react";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Footer from "../components/Footer.jsx";
import medics_logo from "../assets/medics_logo.svg";

import aryu_logo from "../assets/aryu_logo.svg";

const Login = () => {
  let navigate = useNavigate();

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function onCLickLogin() {
  // const onCLickLogin = async (e) => {
  //   setError("");
  //   e.preventDefault();
  //   try {
  //     // Make API request to login
  //     const response = await axios.post(`${API_URL}/api/auth/login`, formData);
  //     console.log(response);
  //     if (response.data && response.data.token) {
  //       const data = response.data;
  //       console.log(data.user);
  //       // Store user data and token
  //       localStorage.setItem("hrmsuser", JSON.stringify(data.user)); // Corrected: JSON.stringify
  //       Cookies.set("token", data.token, { path: "/" }); // Corrected: path adjusted

  //       // Navigate to the dashboard
  //       console.log("login redirect..");

  //       navigate("/dashboard", { replace: true }); // 'replace' avoids adding to history stack
  //       window.location.reload();
  //       console.log("hello");
  //       // Scroll to the top of the page
  //       window.scrollTo({
  //         top: 0,
  //         behavior: "instant",
  //       });
  //     }else if (response.data && response.data.message) {

  //     }

  //     else {
  //       setError({ general: "Login failed, token not found." });
  //     }
  //   } catch (err) {
  //     console.log(err.response.data);
  //     if (err.response) {
  //       setError(err.response.data);
  //     } else {
  //       setError({ general: "An unexpected error occurred." });
  //     }
  //   }
  // };
  const onCLickLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const type="admin";
      const response = await axios.post(`${API_URL}/api/auth/login/${type}`, formData);

      if (response.data && response.data.token) {
        const data = response.data;

        // Store user data and token
        localStorage.setItem("hrmsuser", JSON.stringify(data.user));
        Cookies.set("token", data.token, { path: "/" });
        localStorage.setItem("admin_token",data.token);
         localStorage.setItem("loginTime", Date.now());
        //  Redirect based on backend response
        navigate(data.redirect || "/dashboard", { replace: true });

        // Optional refresh
        window.scrollTo({ top: 0, behavior: "instant" });
        window.location.reload();
      } else {
        console.log("error",response);
        setError({ general: "Login failed, token not found." });
      }
    } catch (err) {
      console.log(err.response?.data || err);
      setError(
        err.response?.data || { general: "An unexpected error occurred." }
      );
    }
  };

  const handleKeyUp = (event) => {
    setError("");
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility state
  };

  return (
   <div className="min-h-screen bg-[#F3F4F6] flex flex-col">

  {/* Top Navigation */}
  <div className="flex justify-end gap-6 px-8 py-4 text-lg font-semibold text-[#0050AA]">
    <Link to="/client" className="hover:underline">Client Login</Link>
    {/* <Link to="/client-user" className="hover:underline">Client User Login</Link> */}
  </div>

  {/* Logo */}
  <div className="flex justify-center mt-4">
    <img src={aryu_logo} alt="Logo" className="w-20" />
  </div>

  {/* Main Content */}
  <div className="flex flex-1 items-center justify-center px-4">
    <div className="flex w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden">

      {/* Left Section (Form) */}
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h1 className="text-[#0050aa] font-bold text-3xl md:text-4xl mb-6">
          HRMS ADMIN LOGIN
        </h1>

        {/* Username Field */}
        <div className="w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 rounded-xl shadow-sm border border-gray-200">
          <LuUser className="text-2xl text-gray-500" />
          <input
            type="text"
            placeholder="Username"
            name="email"
            id="email"
            onChange={handleInputChange}
            className="bg-transparent w-full outline-none text-black placeholder-gray-500"
            onKeyUp={handleKeyUp}
          />
        </div>
        {error?.email && (
          <p className="text-red-500 text-sm mt-1">{error.email}</p>
        )}

        {/* Password Field */}
        <div className="relative w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 mt-4 rounded-xl shadow-sm border border-gray-200">
          <SlLock className="text-2xl text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            id="password"
            onChange={handleInputChange}
            className="bg-transparent w-full outline-none text-black placeholder-gray-500"
            onKeyUp={handleKeyUp}
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-4 cursor-pointer text-gray-600"
          >
            {showPassword ? (
              <FaEye className="text-xl" />
            ) : (
              <FaEyeSlash className="text-xl" />
            )}
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}

        {/* Login Button */}
        <button
          onClick={onCLickLogin}
          className="mt-6 bg-gradient-to-r from-[#004faac3] to-[#0050aa] px-10 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Login Now
        </button>
      </div>

      {/* Right Section (Image) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EEF3FF] items-center justify-center">
        <img src={login_image} alt="Login Illustration" className="w-[480px] drop-shadow-lg" />
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
};

export default Login;
