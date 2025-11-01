// React Components
import React, { useState } from 'react';

// Packages
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

// Icons
import { ImCross } from 'react-icons/im';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import SharedInput from '@/Shared/SharedInput/SharedInput';
import DynamicItemsInput from '@/Shared/DynamicItemsInput/DynamicItemsInput';

const CreatedDepartmentModal = ({ UserEmail }) => {
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


  // Handle Close Function
  const handleClose = () => {
    reset();
    setError(null);
    document.getElementById('Created_Department_Modal').close();
  };

  // Handle Submit
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      // Prepare payload
      const payload = {
        department_Code: data.department_Code,
        department_Name: data.department_Name,
        description: data.description,
        roles: data.roles || [],
        budget: {
          notes: data.budget_notes || '',
          annual: parseFloat(data.budget_annual) || 0,
          quarterly: parseFloat(data.budget_quarterly) || 0,
          allocated: parseFloat(data.budget_allocated) || 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: UserEmail,
      };

      // Post to your backend API
      const response = await axiosPublic.post("/Departments", payload);

      if (response.status === 201 || response.status === 200) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Department Created",
          text: "The department has been successfully created!",
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
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Created_Department_Modal"
      className="modal-box min-w-3xl max-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-5 py-4 text-black overflow-y-auto"
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
        {/* Department Code */}
        <SharedInput
          label="Department Code"
          register={register}
          name="department_Code"
          placeholder="Department Code"
          rules={{
            required: "Department Code is required",
            maxLength: { value: 10, message: "Department Code cannot exceed 10 characters" },
            pattern: {
              value: /^[A-Z0-9]+$/,
              message: "Department Code must be uppercase letters or numbers",
            },
          }}
          error={errors.department_Code}
        />

        {/* Department Name */}
        <SharedInput
          label="Department Name"
          register={register}
          name="department_Name"
          placeholder="Department Name"
          rules={{
            required: "Department Name is required",
            minLength: { value: 3, message: "Department Name must be at least 3 characters" },
            maxLength: { value: 50, message: "Department Name cannot exceed 50 characters" },
            pattern: {
              value: /^[A-Za-z0-9\s&'-]+$/,
              message: "Department Name contains invalid characters",
            },
          }}
          error={errors.department_Name}
        />

        {/* Department Description */}
        <SharedInput
          label="Department Description"
          register={register}
          name="description"
          placeholder="Description"
          type="textarea"
          rows={3}
          rules={{
            maxLength: { value: 200, message: "Description cannot exceed 200 characters" },
          }}
          error={errors.description}
        />

        {/* Dynamic Roles Input */}
        <DynamicItemsInput
          control={control}
          register={register}
          errors={errors}
          title="Department Roles"
          showIndex={false}
          fieldName="roles"
          fieldsConfig={[
            {
              type: "text",
              name: "role",
              label: "Role",
              placeholder: "Role name",
              widthClass: "w-[150px]",
            },
            {
              type: "text",
              name: "description",
              label: "Description",
              placeholder: "Role description",
            },
          ]}
        />

        {/* Budget Section */}
        <div className="mt-4 border-t border-gray-300 pt-4 space-y-3">
          {/* Header - Budget */}
          <h4 className="font-semibold text-lg text-gray-700">Department Budget</h4>

          {/* Budget Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Annual Budget */}
            <SharedInput
              label="Annual Budget"
              register={register}
              name="budget_annual"
              placeholder="Enter annual budget"
              type="number"
              rules={{
                required: "Annual budget is required",
                min: { value: 0, message: "Budget must be positive" },
              }}
              error={errors.budget_annual}
            />

            {/* Quarterly Budget */}
            <SharedInput
              label="Quarterly Budget"
              register={register}
              name="budget_quarterly"
              placeholder="Enter quarterly budget"
              type="number"
              rules={{
                min: { value: 0, message: "Budget must be positive" },
              }}
              error={errors.budget_quarterly}
            />

            {/* Allocated Funds */}
            <SharedInput
              label="Allocated Funds"
              register={register}
              name="budget_allocated"
              placeholder="Funds allocated so far"
              type="number"
              rules={{
                min: { value: 0, message: "Allocated funds must be positive" },
              }}
              error={errors.budget_allocated}
            />
          </div>

          {/* Budget Notes */}
          <SharedInput
            label="Budget Notes"
            register={register}
            name="budget_notes"
            placeholder="Any remarks or notes about the budget"
            type="textarea"
            rows={3}
            rules={{
              maxLength: { value: 200, message: "Notes cannot exceed 200 characters" },
            }}
            error={errors.budget_notes}
          />
        </div>

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
            "Create Department"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatedDepartmentModal;