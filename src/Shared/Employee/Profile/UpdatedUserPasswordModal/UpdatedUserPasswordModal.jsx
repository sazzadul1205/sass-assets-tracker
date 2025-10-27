// React components
import React, { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// Shared
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import SharedInput from "@/Shared/SharedInput/SharedInput";

const UpdatedUserPasswordModal = ({ Refetch, UserData }) => {
  const axiosPublic = useAxiosPublic();

  // TanStack Query
  const queryClient = useQueryClient();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPasswordVerified, setOldPasswordVerified] = useState(false);

  // Form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClose = () => {
    reset();
    setError(null);
    setOldPasswordVerified(false);
    document.getElementById("Updated_User_Password_Modal").close();
  };

  // Handle Submit
  const onSubmitOldPassword = async (data) => {
    setError(null);
    setIsLoading(true);

    // Check if old password is correct
    try {
      // Check old password with backend
      const res = await axiosPublic.post(`/Users/VerifyPassword/${UserData.email}`, {
        oldPassword: data.oldPassword,
      });

      // Handle response
      if (res.data.success) {
        setOldPasswordVerified(true);
        Swal.fire({
          icon: "success",
          title: "Old Password Verified",
          toast: true,
          position: "top-start",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setError("Old password is incorrect");
      }

      // Reset form
      reset();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Submit
  const onSubmitNewPassword = async (data) => {
    setError(null);
    setIsLoading(true);

    // Check if new password and confirmation match
    try {
      // Check if new password and confirmation match
      if (data.newPassword !== data.confirmPassword) {
        setError("New password and confirmation do not match");
        setIsLoading(false);
        return;
      }

      // PUT request to update password
      const res = await axiosPublic.put(`/Users/UpdatedPassword/${UserData.email}`, {
        password: data.newPassword,
      });

      // Handle response
      if (res.data.success || res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been updated successfully",
          position: "top-start",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
        });

        // Update TanStack Query cache
        queryClient.invalidateQueries(["UserData", UserData.email]);
        handleClose();
        Refetch();
      } else {
        // Handle error
        setError(res.data.message || "Failed to update password");
      }
    } catch (err) {
      // Handle error
      console.error(err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Updated_User_Password_Modal"
      className="modal-box min-w-xl max-w-xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-5 py-4 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Update Password</h3>
        <button type="button" onClick={handleClose} className="hover:text-red-500 cursor-pointer transition-colors duration-300">
          <ImCross className="text-xl" />
        </button>
      </div>

      <p className="w-[98%] mx-auto h-[1px] bg-gray-500 my-3" />

      {error && (
        <div className="py-3 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      )}

      {!oldPasswordVerified ? (
        // Step 1: Old Password
        <form onSubmit={handleSubmit(onSubmitOldPassword)} className="space-y-3 mt-4">
          <SharedInput
            label="Old Password"
            type="password"
            name="oldPassword"
            placeholder="••••••••"
            register={register}
            rules={{ required: "Old password is required" }}
            error={errors.oldPassword}
          />
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting || isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting || isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Verify Old Password"}
          </button>
        </form>
      ) : (
        // Step 2: New Password + Confirm Password
        <form onSubmit={handleSubmit(onSubmitNewPassword)} className="space-y-3 mt-4">
          <SharedInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="••••••••"
            register={register}
            rules={{ required: "New password is required" }}
            error={errors.newPassword}
          />
          <SharedInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            name="confirmPassword"
            register={register}
            rules={{ required: "Confirm password is required" }}
            error={errors.confirmPassword}
          />
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting || isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting || isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdatedUserPasswordModal;
