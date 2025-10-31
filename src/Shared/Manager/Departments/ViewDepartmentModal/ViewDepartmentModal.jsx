import React from "react";

// Icons
import { ImCross } from "react-icons/im";
import {
  FaUsers,
  FaTasks,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";

const ViewDepartmentModal = ({ selectedDepartment, setSelectedDepartment }) => {
  // Close modal
  const handleClose = () => {
    setSelectedDepartment(null);
    document.getElementById("View_Department_Modal").close();
  };

  // If no department is selected, do not render the modal content
  if (!selectedDepartment) return null;

  // Destructure department data
  const {
    roles,
    budget,
    createdAt,
    description,
    department_Name,
    department_Code
  } = selectedDepartment;

  return (
    <div
      id="View_Department_Modal"
      className="modal-box w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl px-6 py-5 text-gray-900 relative"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-4 hover:text-red-500 transition-colors duration-300"
        title="Close modal"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaClipboardList className="text-blue-600 text-3xl" />
        <h2 className="text-2xl font-bold">{department_Name}</h2>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaTasks className="text-gray-600" />
          <span className="font-semibold">Department Code:</span>
          <span>{department_Code}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-600" />
          <span className="font-semibold">Created At:</span>
          <span>{new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <FaUsers className="text-gray-600" />
          <span className="font-semibold">Description:</span>
          <span>{description}</span>
        </div>
      </div>

      {/* Roles Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FaUsers className="text-blue-500 text-xl" /> Roles
        </h3>

        <div className="space-y-3">
          {roles.map((roleItem, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              {/* Role Name with Icon */}
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <FaUserTie className="text-blue-600 text-lg" />
                <span className="text-blue-700 font-semibold text-sm md:text-base">
                  {roleItem.role}
                </span>
              </div>

              {/* Role Description */}
              <p className="text-gray-600 text-sm md:text-base">{roleItem.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" /> Budget
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col">
            <span className="font-semibold">Annual:</span>
            <span>${budget.annual.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col">
            <span className="font-semibold">Quarterly:</span>
            <span>${budget.quarterly.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col">
            <span className="font-semibold">Allocated:</span>
            <span>${budget.allocated.toLocaleString()}</span>
          </div>
          <div className="col-span-1 md:col-span-3 p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col">
            <span className="font-semibold">Notes:</span>
            <span>{budget.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentModal;
