import React, { useContext, useEffect, useState } from "react";
import { Search, LogoutIcon, ArchiveShow } from "../../assets/icons/index";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config/api";

import ArchivePopup from "../popup/ArchivePopUp";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState("Guest");
  const [role, setRole] = useState("");
  const [pic, setPic] = useState("");
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  useEffect(() => {
    const userProfile = Cookies.get("profile");
    const userRole = Cookies.get("role");
    const profilepic = Cookies.get("profilepic");

    if (userProfile) {
      try {
        const userData = JSON.parse(userProfile);
        setProfile(userData.username);
      } catch (error) {
        console.error("Failed to parse user profile:", error);
      }
    }
    if (userRole) setRole(userRole);
    if (profilepic) setPic(profilepic);
  }, []);

  useEffect(() => {}, [isArchiveOpen]);

  return (
    <div className="header-container">
      <div className="relative w-full h-[80px] bg-white border-b border-[#F7F7F7]">
        <div className="absolute top-0 right-0 flex items-center justify-between w-full h-full px-6">
          {/* Search Box */}
          <div className="relative w-[500px] h-[42px] bg-white border border-[#EBEBEB] rounded-[10px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input type="search" placeholder="Enter the keyword here..." className="w-full h-full px-10 pl-10 outline-none rounded-lg border border-gray-300 text-gray-700 placeholder-gray-500" />
          </div>

          {/* User Profile */}
          <div
            className="user-profile flex flex-row items-center gap-2 absolute"
            style={{
              right: "50px",
              top: "15px",
              width: "500 px",
              height: "50px",
            }}
          >
            <div>
              {role !== "Admin" && (
                <div onClick={() => setIsArchiveOpen(true)} className="flex-1 min-w-max whitespace-nowrap mr-8 text-gray-600 flex items-center gap-2">
                  <span className="z-50">
                    <ArchiveShow />
                  </span>
                  <div>Order Archive</div>
                </div>
              )}
            </div>
            {/* Profile Icon */}
            <div className="profile-icon w-8 h-8 rounded-full bg-gray-300">
              <img src={pic ? `${BASE_URL}${pic}` : null} alt="Profile" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col ml-2 hidden md:flex">
              <span className="text-[12px] text-gray-800">{profile}</span>
              <span className="text-[10px] text-gray-400">{role}</span>
            </div>
            <div>
              {auth.isAuthenticated && (
                <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-700">
                  <LogoutIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Archive Popup */}
      <ArchivePopup isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </div>
  );
};

export default Header;
