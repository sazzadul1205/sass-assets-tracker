// React components
import React, { useState } from 'react';

// Icons
import { ImCross } from 'react-icons/im';

// Packages
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

// Shared
import SharedInput from '@/Shared/SharedInput/SharedInput';
import SharedImageInputCircular from '@/Shared/SharedImageInput/SharedImageInput';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Image hosting config
const Image_Hosting_Key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const UpdatedUserDataModal = ({ Refetch, UserData }) => {
  const axiosPublic = useAxiosPublic();

  // TanStack Query
  const queryClient = useQueryClient();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(UserData?.profileImage || null);

  // React Hook Form
  const {
    reset,
    control,
    register,
    isSubmitting,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Handle Close Function
  const handleClose = () => {
    reset();
    Refetch();
    setError(null);
    document.getElementById('Updated_User_Data_Modal').close();
  };

  // Upload image to imgbb
  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(Image_Hosting_API, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success) return data.data.url;
    else throw new Error('Failed to upload image');
  };

  // Handle Submit
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      let uploadedImageUrl = profileImage;

      // If a new File object, upload it
      if (profileImage && typeof profileImage !== 'string') {
        uploadedImageUrl = await uploadImage(profileImage);
      }

      // Prepare payload
      const payload = {
        ...data,
        profileImage: uploadedImageUrl || UserData?.profileImage || null,
      };

      console.log(payload);

      // PUT request to backend
      const response = await axiosPublic.put(`/Users/${UserData?.email}`, payload);

      // Handle response
      if (response.data.success || response.status === 200) {
        // Update TanStack Query cache
        queryClient.setQueryData(["UserData", UserData?.email], (oldData) => ({
          ...oldData,
          ...payload,
        }));


        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile information has been updated successfully.",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        // Refresh and close modal
        Refetch();
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update user data');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Updated_User_Data_Modal"
      className="modal-box min-w-xl max-w-xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-5 py-4 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className="font-bold text-xl">Update User Data</h3>
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Divider */}
      <p className='w-[98%] mx-auto h-[1px] bg-gray-500 my-3' />

      {/* Error */}
      {error && (
        <div className='py-3 bg-red-100 border border-red-400 rounded-lg'>
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      )}

      {/* Profile Image */}
      <SharedImageInputCircular
        defaultImage={profileImage}
        onChange={setProfileImage}
        width={200}
        height={200}
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
        {/* Name */}
        <SharedInput
          label="Full Name"
          register={register}
          name="name"
          defaultValue={UserData?.name}
          rules={{ required: "Full Name is required" }}
          error={errors.name}
        />

        {/* Email */}
        <SharedInput
          label="Email"
          type="email"
          name="email"
          disabled={true}
          defaultValue={UserData?.email}
          rules={{ required: "Email is required" }}
          error={errors.email}
        />

        {/* Date of Birth */}
        <SharedInput
          label="Date of Birth"
          type="date"
          name="dob"
          control={control}
          defaultValue={UserData.dob}
          rules={{ required: "Date of birth is required" }}
          error={errors.dob}
        />

        {/* Phone */}
        <SharedInput
          label="Phone Number"
          type="tel"
          placeholder="+8801XXXXXXXXX"
          register={register}
          defaultValue={UserData.phone}
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
          disabled={isSubmitting || isLoading}
          className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting || isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {(isSubmitting || isLoading) ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Save Details"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdatedUserDataModal;
