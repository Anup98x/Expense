"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const response = await res.json();

      console.log(response);

      navigate.push("/expense");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-12 text-white flex-col justify-between">
          {/* Decorative circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-40 -right-32 w-[450px] h-[450px] rounded-full bg-white/10" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-2xl font-bold">$</span>
              </div>

              <span className="text-2xl font-bold tracking-tight">
                ExpenseTracker
              </span>
            </div>

            {/* Main content */}
            <div className="mt-28">
              <p className="text-emerald-100 text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Take Control
              </p>

              <h2 className="text-5xl font-bold leading-tight">
                Manage your
                <br />
                money,
                <br />
                <span className="text-emerald-100">your way.</span>
              </h2>

              <p className="mt-6 text-emerald-50 text-lg leading-8 max-w-md">
                Track your expenses, understand your spending, and stay in
                control of your finances from one simple dashboard.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                ✓
              </div>

              <div>
                <p className="font-semibold">Track Expenses</p>

                <p className="text-sm text-emerald-100">
                  Keep your spending organized
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                ✓
              </div>

              <div>
                <p className="font-semibold">Stay Organized</p>

                <p className="text-sm text-emerald-100">
                  Manage your finances effortlessly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                ✓
              </div>

              <div>
                <p className="font-semibold">Secure & Private</p>

                <p className="text-sm text-emerald-100">
                  Your financial data stays protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
          {/* Top navigation */}
          <div className="flex justify-end mb-10">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate.push("/register")}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                Create one →
              </button>
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-5">
              <span className="text-2xl">$</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900">Welcome back</h1>

            <p className="mt-2 text-slate-500">
              Sign in to continue managing your expenses.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  @
                </div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-16 text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />

              <label htmlFor="remember" className="text-sm text-slate-500">
                Keep me signed in
              </label>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-700 hover:to-green-700 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Securely manage and track your personal expenses.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
