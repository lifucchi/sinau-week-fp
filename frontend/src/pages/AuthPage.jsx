import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import ResetForm from "../components/forms/ResetForm";
import RegisterForm from "../components/forms/RegisterForm";
import loginImage from "../assets/img/login/2eb33a1f49044a8e256977d2636f3d06.png";
import { LogoLogin } from "../assets/icons/index";

const AuthPage = () => {
  const location = useLocation();
  const isReset = location.pathname === "/reset";
  const isRegister = location.pathname === "/register";

  // State untuk mengatur tahap reset password
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleEmailSubmit = () => {
    setIsEmailSubmitted(true);
  };

  return (
    <div className="flex relative w-full h-screen bg-white overflow-scroll">
      <div
        className="absolute w-full h-full top-0 left-0 bg-cover bg-center sm:bg-contain"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundPosition: "top",
          backgroundSize: "cover",
          position: "sticky",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-15"></div> {/* Overlay Gradient */}
      </div>

      {/* Form Container */}
      <div
        className="
    flex flex-col items-center justify-center 
    px-4 sm:px-8 md:px-16 lg:px-20 
    bg-white border-4 border-[#F7F7F7] shadow-lg rounded-[20px]
    relative sm:relative md:relative lg:absolute
    sm:top-auto md:top-auto lg:top-[50%]
    sm:left-auto md:left-auto lg:left-[30%]
    sm:transform-none md:transform-none lg:translate-x-[-50%] lg:translate-y-[-50%]
  "
        style={{
          boxSizing: "border-box",
          minHeight: "auto",
          height: "auto",
        }}
      >
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center justify-center w-32 h-12 mt-[50px]">
            <div>
              <LogoLogin />
            </div>
          </div>
          <div className="text-center mt-[30px]">
            <h2 className="text-4xl font-medium text-black ">{isReset ? "Reset Password" : "Welcome Back!"}</h2>
            <p className="text-sm mt-2" style={{ color: "#919191" }}>
              {isReset ? (isEmailSubmitted ? "Please enter your registered email here!" : "Please enter your new password and confirm.") : isRegister ? "Create your account here!" : "Please enter your username and password here!"}
            </p>
          </div>
          {isReset ? <ResetForm setIsEmailSubmitted={setIsEmailSubmitted} isEmailSubmitted={isEmailSubmitted} /> : isRegister ? <RegisterForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
