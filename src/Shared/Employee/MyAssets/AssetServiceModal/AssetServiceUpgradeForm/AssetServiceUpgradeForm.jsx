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
import { assets_condition_upgrade } from "@/Shared/options/assets_condition";

const AssetServiceUpgradeForm = ({
  Refetch,
  setError,
  userData,
  handleClose,
  selectedAsset,
}) => {
  const axiosPublic = useAxiosPublic();

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

      // Service Request Payload (record request in AssetServices)
      const ServicesPayload = {
        ...data,
        request: "upgrade",
        Asset: selectedAsset?._id,
        requestedBy: userData?.email || "public",
        assigned_to: assignedTo,
        department: selectedAsset?.department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Asset Update Payload (mark asset as requested for upgrade)
      const AssetUpdatePayload = {
        request: {
          status: "pending_upgrade",
          requested_by: userData?.email || "public",
          requested_at: new Date().toISOString(),
        },
      };

      const [ServicesResponse, AssetUpdateResponse] = await Promise.all([
        axiosPublic.post("/AssetServices", ServicesPayload),
        axiosPublic.put(`/Assets/${selectedAsset?._id}`, AssetUpdatePayload),
      ]);

      if (
        ServicesResponse?.status === 200 ||
        ServicesResponse?.status === 201 ||
        AssetUpdateResponse?.status === 200 ||
        AssetUpdateResponse?.status === 201
      ) {
        Swal.fire({
          icon: "success",
          title: "Upgrade Request Sent",
          text: "The asset upgrade request has been submitted successfully!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        reset();
        Refetch?.();
        handleClose?.();
      } else {
        throw new Error("Failed to submit upgrade request");
      }
    } catch (err) {
      console.error("Upgrade Request Error:", err);
      setError(
        err?.message || "Something went wrong while submitting upgrade request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Asset Condition */}
        <SharedInput
          name="condition"
          label="Current Asset Condition"
          type="select"
          placeholder="Select condition"
          register={register}
          options={assets_condition_upgrade}
          rules={{ required: "Please specify the current condition" }}
          error={errors.condition}
        />

        {/* Reason for Upgrade */}
        <SharedInput
          name="reason"
          label="Reason for Upgrade"
          type="textarea"
          placeholder="Explain why the upgrade is needed"
          register={register}
          rules={{ required: "Please provide a reason for the upgrade" }}
          error={errors.reason}
        />

        {/* Desired Improvement */}
        <SharedInput
          name="desired_improvement"
          label="Desired Improvement / Outcome"
          type="text"
          placeholder="e.g., Higher performance, more storage, better compatibility"
          register={register}
          rules={{ required: "Please specify the desired improvement" }}
          error={errors.desired_improvement}
        />

        {/* Priority Level */}
        <SharedInput
          name="priority"
          label="Priority Level"
          type="select"
          placeholder="Select priority"
          register={register}
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Critical", value: "critical" },
          ]}
          rules={{ required: "Please select the priority level" }}
          error={errors.priority}
        />

        {/* Additional Notes */}
        <SharedInput
          name="notes"
          label="Additional Notes (Optional)"
          type="textarea"
          placeholder="Any extra details or context"
          register={register}
          error={errors.notes}
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
            "Send Upgrade Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default AssetServiceUpgradeForm;
