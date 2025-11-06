"use client";

// React components
import React, { useState, useEffect } from "react";

// Icons
import { ImCross } from "react-icons/im";
import { FaLayerGroup } from "react-icons/fa";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import SharedInput from "@/Shared/SharedInput/SharedInput";

const AssignAssetModal = ({
  Refetch,
  UsersData,
  selectedAsset,
  UserEmail,
  DepartmentsData,
  setSelectedAsset,
}) => {
  const axiosPublic = useAxiosPublic();

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Form Hooks
  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch department value
  const departmentWatch = watch("department");

  // When department changes → find department name and filter users
  useEffect(() => {
    if (departmentWatch) {
      const selectedDept = DepartmentsData.find((d) => d._id === departmentWatch);
      const deptName = selectedDept?.department_Name || "";
      setSelectedDepartment(deptName);

      const deptUsers = UsersData.filter(
        (u) => u.department_name === deptName
      );
      setFilteredUsers(deptUsers);
    } else {
      setFilteredUsers([]);
      setSelectedDepartment("");
    }
  }, [departmentWatch, UsersData, DepartmentsData]);

  // Close modal cleanly
  const handleClose = () => {
    reset();
    setError(null);
    setIsPrivate(false);
    setIsLimited(false);
    setFilteredUsers([]);
    setSelectedAsset(null);
    setSelectedDepartment("");
    document.getElementById("Assign_Asset_Modal").close();
  };

  // Submit handler
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!UserEmail) throw new Error("User email not found. Please log in.");

      const selectedDept = DepartmentsData.find((d) => d._id === data.department);
      const departmentName = selectedDept?.department_Name || "Unknown";

      const payload = {
        ...data,
        department_name: departmentName,
        isPrivate,
        isLimited,
        assigned_by: UserEmail,
        current_status: "Assigned",
        updatedAt: new Date().toISOString(),
        assigned_at: new Date().toISOString(),
      };

      const response = await axiosPublic.put(`/Assets/${selectedAsset._id}`, payload);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Asset Assigned",
          text: "The asset has been successfully assigned!",
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        Refetch();
        handleClose();
      } else {
        setError(response.data?.message || "Failed to assign asset");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while assigning asset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Assign_Asset_Modal"
      className="modal-box min-w-3xl max-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-6 py-5 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <FaLayerGroup className="text-blue-600" />
          Assign Asset
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Department Select */}
        <SharedInput
          type="select"
          name="department"
          label="Select Department"
          placeholder="Choose department"
          options={DepartmentsData.map((d) => ({
            label: d.department_Name,
            value: d._id,
          }))}
          register={register}
          rules={{ required: true }}
          error={errors.department}
        />

        {/* Public / Private Toggle */}
        <div
          className={`flex items-center gap-4 transition-opacity ${!selectedDepartment ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
        >
          <label className="font-semibold text-gray-700">Assignment Type:</label>
          <div
            onClick={() => setIsPrivate(!isPrivate)}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-all ${isPrivate ? "bg-blue-600" : "bg-gray-300"
              }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isPrivate ? "translate-x-7" : "translate-x-1"
                }`}
            ></div>
          </div>
          <span className="text-gray-700">{isPrivate ? "Private" : "Public"}</span>
        </div>

        {/* User Select */}
        <SharedInput
          type="select"
          name="assigned_to"
          label="Assign To (User)"
          placeholder={
            !selectedDepartment
              ? "Select department first"
              : isPrivate
                ? "Select user"
                : "Disabled for Public"
          }
          options={filteredUsers.map((u) => ({
            label: `${u.name} (${u.department_name})`,
            value: u.email,
          }))}
          register={register}
          disabled={!selectedDepartment || !isPrivate}
          error={errors.assigned_to}
        />

        {/* Limited / Unlimited Toggle */}
        <div
          className={`flex items-center gap-4 transition-opacity ${!selectedDepartment ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
        >
          <label className="font-semibold text-gray-700">Giving Type:</label>
          <div
            onClick={() => setIsLimited(!isLimited)}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-all ${isLimited ? "bg-green-600" : "bg-gray-300"
              }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isLimited ? "translate-x-7" : "translate-x-1"
                }`}
            ></div>
          </div>
          <span className="text-gray-700">{isLimited ? "Limited" : "Unlimited"}</span>
        </div>

        {/* Return Date */}
        {isLimited && (
          <SharedInput
            type="date"
            name="return_date"
            label="Return Date"
            placeholder="Select return date"
            control={control}
            rules={{ required: true }}
            dateLimit="future"
            disabled={!selectedDepartment}
            error={errors.return_date}
          />
        )}

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
            "Assign Asset"
          )}
        </button>
      </form>
    </div>
  );
};

export default AssignAssetModal;
