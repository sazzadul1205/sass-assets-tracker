"use client";
import React from "react";
import { FaCubes, FaPlus } from "react-icons/fa";

const SharedHeader = ({
  title = "Assets",
  description = "Manage and organize your company assets efficiently.",
  tip = "Tip: Keep asset records updated for accurate tracking.",
  buttonLabel = "Add New",
  onAddClick,
  Icon, // optional component (e.g. FaCubes)
  icon, // optional rendered JSX (e.g. <Department />)
  ButtonIcon = FaPlus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      {/* Left Side - Title & Info */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
          {/* Prefer rendered SVG (icon) → then Icon component → fallback */}
          {icon ? (
            icon
          ) : Icon ? (
            <Icon size={28} className="text-blue-600" />
          ) : (
            <FaCubes size={28} className="text-blue-600" />
          )}

          {title}
        </h1>

        {/* Description */}
        <p className="mt-1 text-gray-500 text-sm sm:text-base">{description}</p>

        {/* Tip */}
        {tip && (
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">{tip}</p>
        )}
      </div>

      {/* Right Side - Add New Button (Optional) */}
      {onAddClick && (
        <div className="mt-4 sm:mt-0">
          <button
            onClick={onAddClick}
            className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold
              border border-blue-700 shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800
              transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:scale-95"
          >
            {ButtonIcon && <ButtonIcon className="text-white text-sm" />}
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default SharedHeader;
