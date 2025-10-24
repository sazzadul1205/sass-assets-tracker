import React from "react";

// Icons
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLaptop,
  FaInfoCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaFileAlt,
  FaStickyNote,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdCategory } from "react-icons/md";

const ViewRequestModal = ({ selectedAsset, setSelectedAsset }) => {

  // Handle close function
  const handleClose = () => {
    setSelectedAsset(null);
    document.getElementById("View_Request_Modal").close();
  };

  // Check if asset is selected 
  if (!selectedAsset) return null;

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Map priorities and statuses to styles
  const priorityColors = {
    Urgent: "text-red-700",
    High: "text-orange-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };

  // Map priorities and statuses to styles
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Accepted: "bg-blue-100 text-blue-700",
    Canceled: "bg-gray-200 text-gray-700",
    "Working On": "bg-purple-100 text-purple-700",
  };

  return (
    <div
      id="View_Request_Modal"
      className="modal-box w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl px-6 py-5 text-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title and Icon */}
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold">{selectedAsset.request_title}</h2>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Sub-header with Type, Priority, and Status */}
      <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200">

        {/* Type and Priority */}
        <div>
          <p className="text-sm text-gray-700">
            {selectedAsset.request_type} • Priority:{" "}
            <span
              className={`font-semibold ${priorityColors[selectedAsset.priority] || "text-gray-700"
                }`}
            >
              {selectedAsset.priority}
            </span>
          </p>
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${statusColors[selectedAsset.status] || "bg-gray-100 text-gray-600"
            }`}
        >
          {selectedAsset.status}
        </span>
      </div>

      {/* Main Info Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          {
            icon: <FaUser className="text-blue-500" />,
            label: "Requester Name",
            value: selectedAsset.requester_name,
          },
          {
            icon: <FaEnvelope className="text-blue-500" />,
            label: "Email",
            value: selectedAsset.requester_email,
          },
          {
            icon: <FaPhone className="text-blue-500" />,
            label: "Phone",
            value: selectedAsset.requester_phone_number,
          },
          {
            icon: <FaCalendarAlt className="text-blue-500" />,
            label: "Created At",
            value: formatDate(selectedAsset.created_at),
          },
          {
            icon: <FaLaptop className="text-blue-500" />,
            label: "Asset Name",
            value: selectedAsset.asset_name,
          },
          {
            icon: <FaInfoCircle className="text-blue-500" />,
            label: "Asset ID",
            value: selectedAsset.asset_id,
          },
          {
            icon: <MdCategory className="text-blue-500" />,
            label: "Category",
            value: selectedAsset.asset_category,
          },
          {
            icon: <FaInfoCircle className="text-blue-500" />,
            label: "Condition",
            value: selectedAsset.current_condition,
          },
          {
            icon: <FaCalendarAlt className="text-blue-500" />,
            label: "Work Period",
            value: `${formatDate(selectedAsset.expected_work_start_date)} → ${formatDate(
              selectedAsset.expected_work_end_date
            )}`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
          >
            {item.icon}
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-gray-700 text-sm">{item.value || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description / Notes / Attachments */}
      <div className="space-y-4">
        {[
          {
            icon: <FaInfoCircle className="text-blue-500 mt-1" />,
            label: "Request Details",
            value: selectedAsset.request_details,
          },
          {
            icon: <FaInfoCircle className="text-blue-500 mt-1" />,
            label: "Condition Description",
            value: selectedAsset.condition_description,
          },
          {
            icon: <FaStickyNote className="text-blue-500 mt-1" />,
            label: "Notes",
            value: selectedAsset.notes,
          },
          {
            icon: <FaFileAlt className="text-blue-500 mt-1" />,
            label: "Attachment Ref",
            value: selectedAsset.attachment_reference_id,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            {item.icon}
            <div>
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-gray-700 text-sm">{item.value || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRequestModal;
