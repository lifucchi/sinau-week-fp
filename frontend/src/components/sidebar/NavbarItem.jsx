import React from "react";
import { NavLink } from "react-router-dom";

const NavbarItem = ({ to, Icon, label, isSidebarOpen }) => {
  return (
    <NavLink to={to} className={({ isActive }) => `relative flex items-center justify-start rounded-lg p-3.5 ${isActive ? "opacity-100 text-blue-600" : ""}`}>
      {/* Icon with dynamic stroke */}
      <Icon className={`w-[26px] h-[26px] stroke-current`} />

      {/* Conditionally render the label based on the isSidebarOpen state */}
      {isSidebarOpen && (
        <span className="ml-4">{label}</span> // Show label only when the sidebar is open
      )}

      {/* Accessibility */}
      <span className="sr-only">{label}</span>
    </NavLink>
  );
};

export default NavbarItem;
