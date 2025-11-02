import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import { ToastContainer, toast } from 'react-toastify';

import Dashboard from "./pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/"); // if not logged in, go to landing
  }, [navigate]);

  return children;
}

export default function App() {
  return (
    <div className="">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
      
  );
}
