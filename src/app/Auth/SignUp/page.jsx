// Auth/SignUp/page.jsx
"use client";

// Next.js components
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Assets
import Logo from "../../../../public/Auth_Assets/SAT_Logo.png";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const SignUpPage = () => {
  const router = useRouter();
  const axiosPublic = useAxiosPublic();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      // 1️⃣ Send signup request
      await axiosPublic.post("/Users/SignUp", data);


      // 2️⃣ Auto-login
      const loginResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (loginResponse?.error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Login Failed",
          text: loginResponse.error,
          showConfirmButton: true,
          allowOutsideClick: false,
        });
        return;
      }

      // 3️⃣ Success toast
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Success",
        text: "Account created and logged in successfully!",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
        timerProgressBar: true,
      });

      // 4️⃣ Redirect to details page
      router.push("/Auth/SignUp/Details");
    } catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sign Up Failed",
        text: err.response?.data?.message || err.message || "Something went wrong",
        showConfirmButton: true,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <div>
      {/* Logo */}
      <Image
        src={Logo}
        alt="SAT Logo"
        width={300}
        height={100}
        className="mx-auto pb-4"
        priority
      />

      {/* Card container */}
      <div className="card w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all">
        {/* Header */}
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

        {/* Signup form */}
        <form onSubmit={handleSubmit(onSubmit)} className="card-body w-md space-y-3">
          {/* Name */}
          <SharedInput
            label="Full Name"
            placeholder="Your full name"
            register={register}
            name="name"
            required={true}
            error={errors.name}
          />

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

          {/* Confirm Password */}
          <SharedInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            register={(name, options) =>
              register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })
            }
            name="confirmPassword"
            required={true}
            error={errors.confirmPassword}
          />


          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn w-full h-11 font-semibold tracking-wide ${isSubmitting ? "btn-disabled bg-blue-400" : "btn-primary bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="divider my-2 text-gray-400">OR</div>

          {/* Login link */}
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
