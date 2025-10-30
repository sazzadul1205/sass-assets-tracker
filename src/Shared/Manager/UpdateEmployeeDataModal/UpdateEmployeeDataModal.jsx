import useAxiosPublic from '@/Hooks/useAxiosPublic';
import SharedInput from '@/Shared/SharedInput/SharedInput';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';

const UpdateEmployeeDataModal = ({
  user,
  refetch,
  selectedEmployee,
  setSelectedEmployee,
}) => {
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
    formState: { errors }
  } = useForm();

  // Reset form whenever selectedEmployee changes
  useEffect(() => {
    if (selectedEmployee) {
      reset({
        organization_name: selectedEmployee.organization_name || '',
        designation_name: selectedEmployee.designation_name || '',
        department_name: selectedEmployee.department_name || '',
        position_name: selectedEmployee.position_name || '',
        hire_time: selectedEmployee.hire_time
          ? selectedEmployee.hire_time.split('T')[0]
          : '',
      });
    } else {
      reset({});
    }
  }, [selectedEmployee, reset]);

  // Handle Close Function
  const handleClose = () => {
    reset();
    refetch();
    setError(null);
    setSelectedEmployee(null);
    document.getElementById('Update_Employee_Data_Modal').close();
  };

  // Handle Submit
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!selectedEmployee?.email) {
        setError("No user email found. Cannot update record.");
        return;
      }

      // Prepare payload
      const payload = {
        organization_name: data.organization_name?.trim() || null,
        designation_name: data.designation_name?.trim() || null,
        department_name: data.department_name?.trim() || null,
        position_name: data.position_name?.trim() || null,
        hire_time: data.hire_time || null,
        updatedAt: new Date().toISOString(),
      };

      // PUT request (email used as identifier)
      const res = await axiosPublic.put(`/Users/${selectedEmployee.email}`, payload);

      if (res.data?.success) {
        // SweetAlert Success Message (top-left)
        Swal.fire({
          position: "top-start",
          icon: "success",
          title: "User updated successfully!",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });

        handleClose();
        refetch();
      } else {
        setError(res.data?.message || "Failed to update user data.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Update_Employee_Data_Modal"
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Organization Name */}
        <SharedInput
          label="Organization Name"
          register={register}
          name="organization_name"
          defaultValue={selectedEmployee?.organization_name || ""}
          placeholder="Enter organization name"
          rules={selectedEmployee?.organization_name ? {} : { required: "Organization Name is required" }}
          error={errors.organization_name}
        />

        {/* Designation Name */}
        <SharedInput
          label="Designation Name"
          register={register}
          name="designation_name"
          defaultValue={selectedEmployee?.designation_name || ""}
          placeholder="Enter designation name"
          rules={selectedEmployee?.designation_name ? {} : { required: "Designation Name is required" }}
          error={errors.designation_name}
        />

        {/* Department Name */}
        <SharedInput
          label="Department Name"
          register={register}
          name="department_name"
          defaultValue={selectedEmployee?.department_name || ""}
          placeholder="Enter department name"
          rules={selectedEmployee?.department_name ? {} : { required: "Department Name is required" }}
          error={errors.department_name}
        />

        {/* Position Name */}
        <SharedInput
          label="Position Name"
          register={register}
          name="position_name"
          defaultValue={selectedEmployee?.position_name || ""}
          placeholder="Enter position name"
          rules={selectedEmployee?.position_name ? {} : { required: "Position Name is required" }}
          error={errors.position_name}
        />

        {/* Hire Date */}
        <SharedInput
          label="Hire Date"
          control={control}
          name="hire_time"
          type="date"
          defaultValue={selectedEmployee?.hire_time || null}
          placeholder="Select hire date"
          rules={selectedEmployee?.hire_time ? {} : { required: "Hire date is required" }}
          error={errors.hire_time}
          dateLimit="past"
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

export default UpdateEmployeeDataModal;