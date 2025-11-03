// React Components
import React, { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { FaLayerGroup } from "react-icons/fa";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

const CreatedAssetModal = ({ Refetch, UserEmail, CategoriesOptions }) => {
  const axiosPublic = useAxiosPublic();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    reset,
    control,
    register,
    isSubmitting,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Close Modal
  const handleClose = () => {
    reset();
    setError(null);
    document.getElementById("Create_New_Asset_Modal").close();
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      // Ensure user is logged in
      if (!UserEmail) {
        setError("User email not found. Please log in.");
        throw new Error("User email not found. Please log in.");
      }

      // Prepare payload
      const payload = {
        ...data,
        condition: "New",
        department: "Not Assigned",
        assigned_to: "Not Assigned",
        current_status: "Not Assigned",
        createdBy: UserEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Send payload to server
      const response = await axiosPublic.post("/Assets", payload)
      // console.log("payload : ", payload);


      // Handle response
      if (response.status === 201 || response.status === 200) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Asset Created",
          text: "The Asset has been successfully created!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        // Refetch data and close modal
        Refetch();
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update user data');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while creating the Asset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Create_New_Asset_Modal"
      className="modal-box min-w-3xl max-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-6 py-5 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <FaLayerGroup className="text-blue-600" />
          Create Asset
        </h3>
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Divider */}
      <p className="w-[98%] mx-auto h-[1px] bg-gray-300 my-3" />

      {/* Error */}
      {error && (
        <div className="py-3 bg-red-100 border border-red-400 rounded-lg mb-4">
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Asset Name */}
        <SharedInput
          label="Asset Name"
          name="asset_name"
          register={register}
          placeholder="Enter asset name"
          rules={{ required: "Asset Name is required" }}
          error={errors.asset_name}
        />

        {/* Asset Code & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Asset Code */}
          <SharedInput
            label="Asset Code"
            name="asset_code"
            register={register}
            placeholder="e.g., ELEA-001"
            rules={{
              required: "Asset Code is required",
              pattern: {
                value: /^[A-Za-z0-9-_]+$/,
                message: "Only letters, numbers, dashes, or underscores allowed",
              },
            }}
            error={errors.asset_code}
          />

          {/* Category Select */}
          <SharedInput
            label="Asset Category"
            name="category_id"
            type="select"
            register={register}
            rules={{ required: "Category is required" }}
            error={errors.category_id}
            placeholder="Select a category"
            options={CategoriesOptions.map((cat) => ({
              value: cat._id,
              label: `${cat.category_name} (${cat.category_code})`,
            }))}
          />
        </div>

        {/* Brand Name */}
        <SharedInput
          label="Brand Name"
          name="brand_name"
          register={register}
          placeholder="Enter brand name"
          rules={{ required: "Brand name is required" }}
          error={errors.brand_name}
        />

        {/* Serial Number */}
        <SharedInput
          label="Serial Number"
          name="serial_number"
          register={register}
          placeholder="Enter serial number"
          rules={{ required: "Serial number is required" }}
          error={errors.serial_number}
        />

        {/* Description */}
        <SharedInput
          label="Description"
          name="description"
          register={register}
          type="textarea"
          placeholder="Short description of this asset..."
          error={errors.description}
        />

        {/* Financial Details Header */}
        <div className="pt-3">
          <h3 className="font-bold text-lg">Financial Details</h3>
          <div className="w-full h-[1px] bg-gray-300 my-3" />
        </div>

        {/* Purchase Date & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Date */}
          <SharedInput
            label="Purchase Date"
            type="date"
            control={control}
            name="purchase_date"
            register={register}
            placeholder="Enter purchase date"
            rules={{ required: "Purchase Date is required" }}
            error={errors.purchase_date}
          />

          {/* Purchase Price */}
          <SharedInput
            label="Purchase Price"
            name="purchase_price"
            register={register}
            placeholder="Enter purchase price"
            type="number"
            min="0"
            step="0.01"
            rules={{ required: "Purchase Price is required" }}
            error={errors.purchase_price}
          />
        </div>

        {/* Supplier Name & Warranty Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplier Name */}
          <SharedInput
            label="Supplier Name"
            name="supplier_name"
            register={register}
            placeholder="Enter supplier name"
            rules={{ required: "Supplier Name is required" }}
            error={errors.supplier_name}
          />

          {/* Warranty Period (in months) */}
          <SharedInput
            label="Warranty Period (Months)"
            name="warranty_period"
            register={register}
            placeholder="Enter warranty period in months"
            type="number"
            min="0"
            step="1"
            rules={{ required: "Warranty Period is required" }}
            error={errors.warranty_period}
          />
        </div>

        {/* Warranty Expiry Date & Depreciation Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Warranty Expiry Date */}
          <SharedInput
            label="Warranty Expiry Date"
            type="date"
            dateLimit="future"
            control={control}
            name="warranty_expiry_date"
            register={register}
            placeholder="Select warranty expiry date"
            rules={{ required: "Warranty Expiry Date is required" }}
            error={errors.warranty_expiry_date}
          />

          {/* Depreciation Rate (optional) */}
          <SharedInput
            label="Depreciation Rate (%)"
            name="depreciation_rate"
            register={register}
            placeholder="Enter depreciation rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            error={errors.depreciation_rate}
          />
        </div>

        {/* Submit */}
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
            "Create Asset"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatedAssetModal;