import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard"); 
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-100 via-white to-purple-100">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-blue-700">Google Calendar Clone</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center flex-1 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Organize your schedule effortlessly
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Stay on top of your meetings, tasks, and plans — all in one smart,
          simple, and beautiful calendar.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </main>

      <footer className="text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} Google Calendar Clone. All rights reserved.
      </footer>
    </div>
  );
}
