import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  HelpCircle,
  Settings,
  CalendarDays,
  CheckCircle2,
  Grid,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from '../../../public/calendar_1_2x-removebg-preview.png'

export default function Navbar({
  setDisplaySidebar,
  currentDate,
  onNextDay,
  onPrevDay,
  onToday,
  currentView,
  onViewChange = () => {},
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowViewMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const viewOptions = ["Day", "Week", "Month", "Year", "Schedule", "4 days"];

  return (
    <nav className="w-full flex items-center justify-between bg-black/2  px-4 py-3 relative">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full cursor-pointer hover:bg-gray-100">
          <Menu size={22} onClick={()=>setDisplaySidebar(prev => !prev)} />
        </button>

        <div className="flex items-center gap-2 md:mr-8">
          <div className="relative">
            <img className="h-[42px] w-[42px]" src={logo} alt="" />
            <span className=" text-blue-600 top-2 left-2 md:left-4 absolute  text-md font-medium">
          {currentDate.toLocaleDateString("en-GB", {
            day: "numeric",
          })}
          </span>
          </div>
          <h1 className="text-xl hidden md:block font-light text-gray-800">Calendar</h1>
        </div>

        <button
          onClick={onToday}
          className="ml-3 md:ml-6 border cursor-pointer rounded-full px-2 md:px-5 active:bg-gray-400/50 transition-all duration-300 py-1 md:py-2 text-sm hover:bg-gray-100"
        >
          Today
        </button>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onPrevDay}
            className="p-1.5 cursor-pointer transition-all  hover:bg-gray-300/80 rounded-full"
          >
            <ChevronLeft size={21} />
          </button>
          <button
            onClick={onNextDay}
            className="p-1.5 cursor-pointer transition-all  hover:bg-gray-300/80 rounded-full"
          >
            <ChevronRight size={21} />
          </button>
        </div>

        <span className="ml-3 text-gray-700 hidden md:block  md:text-2xl font-light">
          {currentDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="flex items-center gap-3 relative">
        <button className="p-2 hidden lg:block rounded-full hover:bg-gray-300 transition-all duration-300">
          <Search size={20} />
        </button>
        <button className="p-2 hidden lg:block rounded-full hover:bg-gray-300 transition-all duration-300">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 hidden lg:block rounded-full hover:bg-gray-300 transition-all duration-300">
          <Settings size={20} />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowViewMenu((prev) => !prev)}
            className="border rounded-full px-2 md:px-5 py-1 md:py-2 text-sm flex items-center gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-300"
          >
            {currentView || "Day"} <ChevronDown size={14} />
          </button>

          {showViewMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-blue-50 drop-shadow-2xl  shadow-md rounded-md z-20">
              {viewOptions.map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    onViewChange(view);
                    setShowViewMenu(false);
                  }}
                  className={`w-full flex justify-between text-left px-4 py-2 text-sm hover:bg-gray-300 ${
                    currentView === view
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : ""
                  }`}
                >
                  {view} <span className="text-xs font-light">{view.slice(0, 1)}</span>
                </button>
              ))}

              <hr className="my-1" />
              <div className="px-4 py-2 text-xs text-gray-500">
                Show weekends
              </div>
              <div className="px-4 py-2 text-xs text-gray-700">
                ✓ Show declined events
              </div>
              <div className="px-4 py-2 text-xs text-gray-700">
                ✓ Show completed tasks
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200  transition-all duration-300 hidden lg:block">
          <CalendarDays size={20} />
        </button>
        <button className="p-2 rounded-full hidden lg:block hover:bg-gray-300 transition-all duration-300">
          <CheckCircle2 size={20} />
        </button>
        <button className="p-2 rounded-full hidden lg:block hover:bg-gray-300 transition-all duration-300">
          <Grid size={18} />
        </button>

        <div
          className="relative"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-md font-bold text-black cursor-pointer">
            {user?.name?.slice(0, 1)?.toUpperCase()}
          </div>

          {showLogout && (
            <div className="absolute right-0  w-28 bg-white shadow-md rounded-lg text-center">
              <button
                onClick={handleLogout}
                className="w-full text-sm py-2 hover:bg-gray-100/70 cursor-pointer text-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
