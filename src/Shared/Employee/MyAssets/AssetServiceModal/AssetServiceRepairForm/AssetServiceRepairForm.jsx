"use client";

// React
import React, { useState } from "react";

// Packages
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Shared Components
import SharedInput from "@/Shared/SharedInput/SharedInput";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared - Options
import { assets_condition_repair } from "@/Shared/options/assets_condition";

const AssetServiceRepairForm = ({
  Refetch,
  setError,
  userData,
  handleClose,
  selectedAsset,
}) => {
  const axiosPublic = useAxiosPublic();

  // Form Hook
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Submit Handler
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const assignedTo = selectedAsset?.assigned_to || "public";

      // Payload for AssetServices collection
      const ServicesPayload = {
        ...data,
        request: "repair",
        Asset: selectedAsset?._id,
        requestedBy: userData?.email || "public",
        assigned_to: assignedTo,
        department: selectedAsset?.department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Payload for updating the asset status
      const AssetUpdatePayload = {
        request: {
          status: "pending_repair",
          requested_by: userData?.email || "public",
          requested_at: new Date().toISOString(),
        },
      };

      // Send requests concurrently
      const [ServicesResponse, AssetUpdateResponse] = await Promise.all([
        axiosPublic.post("/AssetServices", ServicesPayload),
        axiosPublic.put(`/Assets/${selectedAsset?._id}`, AssetUpdatePayload),
      ]);

      // Check if successful
      if (
        [ServicesResponse?.status, AssetUpdateResponse?.status].some(
          (s) => s === 200 || s === 201
        )
      ) {
        Swal.fire({
          icon: "success",
          title: "Repair Request Sent",
          text: "The asset repair request has been submitted successfully!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        reset();
        Refetch?.();
        handleClose?.();
      } else {
        throw new Error("Failed to submit repair request");
      }
    } catch (err) {
      console.error("Repair Request Error:", err);
      setError(
        err?.message || "Something went wrong while submitting repair request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Expected Repair Date */}
        <SharedInput
          name="expectedRepairDate"
          label="Expected Repair Date"
          type="date"
          control={control}
          rules={{ required: "Please specify expected repair date" }}
          dateLimit="future"
          error={errors.expectedRepairDate}
        />

        {/* Asset Condition */}
        <SharedInput
          name="condition"
          label="Asset Condition"
          type="select"
          placeholder="Select condition"
          register={register}
          options={assets_condition_repair}
          rules={{ required: "Please specify the asset condition" }}
          error={errors.condition}
        />

        {/* Issue Description */}
        <SharedInput
          name="issueDescription"
          label="Issue Description"
          type="textarea"
          placeholder="Describe the issue..."
          register={register}
          rules={{
            maxLength: { value: 300, message: "Keep it under 300 characters" },
          }}
          error={errors.issueDescription}
        />

        {/* Additional Remarks */}
        <SharedInput
          name="remarks"
          label="Remarks (Optional)"
          type="textarea"
          placeholder="Any additional notes..."
          register={register}
          error={errors.remarks}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting || isLoading
            ? "bg-blue-400 cursor-not-allowed pointer-events-none"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
        >
          {isSubmitting || isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Submit Repair Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default AssetServiceRepairForm;
