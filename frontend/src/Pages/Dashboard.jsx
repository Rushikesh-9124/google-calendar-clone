import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import MainCalendar from "../components/MainCalendar/MainCalendar";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("Day"); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displaySidebar, setDisplaySidebar] = useState(true);

  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDate = (date) => {
    setCurrentDate(date);
  };

  return (
    <div className="flex flex-col h-screen transition-all">
      <Navbar
        setDisplaySidebar={setDisplaySidebar}
        currentDate={currentDate}
        onNextDay={handleNextDay}
        onPrevDay={handlePrevDay}
        onToday={handleToday}
        currentView={currentView}
        onViewChange={setCurrentView} 
      />

      <div className="flex flex-1 overflow-hidden">
        {displaySidebar && <Sidebar currentDate={currentDate} onSelectDate={handleSelectDate} />}
        <MainCalendar  currentDate={currentDate} currentView={currentView} /> 
      </div>
    </div>
  );
}
