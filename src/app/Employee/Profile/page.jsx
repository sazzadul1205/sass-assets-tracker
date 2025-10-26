// src/app/Employee/Profile/page.jsx
"use client";

// React
import React, { useEffect, useState } from 'react';

// Next components
import { useSession } from 'next-auth/react';

// Icons
import { FaUserCircle } from 'react-icons/fa';

// Packages
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import SharedInput from '@/Shared/SharedInput/SharedInput';

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // ---------- State Management ----------
  const [isUpdating, setIsUpdating] = useState(null);

  // ---------- Users Data Query ----------
  const {
    data: UserData,
    isLoading: UserIsLoading,
    refetch: UserRefetch,
    error: UserError,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // ---------- React Hook Form Setup ----------
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      organization: "",
      dob: null,
      address: "",
      city: "",
      country: "",
    },
  });

  // ---------- Reset form once UserData is fetched ----------
  useEffect(() => {
    if (UserData) {
      reset({
        name: UserData.name || "",
        email: UserData.email || "",
        phone: UserData.phone || "",
        designation: UserData.designation || "",
        organization: UserData.organization || "",
        dob: UserData.dob ? new Date(UserData.dob) : null,
        address: UserData.address || "",
        city: UserData.city || "",
        country: UserData.country || "",
      });
    }
  }, [UserData, reset]);

  // ---------- Loading State ----------
  if (UserIsLoading || status === "loading") return <Loading />;

  // ---------- Error Handling ----------
  if (UserError) {
    const activeError = UserError;
    const errorMessage =
      typeof activeError === "string"
        ? activeError
        : activeError?.response?.data?.message ||
        activeError?.message ||
        "Something went wrong.";
    console.error("Error fetching user data:", activeError);
    return <Error message={errorMessage} />;
  }

  // ---------- Handle Form Submit ----------
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true); // start loading

      // Send PUT request
      const response = await axiosPublic.put(`/Users/${session?.user?.email}`, {
        ...data,
        updated_on: new Date().toISOString(),
        dob: data.dob ? new Date(data.dob).toISOString() : null,
      });

      // Handle Success
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile information has been successfully updated.",
          position: "top-start",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
        });

        // Refresh user data
        UserRefetch();
      } else {
        // Handle API failure
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.data.message || "Something went wrong.",
          position: "center",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      // Handle runtime error
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message,
        position: "center",
        showConfirmButton: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUserCircle size={30} className="text-green-600" />
            My Profile
          </h1>

          {/* Subheader */}
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            View and update your personal information, contact details, and account settings.
          </p>

          {/* Tip */}
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Keep your profile information up-to-date for proper account management.
          </p>
        </div>
      </div>

      {/* ---------- Profile Form ---------- */}
      <form
        className="mt-6 text-black"
        onSubmit={handleSubmit(onSubmit)}
      >

        {/* Basic Information */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3' >
          {/* Full Name Input */}
          <SharedInput
            label="Full Name"
            name="name"
            type="text"
            placeholder="Enter full name"
            register={register}
            rules={{ required: "Name is required" }}
            error={errors.name}
            defaultValue={UserData?.name || ""}
          />

          {/* Phone Number Input */}
          <SharedInput
            label="Phone Number"
            name="phone"
            type="text"
            placeholder="Enter phone number"
            register={register}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+]{7,15}$/,
                message: "Invalid phone number",
              },
            }}
            error={errors.phone}
            defaultValue={UserData?.phone || ""}
          />

          {/* Designation Input */}
          <SharedInput
            label="Designation"
            name="designation"
            type="text"
            placeholder="Enter designation"
            register={register}
            rules={{ required: "Designation is required" }}
            error={errors.designation}
            defaultValue={UserData?.designation || ""}
          />

          {/* Organization Input */}
          <SharedInput
            label="Organization"
            name="organization"
            type="text"
            placeholder="Enter organization"
            register={register}
            rules={{ required: "Organization is required" }}
            error={errors.organization}
            defaultValue={UserData?.organization || ""}
          />

        </div>


        <div className='grid grid-cols-3 gap-3 mt-5' >
          {/* Address Input */}
          <SharedInput
            label="Address"
            name="address"
            type="text"
            placeholder="Enter your address"
            register={register}
            rules={{ required: "Address is required" }}
            error={errors.address}
            defaultValue={UserData?.address || ""}
          />

          {/* City Input */}
          <SharedInput
            label="City"
            name="city"
            type="text"
            placeholder="Enter city"
            register={register}
            rules={{ required: "City is required" }}
            error={errors.city}
            defaultValue={UserData?.city || ""}
          />

          {/* Country Input */}
          <SharedInput
            label="Country"
            name="country"
            type="text"
            placeholder="Enter country"
            register={register}
            rules={{ required: "Country is required" }}
            error={errors.country}
            defaultValue={UserData?.country || ""}
          />
        </div>


        {/* Date of Birth */}
        <SharedInput
          label="Date of Birth"
          type="date"
          name="dob"
          control={control}
          defaultValue={UserData?.dob || ""}
          rules={{ required: "Date of birth is required" }}
          error={errors.dob}
        />

        {/* Submit Button */}
        <div className="sm:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className={`px-6 py-2 font-semibold rounded-lg transition-all text-white ${isUpdating
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
            disabled={isUpdating}
          >
            {isUpdating ?
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Updating...
              </span> : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
