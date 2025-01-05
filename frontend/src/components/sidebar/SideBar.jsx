import React, { useState } from "react";
import { LogoIcon, ArrowLeft, LogoIconExpand, ArrowRight } from "../../assets/icons";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";

const SideBar = () => {
  // State untuk mengontrol apakah sidebar terbuka atau tertutup
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className={`sticky top-0 left-0 bg-white  border-r flex flex-col justify-start transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[210px] items-start" : "w-[80px] items-center"} min-h-screen z-50`}>
        {/* Logo di atas sidebar */}
        <div className=" m-[15px] z-20 flex items-center">
          {/* Logo section */}
          {!isSidebarOpen ? (
            <LogoIcon className="w-[50px] h-[50px]" />
          ) : (
            <>
              <LogoIconExpand className="w-[50px] h-[50px]" />
              {/* Arrow button to toggle sidebar */}
              <button className="p-4 text-gray-600" onClick={toggleSidebar}>
                <ArrowRight />
              </button>
            </>
          )}
        </div>
        {!isSidebarOpen ? (
          <button className="text-gray-600 p-[27px] border-t border-b" onClick={toggleSidebar}>
            <ArrowLeft />
          </button>
        ) : null}
        {/* Navigasi Menu */}
        <div>
          {/* Pass isSidebarOpen and toggleSidebar as props to Navbar */}
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          {/* Your other content */}
        </div>
      </div>
    </>
  );
};

export default SideBar;
