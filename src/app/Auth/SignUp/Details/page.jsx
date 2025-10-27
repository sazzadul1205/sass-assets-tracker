// Auth/SignUp/Details/page.jsx
"use client";

// React components
import { useEffect, useState } from "react";

// Next.js components
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Shared components
import SharedInput from "@/Shared/SharedInput/SharedInput";
import SharedImageInput from "@/Shared/SharedImageInput/SharedImageInput";

// Assets
import Logo from "../../../../../public/Auth_Assets/SAT_Logo.png";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";


// Image hosting config
const Image_Hosting_Key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const DetailsPage = () => {
  const axiosPublic = useAxiosPublic();

  // Next.js Hooks
  const router = useRouter();
  const { data: session, status } = useSession();

  // Profile image State
  const [profileImage, setProfileImage] = useState(null);

  // Form State
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onSubmit" });

  // ------------- User Exists Check -------------
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // Redirect if user already has complete details
  useEffect(() => {
    if (UserData) {
      const { dob, phone, organization, designation } = UserData;
      if (dob && phone && organization && designation) {
        router.replace("/Employee/MyAssets");
      }
    }
  }, [UserData, router]);

  // Loading state
  if (UserIsLoading, status === "loading") {
    return <Loading />;
  }

  // Error state
  if (UserError) {
    // Get a friendly message from the error
    const errorMessage =
      typeof UserError === "string"
        ? UserError
        : UserError?.response?.data?.message || UserError?.message || "Something went wrong.";

    return <Error message={errorMessage} />;
  }

  // Form Submit
  const onSubmit = async (data) => {
    try {

      // If user is not authenticated, throw error
      if (!session?.user?.email) {
        throw new Error("User email not found. Please log in.");
      }

      // Image upload
      let uploadedImageUrl = null;

      // Upload image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data.data.display_url;
      }

      // Final payload
      const payload = {
        ...data,
        role: "Employee",
        email: session.user.email,
        profileImage: uploadedImageUrl,
      };

      // Update user
      await axiosPublic.put("/Users/Update", payload);

      // Success
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Details updated successfully!",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      // Reset form
      reset();
      setProfileImage(null);
      router.push("/Employee/Dashboard");
    } catch (error) {

      // Error
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
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

      {/* Form */}
      <div className="card w-full min-w-lg bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all p-6 space-y-5 rounded-2xl">

        {/* Header */}
        <div className="mb-5 text-center">
          {/* Title  */}
          <h1 className="text-3xl font-extrabold text-gray-800 mt-4 tracking-tight">
            Complete Your Profile
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-1 text-sm">
            Please fill in the details below to complete your profile.
          </p>
        </div>


        {/* Profile Image */}
        <SharedImageInput onChange={setProfileImage} width={200} height={200} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* Date of Birth */}
          <SharedInput
            label="Date of Birth"
            type="date"
            name="dob"
            control={control}
            rules={{ required: "Date of birth is required" }}
            error={errors.dob}
          />

          {/* Phone Number */}
          <SharedInput
            label="Phone Number"
            type="tel"
            placeholder="+8801XXXXXXXXX"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Save Details"
            )}
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
