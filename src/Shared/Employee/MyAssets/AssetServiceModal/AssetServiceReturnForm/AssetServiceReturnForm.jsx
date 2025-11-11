// React
import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

// Shared - Options
import { assets_condition_replace } from "@/Shared/options/assets_condition";

const AssetServiceReturnForm = ({
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
      // Fallback if no assigned user
      const assignedTo = selectedAsset?.assigned_to || "public";

      // Service Request Payload (record request in AssetServices)
      const ServicesPayload = {
        ...data,
        request: "return",
        Asset: selectedAsset?._id,
        requestedBy: userData?.email || "public",
        assigned_to: assignedTo,
        department: selectedAsset?.department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Asset Update Payload (mark asset as requested for return)
      const AssetUpdatePayload = {
        request: {
          status: "pending_return",
          requested_by: userData?.email || "public",
          requested_at: new Date().toISOString(),
        },
      };

      // Send data to API
      const [ServicesResponse, AssetUpdateResponse] = await Promise.all([
        axiosPublic.post("/AssetServices", ServicesPayload),
        axiosPublic.put(`/Assets/${selectedAsset?._id}`, AssetUpdatePayload),
      ]);

      // Handle success
      if (
        ServicesResponse?.status === 200 ||
        ServicesResponse?.status === 201 ||
        AssetUpdateResponse?.status === 200 ||
        AssetUpdateResponse?.status === 201
      ) {
        Swal.fire({
          icon: "success",
          title: "Return Request Sent",
          text: "The asset return request has been submitted successfully!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        reset();
        Refetch?.();
        handleClose?.();
      } else {
        throw new Error("Failed to submit return request");
      }
    } catch (err) {
      console.error("Return Request Error:", err);
      setError(err?.message || "Something went wrong while submitting return request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div >
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Return Date */}
        <SharedInput
          name="returnDate"
          label="Return Date"
          type="date"
          dateLimit="future"
          control={control}
          rules={{ required: "Return date is required" }}
          error={errors.returnDate}
        />

        {/* Asset Condition */}
        <SharedInput
          name="condition"
          label="Asset Condition"
          type="select"
          placeholder="Select condition"
          register={register}
          options={assets_condition_replace}
          rules={{ required: "Please specify the asset condition" }}
          error={errors.condition}
        />

        {/* Issue Description (if any) */}
        <SharedInput
          name="issueDescription"
          label="Issue Description"
          type="textarea"
          placeholder="Describe any problems or issues..."
          register={register}
          rules={{
            maxLength: {
              value: 300,
              message: "Keep it under 300 characters",
            },
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full h-11 font-semibold text-white rounded-lg transition-all 
            ${isSubmitting || isLoading
              ? "bg-blue-400 cursor-not-allowed pointer-events-none"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
        >
          {isSubmitting || isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Send Return Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default AssetServiceReturnForm;
