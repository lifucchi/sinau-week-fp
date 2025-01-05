import React, { useState, useEffect } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "../../assets/icons/index";
import { API_URL } from "../../config/api";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import axios from "axios";

const ResetForm = ({ setIsEmailSubmitted, isEmailSubmitted }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setIsEmailSubmitted(true);
      setStep(2);
    } else {
      if (password === confirmPassword) {
        try {
          // const email = email;
          console.log(email);
          // Kirim permintaan ke server
          const response = await axios.put(
            `${API_URL}/auth/change-password`,
            {
              email,
              newPassword: password,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );

          alert(response.data.message);
          navigate("/login");
        } catch (error) {
          console.error("Error updating password:", error);
          alert(error.response?.data?.message || "Failed to update password. Try again.");
        }
        console.log("Password Reset Successfully!");
      } else {
        alert("Passwords do not match!");
      }
    }
  };
  useEffect(() => {
    console.log("isEmailSubmitted updated:", isEmailSubmitted);
  }, [isEmailSubmitted]);

  return (
    <form className="flex flex-col items-start w-full max-w-[600px] h-auto pt-[50px]" onSubmit={handleSubmit}>
      {step === 1 ? (
        <div className="flex flex-col gap-7 w-[380px]">
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
        </div>
      ) : (
        <div className="flex flex-col gap-7 w-[380px]">
          <div className="w-full">
            <label htmlFor="password" className="block text-base font-normal text-[#5E5E5E]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2 cursor-pointer text-gray-400 opacity-50"
                style={{ width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {showPassword ? <EyeOpenIcon style={{ width: "100%", height: "100%" }} /> : <EyeClosedIcon style={{ width: "100%", height: "100%" }} />}
              </span>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="confirmPassword" className="block text-base font-normal text-[#5E5E5E]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-2 cursor-pointer text-gray-400 opacity-50"
                style={{ width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {showPassword ? <EyeOpenIcon style={{ width: "100%", height: "100%" }} /> : <EyeClosedIcon style={{ width: "100%", height: "100%" }} />}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full pt-[30px]  mb-[100px]">
        <button type="submit" className="w-full bg-blue-500 text-white pt-3 pb-3 mt-[5px] rounded-md hover:bg-blue-600 focus:outline-none">
          {step === 1 ? "Submit" : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetForm;
