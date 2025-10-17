// src/app/auth/login/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/../public/Auth_Assets/SAT_Logo.png";
import SharedInput from "@/Shared/SharedInput/SharedInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log({ email, password });
      setLoading(false);
      // TODO: Replace with real authentication logic
    }, 1200);
  };

  return (
    <div>
      {/* Login Card */}
      <Image
        src={Logo}
        alt="SAT Logo"
        width={300}
        height={100}
        className="mx-auto object-contain drop-shadow-md"
        priority
      />

      <div className="card w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        {/* Logo Section */}
        <div className="mb-5 text-center">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-800 mt-4 tracking-tight">
            Welcome Back
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-1 text-sm">
            Please sign in to access your dashboard
          </p>
        </div>

        <p className="h-[1px] w-[80%] mx-auto bg-black " />

        {/* Form Section */}
        <form onSubmit={handleLogin} className="card-body w-md space-y-5">
          {/* Email Field */}
          <SharedInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <SharedInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot Password */}
          <div className="flex justify-end -mt-2">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn w-full h-11 font-semibold tracking-wide ${
              loading
                ? "btn-disabled bg-blue-400 text-white"
                : "btn-primary bg-blue-600 hover:bg-blue-700 text-white transition-all"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="divider my-2 text-gray-400">OR</div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Create one
            </a>
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-400 text-xs text-center">
        © {new Date().getFullYear()} SAT Platform. All rights reserved.
      </footer>
    </div>
  );
}
