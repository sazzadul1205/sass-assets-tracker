// Auth/SignUp/Details/page.jsx
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

// Shared components
import SharedInput from "@/Shared/SharedInput/SharedInput";
import SharedImageInput from "@/Shared/SharedImageInput/SharedImageInput";

// Assets
import Logo from "../../../../../public/Auth_Assets/SAT_Logo.png";

// Image hosting config
const Image_Hosting_Key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const DetailsPage = () => {
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onSubmit", 
  });

  const onSubmit = async (data) => {
    try {
      let uploadedImageUrl = null;

      // Upload image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axios.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data.data.display_url;
      }

      // Final payload
      const payload = {
        ...data,
        profileImage: uploadedImageUrl,
      };

      console.log("Submitted Data:", payload);

      // Success Toast
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "Details saved successfully!",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      reset();
      setProfileImage(null);
    } catch (error) {
      console.error("❌ Submission error:", error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#2563eb",
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

      {/* Profile Details Card */}
      <div className="card w-full min-w-lg bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all p-6 space-y-5 rounded-2xl">
        {/* Profile Image Input */}
        <SharedImageInput onChange={setProfileImage} width={200} height={200} />

        {/* User Info Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Phone Number */}
          <SharedInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            register={register}
            name="phone"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^\+?[0-9]{10,15}$/,
                message: "Invalid phone number format",
              },
            }}
            error={errors.phone}
          />


          {/* Organization Name */}
          <SharedInput
            label="Organization Name"
            placeholder="Enter your organization name"
            register={register}
            name="organization"
            rules={{
              required: "Organization name is required",
              minLength: { value: 3, message: "Too short!" },
            }}
            error={errors.organization}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Saving..." : "Save Details"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-400 text-xs text-center">
        © {new Date().getFullYear()} SAT Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default DetailsPage;
