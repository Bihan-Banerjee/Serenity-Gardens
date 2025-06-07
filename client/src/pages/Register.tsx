"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/loaders/RainbowLoader";
import { useLoader } from "@/hooks/useLoader";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { loading, runWithLoader } = useLoader(1500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await runWithLoader(async () => {
      const res = await fetch("https://serenity-gardens.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);

      toast.success("Registration successful!");
      navigate("/login");
    }).catch((err: any) => {
      setError(err.message);
      toast.error(err.message || "Registration failed");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {loading && <Loader />}
      <div className="w-full px-1 md:px-8 flex items-center justify-center">
          <AuroraText className="text-4xl md:text-6xl mb-10 font-bold flex items-center justify-center text-center">
            Register
          </AuroraText>  
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
