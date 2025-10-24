"use client";

// React components
import React, { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";
import { FaClipboardList } from "react-icons/fa";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";


// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";
import DynamicItemsInput from "@/Shared/DynamicItemsInput/DynamicItemsInput";


// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const GenerateReceiptModal = ({
  refetch,
  sessionData,
  selectedAsset,
  setSelectedAsset,
}) => {
  const axiosPublic = useAxiosPublic();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // React Hooks Form
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Close modal
  const handleClose = () => {
    reset();
    refetch();
    setError(null);
    setSelectedAsset(null);
    document.getElementById("Generate_Receipt_Modal")?.close();
  };

  // Handle submit
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    // --- Build Receipt payload ---
    const payload = {
      ...data,
      recept_items: data.recept_items,
      request_id: selectedAsset?._id,
      asset_id: selectedAsset?.asset_id,
      asset_name: selectedAsset?.asset_name,
      generated_at: new Date().toISOString(),
      asset_category: selectedAsset?.asset_category,
      current_condition: selectedAsset?.current_condition,
    };


    try {
      // --- Create Receipt ---
      const res = await axiosPublic.post("/Receipts/", payload);

      // --- Handle Response ---
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.data?.message || "Failed to create receipt");
      }

      // --- Build log payload ---
      const logPayload = {
        request_id: selectedAsset?._id,
        action: "Created a receipt",
        logged_by: sessionData?.user?.email || "unknown",
        logged_by_role: sessionData?.user?.role || "unknown",
        logged_at: new Date().toISOString(),
        details: {
          receipt_id: res?.data?.data || null,
        },
      };

      // --- Create Log Entry ---
      await axiosPublic.post("/Log/", logPayload);

      // --- Show Success Message ---
      Swal.fire({
        icon: "success",
        title: "Receipt Created",
        text: "The receipt has been generated successfully.",
        position: "top-start",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });

      // --- Close Modal ---
      handleClose();

    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      id="Generate_Receipt_Modal"
      className="modal-box w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl px-6 py-5 text-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Generate Receipt – {selectedAsset?.asset_name}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Error */}
      {error &&
        <div className='py-3 bg-red-100 border border-red-400 rounded-lg' >
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      }

      {/* Asset Summary */}
      <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg border mb-5">
        <div>
          <p className="text-sm text-gray-500">Asset Name</p>
          <p className="font-semibold">{selectedAsset?.asset_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Asset ID</p>
          <p className="font-semibold">{selectedAsset?.asset_id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-semibold">{selectedAsset?.asset_category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Condition</p>
          <p className="font-semibold">{selectedAsset?.current_condition}</p>
        </div>
      </div>

      {/* Request Summary */}
      <div className="p-4 rounded-lg border mb-6">
        <p className="text-sm text-gray-500 mb-1">Request Details</p>
        <p className="text-gray-700">{selectedAsset?.request_details}</p>
      </div>

      {/* Receipt Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Receiver & Handover Date */}
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Received By */}
          <SharedInput
            label="Received By"
            name="received_by"
            placeholder="Enter receiver name"
            register={register}
            rules={{ required: "Receiver name is required" }}
            error={errors.received_by}
          />

          {/* Handover Date */}
          <SharedInput
            label="Handover Date"
            type="date"
            name="handover_date"
            control={control}
            rules={{ required: "Handover date is required" }}
            error={errors.handover_date}
            dateLimit="none"
          />
        </div>

        {/* Row 2: Items */}
        <DynamicItemsInput
          register={register}
          control={control}
          errors={errors}
          fieldName="recept_items"
        />

        {/* Remarks / Notes */}
        <SharedInput
          label="Remarks / Notes"
          type="textarea"
          name="remarks"
          placeholder="Add remarks or comments about the handover..."
          register={register}
          error={errors.remarks}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-1/3 py-3 rounded-lg text-white font-semibold shadow-md  
      transition-all duration-300 transform hover:-translate-y-0.5 
      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 
      ${isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-lg"
              }`}
          >
            {isLoading ? (
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
                Generating...
              </span>
            ) : (
              "Generate Receipt"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default GenerateReceiptModal;
