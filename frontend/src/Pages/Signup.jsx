import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = form.name;
    const email = form.email;
    const password = form.password;

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const res = await axiosInstance.post("/signup", {
        name,
        email,
        password,
      });

      if (res.data && res.data.success) {
        const token = res.data.accessToken;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("SignUp successful!");
        navigate("/dashboard");
        return;
      }else {
        toast.error(res.data.message || "SignUp failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create your account
        </h2>

        <form className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full outline-none text-sm"
            />
          </div>

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
            type="submit"
            onClick={handleSignUp}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
