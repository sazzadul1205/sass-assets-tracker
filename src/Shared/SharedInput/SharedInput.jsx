"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * SharedInput
 * A reusable input component with optional label, error display, and password toggle.
 */
const SharedInput = ({
  label,
  type = "text",
  placeholder = "",
  register,   // RHF register function
  name,       // field name
  error,      // error object from RHF
  required = false,
  className = "",
}) => {
  // Toggle visibility for password fields
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type (password or text for toggle)
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-md block mb-2">
          <span className="font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...(register ? register(name, { required }) : {})} // call register function
          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-4 outline-none pr-11 transition-all
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-400 focus:border-blue-500 focus:ring-blue-100"}
          `}
        />

        {/* Password toggle button */}
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default SharedInput;
