import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLaptop,
  FaCalendarAlt,
  FaClipboardList,
  FaInfoCircle,
  FaRegStickyNote,
  FaPaperclip,
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaStopCircle,
} from "react-icons/fa";
import { MdOutlineCategory, MdOutlineAssignmentTurnedIn } from "react-icons/md";

const RequestCard = ({ request, onAccept, onReject, onStart, onCancel, onComplete }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full text-gray-900 bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="text-blue-600" />
            {request.request_title}
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            {request.request_type} • Priority:{" "}
            <span
              className={`font-medium ${request.priority === "Urgent"
                ? "text-red-700"
                : request.priority === "High"
                  ? "text-orange-600"
                  : request.priority === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
            >
              {request.priority}
            </span>
          </p>
        </div>

        {/* Status */}
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${request.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : request.status === "Completed"
              ? "bg-green-100 text-green-700"
              : request.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : request.status === "Accepted"
                  ? "bg-blue-100 text-blue-700"
                  : request.status === "Canceled"
                    ? "bg-gray-200 text-gray-700"
                    : request.status === "Working On"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
            }`}
        >
          {request.status}
        </span>
      </div>

      {/* Body */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 px-6 py-6 gap-4">
        {[
          {
            icon: <FaUser className="text-blue-500" />,
            label: "Requester Name",
            value: request.requester_name,
          },
          {
            icon: <FaEnvelope className="text-blue-500" />,
            label: "Email",
            value: request.requester_email,
          },
          {
            icon: <FaPhone className="text-blue-500" />,
            label: "Phone",
            value: request.requester_phone_number,
          },
          {
            icon: <FaCalendarAlt className="text-blue-500" />,
            label: "Created At",
            value: formatDate(request.created_at),
          },
          {
            icon: <FaLaptop className="text-blue-500" />,
            label: "Asset Name",
            value: request.asset_name,
          },
          {
            icon: <FaInfoCircle className="text-blue-500" />,
            label: "Asset ID",
            value: request.asset_id,
          },
          {
            icon: <MdOutlineCategory className="text-blue-500" />,
            label: "Category",
            value: request.asset_category,
          },
          {
            icon: <MdOutlineAssignmentTurnedIn className="text-blue-500" />,
            label: "Condition",
            value: request.current_condition,
          },
          {
            icon: <FaCalendarAlt className="text-blue-500" />,
            label: "Work Period",
            value: `${formatDate(request.expected_work_start_date)} → ${formatDate(
              request.expected_work_end_date
            )}`,
          },
        ].map((item, index) => (
          <p key={index} className="flex items-center gap-2 text-sm">
            {item.icon}
            <span className="font-semibold">{item.label}:</span>{" "}
            <span className="text-gray-700">{item.value}</span>
          </p>
        ))}
      </div>

      {/* Description and Notes */}
      <div className="px-6 pb-5 pt-2 space-y-3 border-t border-gray-300 bg-gray-50">
        {[
          {
            icon: <FaInfoCircle className="text-blue-500 mt-1" />,
            label: "Details",
            value: request.request_details,
          },
          {
            icon: <FaInfoCircle className="text-blue-500 mt-1" />,
            label: "Condition Description",
            value: request.condition_description,
          },
          {
            icon: <FaRegStickyNote className="text-blue-500 mt-1" />,
            label: "Notes",
            value: request.notes,
          },
          {
            icon: <FaPaperclip className="text-blue-500 mt-1" />,
            label: "Attachment Ref",
            value: request.attachment_reference_id,
          },
        ].map((item, index) => (
          <p
            key={index}
            className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed"
          >
            {item.icon}
            <span>
              <span className="font-semibold">{item.label}:</span>{" "}
              {item.value || "N/A"}
            </span>
          </p>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 bg-white">
        {/* Pending Actions */}
        {request.status === "Pending" && (
          <>
            {/* Accept Button */}
            <button
              onClick={() => onAccept?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <FaCheckCircle /> Accept
            </button>

            {/* Reject Button */}
            <button
              onClick={() => onReject?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <FaTimesCircle /> Reject
            </button>
          </>
        )}

        {/* Accepted Actions */}
        {request.status === "Accepted" && (
          <>
            {/* Start Work Button */}
            <button
              onClick={() => onStart?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <FaPlayCircle /> Start Work
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => onCancel?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <FaTimesCircle /> Cancel
            </button>
          </>
        )}

        {/* Working On Actions */}
        {request.status === "Working On" && (
          <>
            {/* Complete Button */}
            <button
              onClick={() => onComplete?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <FaCheckCircle /> Complete
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => onCancel?.(request)}
              className="flex items-center gap-2 px-10 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <FaStopCircle /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
