"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (form.password1 !== form.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const response = await res.json();
      console.log(response);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-12 text-white flex-col justify-between overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full" />
          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-purple-400/20 rounded-full" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-2xl font-bold">A</span>
              </div>

              <span className="text-2xl font-bold tracking-tight">MyApp</span>
            </div>

            <div className="mt-24">
              <p className="text-blue-200 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
                Get Started
              </p>

              <h2 className="text-5xl font-bold leading-tight">
                Create your
                <br />
                account and
                <br />
                <span className="text-blue-200">start your journey.</span>
              </h2>

              <p className="mt-6 text-blue-100 text-lg leading-8 max-w-md">
                Join our platform and experience a simple, secure, and seamless
                way to manage everything in one place.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <div>
                <p className="font-semibold">Fast & Secure</p>
                <p className="text-sm text-blue-200">
                  Your information is protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <div>
                <p className="font-semibold">Simple to Use</p>
                <p className="text-sm text-blue-200">
                  Clean and intuitive experience
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <div>
                <p className="font-semibold">Built for You</p>
                <p className="text-sm text-blue-200">
                  Everything you need in one place
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
          {/* Top */}
          <div className="flex justify-end mb-8">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Sign in →
              </button>
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-slate-500">
              Fill in your details to get started.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Full Name
              </label>

              <input
                id="full_name"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password1"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password1"
                  type={showPassword ? "text" : "password"}
                  name="password1"
                  value={form.password1}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password2"
                  value={form.password2}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="text-blue-600">Terms of Service</span> and{" "}
            <span className="text-blue-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </main>
  );
}
