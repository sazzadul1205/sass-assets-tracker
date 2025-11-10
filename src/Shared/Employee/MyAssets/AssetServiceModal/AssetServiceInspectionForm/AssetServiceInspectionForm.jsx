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
import { assets_condition_inspection } from "@/Shared/options/assets_condition";

const AssetServiceInspectionForm = ({
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

  const [isLoading, setIsLoading] = useState(false);

  // Submit Handler
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const assignedTo = selectedAsset?.assigned_to || "public";

      const ServicesPayload = {
        ...data,
        request: "inspection",
        Asset: selectedAsset?._id,
        requestedBy: userData?.email || "public",
        assigned_to: assignedTo,
        department: selectedAsset?.department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const AssetUpdatePayload = {
        request: {
          status: "pending_inspection",
          requested_by: userData?.email || "public",
          requested_at: new Date().toISOString(),
        },
      };

      const [ServicesResponse, AssetUpdateResponse] = await Promise.all([
        axiosPublic.post("/AssetServices", ServicesPayload),
        axiosPublic.put(`/Assets/${selectedAsset?._id}`, AssetUpdatePayload),
      ]);

      if (
        (ServicesResponse?.status === 200 || ServicesResponse?.status === 201) &&
        (AssetUpdateResponse?.status === 200 ||
          AssetUpdateResponse?.status === 201)
      ) {
        Swal.fire({
          icon: "success",
          title: "Inspection Request Sent",
          text: "The asset inspection request has been submitted successfully!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        reset();
        Refetch?.();
        handleClose?.();
      } else {
        throw new Error("Failed to submit inspection request");
      }
    } catch (err) {
      console.error("Inspection Request Error:", err);
      setError(
        err?.message || "Something went wrong while submitting inspection request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Condition Selection */}
        <SharedInput
          name="condition"
          label="Inspection Condition"
          type="select"
          placeholder="Select inspection condition"
          register={register}
          options={assets_condition_inspection}
          rules={{ required: "Please select the inspection condition" }}
          error={errors.condition}
        />

        {/* Inspection Date */}
        <SharedInput
          name="inspection_date"
          label="Preferred Inspection Date"
          type="date"
          control={control}
          placeholder="Select inspection date"
          dateLimit="future"
          rules={{ required: "Please select an inspection date" }}
          error={errors.inspection_date}
        />

        {/* Priority */}
        <SharedInput
          name="priority"
          label="Priority Level"
          type="select"
          placeholder="Select priority level"
          register={register}
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
          rules={{ required: "Please select a priority level" }}
          error={errors.priority}
        />

        {/* Notes */}
        <SharedInput
          name="description"
          label="Inspection Notes"
          type="textarea"
          placeholder="Describe the reason or details for inspection..."
          register={register}
          rules={{ required: "Please provide inspection details" }}
          error={errors.description}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full h-11 font-semibold text-white rounded-lg transition-all 
            ${isSubmitting || isLoading
              ? "bg-blue-400 cursor-not-allowed pointer-events-none"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isSubmitting || isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Send Inspection Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default AssetServiceInspectionForm;
