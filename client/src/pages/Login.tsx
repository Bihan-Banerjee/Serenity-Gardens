"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/loaders/RainbowLoader";
import { useLoader } from "@/hooks/useLoader";
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loading, runWithLoader } = useLoader(1500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await runWithLoader(async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    localStorage.setItem("token", data.token);
    toast.success("Login successful");
    navigate("/menu");
  }).catch((err) => {
    setError(err.message);
    toast.error(err.message || "Login failed");
  });
};

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {loading && <Loader />}
      <h2 className="text-3xl font-bold mb-4">Login</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
