import React, { useState } from "react";
import axios from "axios";
import { EyeOpenIcon, EyeClosedIcon } from "../../assets/icons/index";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        confirmPassword,
      });

      setSuccess("Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col items-start w-full max-w-[600px] h-auto pt-[50px]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-7 w-[380px]">
        <div className="w-full">
          <label htmlFor="username" className="block text-base font-normal text-[#5E5E5E]">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="email" className="block text-base font-normal text-[#5E5E5E]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="w-full relative">
          <label htmlFor="password" className="block text-base font-normal text-[#5E5E5E]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-opacity-100"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-2 cursor-pointer text-gray-400 opacity-50">
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </span>
        </div>

        <div className="w-full relative">
          <label htmlFor="confirmPassword" className="block text-base font-normal text-[#5E5E5E]">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 bottom-2 cursor-pointer text-gray-400 opacity-50">
            {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

      <div className="w-full pt-[30px]">
        <button type="submit" className="w-full bg-blue-500 text-white pt-3 pb-3 mt-[5px] rounded-md hover:bg-blue-600 focus:outline-none" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
      <div className="w-full text-center mb-[100px] flex justify-center">
        <p className="text-sm mt-2" style={{ color: "#919191" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3572EF" }}>
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
