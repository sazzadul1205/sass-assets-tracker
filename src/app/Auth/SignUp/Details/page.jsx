// Auth/SignUp/Details/page.jsx
"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Shared input
import SharedInput from '@/Shared/SharedInput/SharedInput';

// Assets
import Logo from "../../../../../public/Auth_Assets/SAT_Logo.png";
import SharedImageInput from '@/Shared/SharedImageInput/SharedImageInput';

const DetailsPage = () => {

  const [profileImage, setProfileImage] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Form submit handler
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Here you can send `data` to your API later
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
      <div className="card w-full min-w-lg bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all p-6 space-y-4">

        {/* Placeholder for future profile image */}
        <SharedImageInput onChange={setProfileImage}
          width={220}
          height={220}
        />

        {/* User Information Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Phone Number */}
          <SharedInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" },
            })}
            error={errors.phone}
          />

          {/* Organization Name */}
          <SharedInput
            label="Organization Name"
            placeholder="Enter your Organization Name"
            {...register("organization", { required: "Organization is required" })}
            error={errors.organization}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn w-full h-11 font-semibold tracking-wide ${isSubmitting ? "btn-disabled bg-blue-400" : "btn-primary bg-blue-600 hover:bg-blue-700"
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
