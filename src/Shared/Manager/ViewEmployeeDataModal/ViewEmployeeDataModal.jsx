// React components
import React from 'react';

// Icons
import {
  FaClipboardList, FaIdBadge, FaUserCircle, FaEnvelope, FaBirthdayCake,
  FaMapMarkerAlt, FaCity, FaGlobe, FaPhone, FaBuilding, FaUsersCog,
  FaClock, FaCalendarAlt, FaSyncAlt, FaCheckCircle,
  FaCopy
} from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

// Packages
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';

// Styles
import 'react-tooltip/dist/react-tooltip.css';


const ViewEmployeeDataModal = ({ selectedEmployee, setSelectedEmployee }) => {
  // Handle close function
  const handleClose = () => {
    setSelectedEmployee(null);
    document.getElementById("View_Employee_Data_Modal").close();
  };

  // Format date helper
  const formatDate = (date) => {
    if (!date) return "Not Provided";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      id="View_Employee_Data_Modal"
      className="modal-box w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl px-6 py-5 text-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title and Icon */}
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold">
            {selectedEmployee?.name || "N/A"}
          </h2>
        </div>



        {/*  Inside your modal, after the header */}
        <div className="flex">
          {/* Copy Button */}
          <button
            type="button"
            data-tooltip-id="copy-tooltip"
            data-tooltip-content="Copy data from clipboard"
            onClick={async () => {
              try {
                // Define what data you want to copy — adjust fields as needed
                const copyData = {
                  city: selectedEmployee?.city || '',
                  country: selectedEmployee?.country || '',
                  address: selectedEmployee?.address || '',
                  hire_time: selectedEmployee?.hire_time || '',
                  position_name: selectedEmployee?.position_name || '',
                  department_name: selectedEmployee?.department_name || '',
                  designation_name: selectedEmployee?.designation_name || '',
                  organization_name: selectedEmployee?.organization_name || '',
                };

                // Copy to clipboard
                await navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));


                // Show success toast at top-left
                Swal.fire({
                  toast: true,
                  position: "top-start",
                  icon: "success",
                  title: "Copied!",
                  text: "Employee data copied to clipboard.",
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                });
              } catch (err) {
                console.error("Clipboard copy failed:", err);
                // Error toast also at top-left
                Swal.fire({
                  toast: true,
                  position: "top-start",
                  icon: "error",
                  title: "Failed to copy",
                  text: "Could not copy data to clipboard.",
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            <FaCopy className="text-lg" />
          </button>

          {/* Tooltip Component */}
          <Tooltip id="copy-tooltip" place="top" effect="solid" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
          title="Close modal"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Basic Info Card */}
        <div className="p-6 border-t-1 border-blue-600">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaIdBadge className="text-blue-600" /> Basic Information
          </h2>

          {/* Info Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaUserCircle />} label="User ID" value={selectedEmployee?._id} />
            <InfoRow icon={<FaUserCircle />} label="Full Name" value={selectedEmployee?.name} />
            <InfoRow icon={<FaEnvelope />} label="Email" value={selectedEmployee?.email} />
            <InfoRow icon={<FaBirthdayCake />} label="Date of Birth" value={formatDate(selectedEmployee?.dob)} />
          </div>
        </div>

        {/* Address Details Card */}
        <div className="p-6 border-t-1 border-blue-600">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" /> Address Details
          </h2>

          {/* Info Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaMapMarkerAlt />} label="Address" value={selectedEmployee?.address} />
            <InfoRow icon={<FaCity />} label="City" value={selectedEmployee?.city} />
            <InfoRow icon={<FaGlobe />} label="Country" value={selectedEmployee?.country} />
            <InfoRow icon={<FaPhone />} label="Phone Number" value={selectedEmployee?.phone} />
          </div>
        </div>

        {/* Work Information Card */}
        <div className="p-6 border-t-1 border-blue-600">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Work Information
          </h2>

          {/* Info Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaBuilding />} label="Organization" value={selectedEmployee?.organization_name} />
            <InfoRow icon={<FaIdBadge />} label="Designation" value={selectedEmployee?.designation_name} />
            <InfoRow icon={<FaUsersCog />} label="Department" value={selectedEmployee?.department_name} />
            <InfoRow icon={<FaClock />} label="Position" value={selectedEmployee?.position_name} />
            <InfoRow icon={<FaCalendarAlt />} label="Hire Time" value={formatDate(selectedEmployee?.hire_time)} />
          </div>
        </div>

        {/* Account Metadata Card */}
        <div className="p-6 border-t-1 border-blue-600">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaSyncAlt className="text-blue-600" /> Account Metadata
          </h2>

          {/* Info Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoRow icon={<FaCalendarAlt />} label="Created At" value={formatDate(selectedEmployee?.createdAt)} />
            <InfoRow icon={<FaCalendarAlt />} label="Updated At" value={formatDate(selectedEmployee?.updatedAt)} />
            <InfoRow
              icon={<FaCheckCircle />}
              label="Status"
              value={
                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <FaCheckCircle /> Active
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Row Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
    {/* Icon */}
    <div className="text-blue-600 text-lg">{icon}</div>

    {/* Label and Value */}
    <div>
      {/* Label */}
      <p className="text-sm text-gray-500 font-medium">{label}</p>

      {/* Value */}
      <p className="text-base font-semibold text-gray-800">
        {value || "Not Provided"}
      </p>
    </div>
  </div>
);

export default ViewEmployeeDataModal;
