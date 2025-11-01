// React Components
import React, { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import {
  FaTags,
  FaCubes,
  FaPercent,
  FaAlignLeft,
  FaLayerGroup,
  FaCalendarAlt,
} from "react-icons/fa";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";
import SharedImageInputCircular from "@/Shared/SharedImageInput/SharedImageInput";

// Image hosting config
const Image_Hosting_Key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const CreateAssetCategoryModal = ({ Refetch, UserEmail }) => {
  const axiosPublic = useAxiosPublic();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tags State
  const [tags, setTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  // Icon image State
  const [iconImage, setIconImage] = useState(null);

  // React Hook Form
  const {
    reset,
    register,
    isSubmitting,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Add tag handlers
  const appendTag = (tag) => setTags((prev) => [...prev, tag]);

  // Remove tag handlers
  const removeTag = (index) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  // Close Modal
  const handleClose = () => {
    reset();
    setTags([]);
    setError(null);
    document.getElementById("Create_New_Category_Modal").close();
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      // Ensure user is logged in
      if (!UserEmail) {
        throw new Error("User email not found. Please log in.");
      }

      // Image upload
      let uploadedImageUrl = null;

      // Upload image if selected
      if (iconImage) {
        const formData = new FormData();
        formData.append("image", iconImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data?.data?.display_url;
      }

      // Prepare payload
      const payload = {
        category_name: data.category_name,
        category_code: data.category_code,
        description: data.description || "",
        depreciation_rate: Number(data.depreciation_rate) || 0,
        useful_life_years: Number(data.useful_life_years) || null,
        tags: tags.map((t) => t.value),
        icon_url: uploadedImageUrl,
        icon_color: selectedColor,
        createdBy: UserEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Send payload to server
      const response = await axiosPublic.post("/AssetCategories", payload)

      if (response.status === 201 || response.status === 200) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Asset Category Created",
          text: "The Asset Category has been successfully created!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });

        // Reset form
        Refetch();
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update user data');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while creating the category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Create_New_Category_Modal"
      className="modal-box min-w-3xl max-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-6 py-5 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <FaLayerGroup className="text-blue-600" />
          Create Asset Category
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Category Name */}
        <SharedInput
          label="Category Name"
          name="category_name"
          register={register}
          placeholder="e.g., Electronics"
          icon={<FaCubes />}
          rules={{ required: "Category Name is required" }}
          error={errors.category_name}
        />

        {/* Category Code */}
        <SharedInput
          label="Category Code"
          name="category_code"
          register={register}
          placeholder="e.g., ELEC-001"
          icon={<FaTags />}
          rules={{
            required: "Category Code is required",
            pattern: {
              value: /^[A-Za-z0-9-_]+$/,
              message:
                "Only letters, numbers, dashes, or underscores allowed",
            },
          }}
          error={errors.category_code}
        />

        {/* Depreciation Rate */}
        <SharedInput
          label="Depreciation Rate (%)"
          name="depreciation_rate"
          register={register}
          placeholder="e.g., 10"
          icon={<FaPercent />}
          type="number"
          min="0"
          max="100"
          step="0.1"
        />

        {/* Useful Life */}
        <SharedInput
          label="Useful Life (Years)"
          name="useful_life_years"
          register={register}
          placeholder="e.g., 5"
          icon={<FaCalendarAlt />}
          type="number"
          min="0"
          step="1"
        />

        {/* Category Icon & Color Picker */}
        <div className="md:col-span-2" >

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2" >Category Icon</h3>

          {/* Divider */}
          <p className="w-[98%] mx-auto h-[1px] bg-gray-300 my-3" />

          {/* Category Icon */}
          <div className="flex justify-between  gap-2 items-center">

            {/* Image Preview & Input */}
            <div className="flex gap-5 items-center">
              <label className="block text-gray-700 text-center font-semibold">
                Category Icon
              </label>

              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: selectedColor || "#ffffff" }}
              >
                <SharedImageInputCircular
                  label=""
                  hint=""
                  rounded="lg"
                  enableCrop={false}
                  width={52}
                  height={52}
                  onChange={setIconImage}
                />
              </div>

            </div>

            {/* Color Picker */}
            <div className="flex gap-5 items-center">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                title="Select Background Color"
                className="w-10 h-10 p-0 border-0 cursor-pointer"
              />

              <label className="block text-gray-700 text-center font-semibold">
                Color Picker
              </label>

            </div>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <SharedInput
            label="Description"
            name="description"
            register={register}
            type="textarea"
            placeholder="Short description of this category..."
            icon={<FaAlignLeft />}
            error={errors.description}
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 ">
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full h-11 font-semibold text-white rounded-lg 
            transition-all ${isSubmitting || isLoading
                ? "bg-blue-400 cursor-not-allowed pointer-events-none"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {(isSubmitting || isLoading) ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Asset Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssetCategoryModal;
