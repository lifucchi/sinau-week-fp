import React, { useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { EyeOpenIcon, EyeClosedIcon } from "../../assets/icons/index";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.token) {
        // Panggil fungsi login dan tunggu hingga selesai
        console.log("HALO");
        await login(response.data.token);

        setTimeout(() => {
          const role = Cookies.get("role");
          console.log("Role dari Cookies setelah login:", role);
          if (role === "Admin") {
            navigate("/admin-dashboard");
          } else if (role === "Cashier") {
            navigate("/pos");
          } else {
            setError("Role tidak dikenal.");
          }
        }, 100);
      }
    } catch (err) {
      setError("Login gagal. Periksa username dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col items-start w-full h-auto pt-[50px]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-7 w-[380px]">
        <div className="w-full">
          <label htmlFor="username" className="block text-base font-normal text-[#5E5E5E]">
            Username
          </label>
          <input type="text" id="username" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        </div>
        <div className="w-full relative">
          <label htmlFor="password" className="block text-base font-normal text-[#5E5E5E]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-2 cursor-pointer text-gray-400 opacity-50">
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </span>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/reset" className="text-xs text-[#ABABAB] hover:underline self-end">
        Forget Password?
      </Link>
      <div className="w-full pt-[30px]">
        <button type="submit" className={`w-full text-white pt-3 pb-3 mt-[5px] rounded-md focus:outline-none ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
      <div className="text-center mb-[100px]">
        <p className="text-sm mt-2 flex" style={{ color: "#919191" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#3572EF" }}>
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
