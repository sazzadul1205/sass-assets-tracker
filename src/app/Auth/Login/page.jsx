// Auth/Login/page.jsx
"use client";

// React components
import { useEffect } from "react";

// Next.js components
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Assets
import Logo from "@/../public/Auth_Assets/SAT_Logo.png";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

const page = () => {
  const router = useRouter();

  // Next.js hooks
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Check for expired session
  useEffect(() => {
    if (expired) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [expired]);

  // Login handler
  const onSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: res.error,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      } else if (res.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        // Wait for session to be ready
        const session = await getSession();
        const role = session?.user?.role || "Employee";

        switch (role) {
          case "Manager":
            router.push("/Manager/Dashboard");
            break;
          case "Admin":
            router.push("/Admin/Dashboard");
            break;
          default:
            router.push("/Employee/Dashboard");
        }
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message || "Unexpected error occurred",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div >
      {/* Logo */}
      <Image
        src={Logo}
        alt="SAT Logo"
        width={300}
        height={100}
        className="mx-auto pb-4"
        priority
      />

      {/* Card */}
      <div className="card w-full min-w-md bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all p-6 space-y-5 rounded-2xl">
        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-extrabold text-gray-800 mt-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Please sign in to access your dashboard
          </p>
        </div>

        {/* Divider */}
        <p className="h-[1px] w-[80%] mx-auto bg-black" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Email */}
          <SharedInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            register={(name, options) =>
              register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })
            }
            name="email"
            required={true}
            error={errors.email}
          />

          {/* Password */}
          <SharedInput
            label="Password"
            type="password"
            placeholder="••••••••"
            register={(name, options) =>
              register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" },
              })
            }
            name="password"
            required={true}
            error={errors.password}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn w-full h-11 font-semibold tracking-wide ${isSubmitting
              ? "btn-disabled bg-blue-400 text-white cursor-not-allowed"
              : "btn-primary bg-blue-600 hover:bg-blue-700 text-white transition-all"
              }`}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* OR Divider */}
          <div className="divider my-2 text-gray-400">OR</div>

          {/* Create Account */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/Auth/SignUp"
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

export default page;