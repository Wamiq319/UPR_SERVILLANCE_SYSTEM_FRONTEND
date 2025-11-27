import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  Settings,
  Database,
  BookOpen,
} from "lucide-react";
import Logo from "@/assets/LOGO.png";
import { Button } from "@/components";

const SidebarMenus = [
  { label: "Dashboard", path: "/admin/dashboard", Icon: Home },
  { label: "Records", path: "/admin/records", Icon: Database },
  { label: "Attendance Reports", path: "/admin/attendance", Icon: Users },
  { label: "Student Reports", path: "/admin/students_reports", Icon: Users },
  { label: "Course Reports", path: "/admin/course_reports", Icon: BookOpen },
  {
    label: "Live Attendance Reports",
    path: "/admin/live_attendance",
    Icon: BookOpen,
  },
  {
    label: "Live Surveillance",
    path: "/admin/live_surveillance",
    Icon: BookOpen,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 w-12 h-12 flex items-center justify-center 
          bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-5 flex flex-col
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Link
            to="/admin/dashboard"
            className="flex flex-col items-center justify-center gap-2 text-green-600"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-3 w-24 h-24 flex items-center justify-center">
              <img src={Logo} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
            <span className="font-bold text-lg mt-3">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {SidebarMenus.map(({ label, Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
