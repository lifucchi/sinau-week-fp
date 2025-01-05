import React from "react";
import { MenuSetting, MenuReport, MenuDashboard, MenuMenu, MenuCashier } from "../../assets/icons/index";
import NavbarItem from "./NavbarItem"; // Import NavbarItem
import Cookies from "js-cookie"; // Import js-cookie untuk mengambil cookies

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const userRole = Cookies.get("role");

  return (
    <nav className="flex flex-col mt-8 space-y-4 min-w-screen">
      {/* Menu untuk Admin */}
      {userRole === "Admin" && (
        <>
          <NavbarItem to="/admin-dashboard" Icon={MenuDashboard} label="Dashboard" isSidebarOpen={isSidebarOpen} />
          <NavbarItem to="/catalog" Icon={MenuMenu} label="Catalog" isSidebarOpen={isSidebarOpen} />
          <NavbarItem to="/salesreport" Icon={MenuReport} label="Sales Report" isSidebarOpen={isSidebarOpen} />
          <NavbarItem to="/settings" Icon={MenuSetting} label="Settings" isSidebarOpen={isSidebarOpen} />
        </>
      )}

      {/* Menu untuk Kasir */}
      {userRole === "Cashier" && (
        <>
          <NavbarItem to="/pos" Icon={MenuCashier} label="Dashboard" isSidebarOpen={isSidebarOpen} />
          <NavbarItem to="/cashier-salesreport" Icon={MenuReport} label="Sales Report" isSidebarOpen={isSidebarOpen} />
          <NavbarItem to="/settings" Icon={MenuSetting} label="Settings" isSidebarOpen={isSidebarOpen} />
        </>
      )}
    </nav>
  );
};

export default Navbar;
