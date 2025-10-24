import React from 'react';

// Icons
import { HiOutlineEye } from 'react-icons/hi';
import { MdScanner, MdMonitor } from 'react-icons/md';
import { FaLaptop, FaDesktop, FaMobile, FaTablet, FaPrint, FaCamera, FaKeyboard, FaMouse, FaFileAlt } from 'react-icons/fa';

// Map categories to styled icons
const categoryIcons = {
  Laptop: { icon: <FaLaptop />, color: "bg-blue-100 text-blue-600" },
  Desktop: { icon: <FaDesktop />, color: "bg-indigo-100 text-indigo-600" },
  Smartphone: { icon: <FaMobile />, color: "bg-green-100 text-green-600" },
  Tablet: { icon: <FaTablet />, color: "bg-purple-100 text-purple-600" },
  Printer: { icon: <FaPrint />, color: "bg-yellow-100 text-yellow-600" },
  Scanner: { icon: <MdScanner />, color: "bg-pink-100 text-pink-600" },
  Camera: { icon: <FaCamera />, color: "bg-orange-100 text-orange-600" },
  Monitor: { icon: <MdMonitor />, color: "bg-gray-100 text-gray-600" },
  Keyboard: { icon: <FaKeyboard />, color: "bg-teal-100 text-teal-600" },
  Mouse: { icon: <FaMouse />, color: "bg-red-100 text-red-600" },
  Other: { icon: <FaFileAlt />, color: "bg-gray-200 text-gray-700" },
};

// Map priorities to styles
const priorityStyles = {
  Urgent: "text-red-700 font-medium",
  High: "text-orange-600 font-medium",
  Medium: "text-yellow-600 font-medium",
  Low: "text-green-600 font-medium",
};

// Map statuses to styled badges
const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Accepted: "bg-blue-100 text-blue-700",
  Canceled: "bg-gray-200 text-gray-700",
  "Working On": "bg-purple-100 text-purple-700",
};

const TableItem = ({ asset, setSelectedAsset }) => {
  // Destructure asset
  const category = categoryIcons[asset.asset_category] || categoryIcons["Other"];

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      {/* Icon */}
      <td className="px-4 py-3 text-center cursor-default">
        <div className={`inline-flex items-center justify-center p-4 rounded-xl text-2xl ${category.color}`}>
          {category.icon}
        </div>
      </td>

      {/* Requester Name */}
      <td className="px-4 py-3 text-gray-700 cursor-default">{asset.requester_name}</td>

      {/* Asset Name */}
      <td className="px-4 py-3 text-gray-700 cursor-default">{asset.asset_name}</td>

      {/* Status */}
      <td className="px-4 py-3 text-center cursor-default">
        <span className={`px-3 py-1.5 rounded-xl text-sm font-medium shadow-xl w-32 cursor-default ${statusStyles[asset.status] || "bg-gray-100 text-gray-600"}`}>
          {asset.status}
        </span>
      </td>

      {/* Asset ID */}
      <td className="px-4 py-3 text-gray-700 cursor-default">{asset.asset_id}</td>

      {/* Asset Category */}
      <td className="px-4 py-3 text-gray-700 cursor-default">{asset.asset_category}</td>

      {/* Current Condition */}
      <td className="px-4 py-3 text-gray-700 cursor-default">{asset.current_condition}</td>

      {/* Priority */}
      <td className="px-4 py-3 text-center cursor-default">
        <span className={priorityStyles[asset.priority] || "text-gray-600 font-medium"}>
          {asset.priority}
        </span>
      </td>


      {/* Details button */}
      <td className="px-4 py-3 text-center cursor-default">
        <button
          onClick={() => {
            setSelectedAsset(asset);
            document.getElementById("View_Request_Modal").showModal()
          }}
          className="flex items-center justify-center gap-3 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <HiOutlineEye size={18} /> Details
        </button>
      </td>
    </tr >
  );
};

export default TableItem;

