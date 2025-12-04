import login_image from "../assets/login_image.svg";
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
const activeClass = "underline font-bold text-blue-600";
const inactiveClass = "hover:underline";

  return (
  <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-between">

    <div className="px-3">

      {/* Top Navigation */}
      <div className="flex justify-center md:justify-end gap-4 py-3 text-sm md:text-lg font-semibold text-[#0050AA]">
        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Admin
          </NavLink>

          <NavLink
            to="/client"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Client
          </NavLink>

          <NavLink
            to="/client-user"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Client User
          </NavLink>
        </nav>
      </div>
      </div>
      {/* Logo Section */}
      <div className="items-center ">
      
      <div className="flex flex-col items-center mb-10 md:mb-0">
        <img src={aryu_logo} alt="aryu logo" className="w-20 mb-1" />
        <p className="text-lg md:text-xl font-semibold text-[#0050AA]">
          ARYU PORTAL
        </p>
      </div>
      

      {/* Login Box */}
     
      <div className="flex justify-between ">
        <div className="w-full max-w-lg bg-white shadow-xl text-center rounded-3xl p-4 md:p-10">
          <h1 className="text-[#0050aa] text-xl md:text-3xl text-center font-semibold mb-6">
            ADMIN LOGIN
          </h1>

          {/* Username */}
          <div className="w-full flex items-center gap-3 bg-[#F8F9FB] px-4 py-3 rounded-xl shadow-sm border">
            <LuUser className="text-xl text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              name="email"
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
              className="bg-transparent w-full outline-none"
            />
          </div>
          {error?.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}

          {/* Password */}
          <div className="relative w-full flex items-center gap-3 bg-[#F8F9FB] px-4 py-3 rounded-xl shadow-sm border mt-4">
            <SlLock className="text-xl text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
              className="bg-transparent w-full outline-none"
            />

            <span
              className="absolute right-4 cursor-pointer text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error?.message && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}

          {/* Login Button */}
          <button
            onClick={onCLickLogin}
            className="mt-3 bg-gradient-to-r from-[#004faac3] to-[#0050aa] px-10 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>

    <div className="mt-3">
      <Footer />
    </div>

  </div>
);

};

export default Login;
