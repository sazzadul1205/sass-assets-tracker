
// React components
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Icons
import { ImCross } from "react-icons/im";

// Shared
import SharedInput from '@/Shared/SharedInput/SharedInput';

const CreateNewRequestModal = () => {

  // React Hooks
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  // Handle Close Function
  const handleClose = () => {
    document.getElementById('Create_New_Request_Modal').close();
  }

  // Handle Submit Function
  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div
      id="Create_New_Request_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] px-5 py-4 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className='flex items-center justify-between' >

        {/* Modal Title */}
        <h3 className="font-bold text-xl">
          Create New Request
        </h3>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className=" hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Divider */}
      <p className='w-[98%] mx-auto h-[1px] bg-gray-500 my-3' />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
        {/* Request Title */}
        <SharedInput
          label="Request Title"
          type="text"
          placeholder="Your Request Title"
          name="request_title"
          register={register}
          rules={{
            required: "Request title is required",
            minLength: { value: 3, message: "Title must be at least 3 characters" },
            maxLength: { value: 100, message: "Title must be at most 100 characters" },
          }}
          error={errors.request_title}
        />

        {/* Request Details */}
        <SharedInput
          label="Request Details"
          type="textarea"
          placeholder="Provide detailed information about your request..."
          name="request_details"
          register={register}
          rows={5}
          rules={{
            required: "Request details are required",
            minLength: { value: 10, message: "Details must be at least 10 characters" },
            maxLength: { value: 1000, message: "Details must be at most 1000 characters" },
          }}
          error={errors.request_details}
        />

        {/* Request Type & Priority */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3' >
          {/* Request Type */}
          <SharedInput
            label="Request Type"
            type="select"
            placeholder="Select Request Type"
            name="request_type"
            register={register}
            options={[
              "New Assets",
              "Repair",
              "Replacement",
              "Upgrade",
              "Maintenance",
              "Decommission",
              "Inspection",
              "Relocation",
              "Loan/Temporary Assignment",
              "Software Installation",
              "Hardware Installation",
              "Network/Connectivity Issue",
              "Access Rights / Permissions",
              "Other",
            ]}
            rules={{ required: "Request type is required" }}
            error={errors.request_type}
          />

          {/* Priority */}
          <SharedInput
            label="Priority"
            type="select"
            placeholder="Select Priority"
            name="priority"
            register={register}
            options={["Low", "Medium", "High", "Urgent"]}
            rules={{ required: "Priority is required" }}
            error={errors.priority}
          />
        </div>

        {/* Divider */}
        <p className='w-[98%] mx-auto h-[1px] bg-gray-500 my-3' />

        {/* Asset Name */}
        <SharedInput
          label="Asset Name"
          type="text"
          placeholder="Asset Name"
          name="asset_name"
          register={register}
          rules={{
            required: "Asset name is required",
            minLength: { value: 3, message: "Asset name must be at least 3 characters" },
            maxLength: { value: 100, message: "Asset name must be at most 100 characters" },
          }}
          error={errors.asset_name}
        />

        {/* Asset ID / Serial Number */}
        <SharedInput
          label="Asset ID / Serial Number"
          type="text"
          placeholder="Asset ID / Serial Number"
          name="asset_id"
          register={register}
          rules={{
            required: "Asset ID / Serial Number is required",
            minLength: { value: 3, message: "Asset ID / Serial Number must be at least 3 characters" },
            maxLength: { value: 100, message: "Asset ID / Serial Number must be at most 100 characters" },
          }}
          error={errors.asset_id}
        />

        {/* Asset Category & Current Condition */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3' >
          {/* Asset Category */}
          <SharedInput
            label="Asset Category"
            type="select"
            placeholder="Asset Category"
            name="asset_category"
            register={register}
            options={[
              "Laptop",
              "Desktop",
              "Smartphone",
              "Tablet",
              "Printer",
              "Scanner",
              "Camera",
              "Monitor",
              "Keyboard",
              "Mouse",
              "Other",
            ]}
            rules={{ required: "Asset category is required" }}
            error={errors.asset_category}
          />

          {/* Current Condition */}
          <SharedInput
            label="Current Condition"
            type="select"
            placeholder="Current Condition"
            name="current_condition"
            register={register}
            options={["Good", "Fair", "Poor", "Broken", "Other"]}
            rules={{ required: "Current condition is required" }}
            error={errors.current_condition}
          />

        </div>


        {/* Condition Description */}
        <SharedInput
          label="Condition Description"
          type="textarea"
          placeholder="Describe the condition of the asset..."
          name="condition_description"
          register={register}
          rows={5}
          rules={{
            required: "Condition description is required",
            minLength: { value: 10, message: "Description must be at least 10 characters" },
            maxLength: { value: 1000, message: "Description must be at most 1000 characters" },
          }}
          error={errors.condition_description}
        />

        {/* Divider */}
        <p className='w-[98%] mx-auto h-[1px] bg-gray-500 my-3' />

        {/* Expected Work Dates */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {/* Expected Work Start Date */}
          <SharedInput
            label="Expected Work Start Date"
            type="date"
            placeholder="Expected Work Start Date"
            name="expected_work_start_date"
            register={register}
            control={control}
            rules={{ required: "Expected work start date is required" }}
            error={errors.expected_work_start_date}
          />

          {/* Expected Work End Date */}
          <SharedInput
            label="Expected Work End Date"
            type="date"
            placeholder="Expected Work End Date"
            name="expected_work_end_date"
            register={register}
            control={control}
            rules={{ required: "Expected work end date is required" }}
            error={errors.expected_work_end_date}
          />
        </div>

        {/* Attachment / Reference ID */}
        <SharedInput
          label="Attachment / Reference ID"
          type="text"
          placeholder="Attachment / Reference ID"
          name="attachment_reference_id"
          register={register}
          rules={{
            required: "Attachment / Reference ID is required",
            minLength: { value: 3, message: "Attachment / Reference ID must be at least 3 characters" },
            maxLength: { value: 100, message: "Attachment / Reference ID must be at most 100 characters" },
          }}
          error={errors.attachment_reference_id}
        />

        {/* Divider */}
        <p className='w-[98%] mx-auto h-[1px] bg-gray-500 my-3' />

        {/* Requester Name */}
        <SharedInput
          label="Requester Name"
          type="text"
          placeholder="Requester Name"
          name="requester_name"
          register={register}
          rules={{
            required: "Requester name is required",
            minLength: { value: 3, message: "Requester name must be at least 3 characters" },
            maxLength: { value: 100, message: "Requester name must be at most 100 characters" },
          }}
          error={errors.requester_name}
        />

        {/* Requester Phone Number & Email */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3' >
          {/* Requester Phone Number */}
          <SharedInput
            label="Requester Phone Number"
            type="text"
            placeholder="Requester Phone Number"
            name="requester_phone_number"
            register={register}
            rules={{
              required: "Requester phone number is required",
              minLength: { value: 11, message: "Requester phone number must be at least 11 characters" },

            }}
            error={errors.requester_phone_number}
          />

          {/* Requester Email */}
          <SharedInput
            label="Requester Email"
            type="email"
            placeholder="Requester Email"
            name="requester_email"
            register={register}
            rules={{ required: "Requester email is required" }}
            error={errors.requester_email}
          />
        </div>

        {/* Notes */}
        <SharedInput
          label="Notes"
          type="textarea"
          placeholder="Notes..."
          name="notes"
          register={register}
          rows={5}
          rules={{
            minLength: { value: 10, message: "Notes must be at least 10 characters" },
            maxLength: { value: 1000, message: "Notes must be at most 1000 characters" },
          }}
          error={errors.notes}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-1/3 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold
             shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all 
             duration-300 transform hover:-translate-y-0.5"
          >
            Create Request
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateNewRequestModal;