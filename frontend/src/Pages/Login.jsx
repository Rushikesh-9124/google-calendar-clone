import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async(e) => {
    e.preventDefault()
    const email = form.email
    const password = form.password

    if(!email || !password){
        toast.error("All fields are required!")
        return
    }
    try {
        const res = await axiosInstance.post('/login', {
            email,
            password
        })
        if (res.data && res.data.success) {
            const token = res.data.accessToken;
    
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Login successful!");
            navigate("/dashboard");
          } else {
            toast.error(res.data.message || "Login failed");
          }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Welcome back
        </h2>

        <form className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail size={18} className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full outline-none text-sm"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full outline-none text-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
