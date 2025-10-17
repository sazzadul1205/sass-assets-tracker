"use client";

// Next.js components
import Image from "next/image";
import { useState } from "react";

// Assets
import Logo from "@/../public/Auth_Assets/SAT_Logo.png";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Add real sign-up logic here
    console.log({ fullName, email, password, confirmPassword });

    setTimeout(() => setLoading(false), 1500); // simulate async
  };

  return (
    <div >
      {/* Logo */}
      <Image
        src={Logo}
        alt="SAT Logo"
        width={300}
        height={100}
        className="mx-auto object-contain drop-shadow-md pb-4"
        priority
      />

      {/* Card */}
      <div className="card w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
        {/* Heading */}
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mt-4 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Please sign up to access your dashboard
          </p>
        </div>

        {/* Divider */}
        <p className="h-[1px] w-[80%] mx-auto bg-black" />

        {/* Form */}
        <form onSubmit={handleSignUp} className="card-body w-md space-y-5">
          {/* Full Name */}
          <SharedInput
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Email */}
          <SharedInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <SharedInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm Password */}
          <SharedInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn w-full h-11 font-semibold tracking-wide ${loading
              ? "btn-disabled bg-blue-400 text-white"
              : "btn-primary bg-blue-600 hover:bg-blue-700 text-white transition-all"
              }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Divider */}
          <div className="divider my-2 text-gray-400">OR</div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/Auth/Login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign In
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
};

export default SignUpPage;
