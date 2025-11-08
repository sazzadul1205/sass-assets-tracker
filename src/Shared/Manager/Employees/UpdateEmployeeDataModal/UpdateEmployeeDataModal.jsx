// React Components
import React, { useEffect, useState } from 'react';

// Icons
import { FaPaste } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

// Packages
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';

// Styles
import 'react-tooltip/dist/react-tooltip.css';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared Components
import SharedInput from '@/Shared/SharedInput/SharedInput';

const UpdateEmployeeDataModal = ({
  refetch,
  DepartmentsData,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const axiosPublic = useAxiosPublic();

  // Local states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic dropdown options
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);

  // React Hook Form setup
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    isSubmitting,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const selectedDepartment = watch('department_name');

  // Populate department options whenever DepartmentsData changes
  useEffect(() => {
    if (DepartmentsData) {
      setDepartmentOptions(DepartmentsData.map(dep => dep.department_Name));
    }
  }, [DepartmentsData]);

  // When department changes, auto-update department_id and position list
  useEffect(() => {
    if (!DepartmentsData) return;

    const dept = DepartmentsData.find(d => d.department_Name === selectedDepartment);

    if (dept) {
      setPositionOptions(dept.roles.map(r => r.role));
      setValue('department_id', dept._id); // Store department ID when department is selected
    } else {
      setPositionOptions([]);
      setValue('department_id', ''); // Clear if invalid
    }

    // Clear invalid position if it doesn't belong to the new department
    const currentPosition = watch('position_name');
    if (dept && !dept.roles.map(r => r.role).includes(currentPosition)) {
      setValue('position_name', '');
    }
  }, [selectedDepartment, DepartmentsData, setValue, watch]);

  // Reset form when a new employee is selected
  useEffect(() => {
    if (!selectedEmployee || !DepartmentsData) return;

    const dept = DepartmentsData.find(d => d.department_Name === selectedEmployee.department_name);
    const positions = dept ? dept.roles.map(r => r.role) : [];
    setPositionOptions(positions);

    // Reset all fields
    reset({
      city: selectedEmployee.city || '',
      address: selectedEmployee.address || '',
      country: selectedEmployee.country || '',
      department_name: selectedEmployee.department_name || '',
      department_id: selectedEmployee.department_id || '', // Include department_id
      position_name: '',
      designation_name: selectedEmployee.designation_name || '',
      organization_name: selectedEmployee.organization_name || '',
      hire_time: selectedEmployee.hire_time
        ? selectedEmployee.hire_time.split('T')[0]
        : '',
    });

    // Restore position if valid
    if (selectedEmployee.position_name && positions.includes(selectedEmployee.position_name)) {
      setValue('position_name', selectedEmployee.position_name);
    }
  }, [selectedEmployee, DepartmentsData, reset, setValue]);

  // Close and cleanup modal
  const handleClose = () => {
    reset();
    refetch && refetch();
    setError(null);
    setSelectedEmployee(null);
    document.getElementById('Update_Employee_Data_Modal').close();
  };

  // Submit updated employee info
  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!selectedEmployee?.email) {
        setError('No user email found. Cannot update record.');
        return;
      }

      const payload = {
        city: data.city?.trim() || null,
        hire_time: data.hire_time || null,
        updatedAt: new Date().toISOString(),
        country: data.country?.trim() || null,
        address: data.address?.trim() || null,
        position_name: data.position_name?.trim() || null,
        department_name: data.department_name?.trim() || null,
        department_id: data.department_id || null, // Include department_id in payload
        designation_name: data.designation_name?.trim() || null,
        organization_name: data.organization_name?.trim() || null,
      };

      const res = await axiosPublic.put(`/Users/${selectedEmployee.email}`, payload);

      if (res.data?.success) {
        Swal.fire({
          position: 'top-start',
          icon: 'success',
          title: 'User updated successfully!',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });

        handleClose();
      } else {
        setError(res.data?.message || 'Failed to update user data.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
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
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Update User Data</h3>

        <div className="flex">
          {/* Paste from clipboard */}
          <button
            type="button"
            data-tooltip-id="paste-tooltip"
            data-tooltip-content="Paste data from clipboard"
            onClick={async () => {
              try {
                const clipboardText = await navigator.clipboard.readText();
                if (!clipboardText) return;

                const pasteData = JSON.parse(clipboardText);

                // Update department_name and department_id first
                if (pasteData.department_name) {
                  setValue('department_name', pasteData.department_name);
                  const dept = DepartmentsData.find(d => d.department_Name === pasteData.department_name);
                  if (dept) {
                    setValue('department_id', dept._id);
                    setPositionOptions(dept.roles.map(r => r.role));
                  } else {
                    setValue('department_id', '');
                    setPositionOptions([]);
                  }
                }

                // Reset all other values
                reset({
                  city: pasteData.city || '',
                  country: pasteData.country || '',
                  address: pasteData.address || '',
                  hire_time: pasteData.hire_time || '',
                  position_name: pasteData.position_name || '',
                  department_name: pasteData.department_name || '',
                  department_id: pasteData.department_id || '',
                  designation_name: pasteData.designation_name || '',
                  organization_name: pasteData.organization_name || '',
                });

                if (pasteData.position_name) {
                  setValue('position_name', pasteData.position_name);
                }
              } catch (err) {
                console.error('Failed to paste data:', err);
                setError('Failed to read clipboard data. Make sure it is valid JSON.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaPaste />
          </button>

          <Tooltip id="paste-tooltip" place="top" effect="solid" />
        </div>

        {/* Close modal */}
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Divider */}
      <p className="w-[98%] mx-auto h-[1px] bg-gray-500 my-3" />

      {/* Error Display */}
      {error && (
        <div className="py-3 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

        {/* Address */}
        <SharedInput
          label="Address"
          register={register}
          name="address"
          defaultValue={selectedEmployee?.address || ''}
          placeholder="Enter Address"
          rules={selectedEmployee?.address ? {} : { required: 'Address is required' }}
          error={errors.address}
        />

        {/* City & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <SharedInput
            label="City"
            register={register}
            name="city"
            defaultValue={selectedEmployee?.city || ''}
            placeholder="Enter City"
            rules={selectedEmployee?.city ? {} : { required: 'City is required' }}
            error={errors.city}
          />

          {/* Country */}
          <SharedInput
            label="Country"
            register={register}
            name="country"
            defaultValue={selectedEmployee?.country || ''}
            placeholder="Enter Country"
            rules={selectedEmployee?.country ? {} : { required: 'Country is required' }}
            error={errors.country}
          />
        </div>

        {/* Organization */}
        <SharedInput
          label="Organization Name"
          register={register}
          name="organization_name"
          defaultValue={selectedEmployee?.organization_name || ''}
          placeholder="Enter organization name"
          rules={selectedEmployee?.organization_name ? {} : { required: 'Organization Name is required' }}
          error={errors.organization_name}
        />

        {/* Department */}
        <SharedInput
          label="Department Name"
          register={register}
          name="department_name"
          defaultValue={selectedEmployee?.department_name || ''}
          type="select"
          options={departmentOptions}
          placeholder="Select department"
          rules={selectedEmployee?.department_name ? {} : { required: 'Department Name is required' }}
          error={errors.department_name}
        />

        {/* Hidden field for department_id */}
        <input
          type="hidden"
          {...register('department_id')}
          value={watch('department_id') || ''}
        />

        {/* Position & Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position Name */}
          <SharedInput
            label="Position Name"
            register={register}
            name="position_name"
            defaultValue={selectedEmployee?.position_name || ''}
            type="select"
            options={positionOptions}
            placeholder="Select position"
            rules={selectedEmployee?.position_name ? {} : { required: 'Position Name is required' }}
            error={errors.position_name}
          />

          {/* Designation Name */}
          <SharedInput
            label="Designation Name"
            register={register}
            name="designation_name"
            defaultValue={selectedEmployee?.designation_name || ''}
            placeholder="Enter designation name"
            rules={selectedEmployee?.designation_name ? {} : { required: 'Designation Name is required' }}
            error={errors.designation_name}
          />
        </div>

        {/* Hired Date */}
        <SharedInput
          label="Hire Date"
          control={control}
          name="hire_time"
          type="date"
          defaultValue={selectedEmployee?.hire_time || null}
          placeholder="Select hire date"
          rules={selectedEmployee?.hire_time ? {} : { required: 'Hire date is required' }}
          error={errors.hire_time}
          dateLimit="past"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full h-11 font-semibold text-white rounded-lg transition-all ${isSubmitting || isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {(isSubmitting || isLoading) ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Save Details'
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployeeDataModal;
