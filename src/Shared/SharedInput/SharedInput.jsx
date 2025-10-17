"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SharedInput = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  register,
  name,
  required = false,
  className = "",
}) => {

  // Password
  const [showPassword, setShowPassword] = useState(false);

  // Password toggle
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

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

      {/* Input */}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...(register
            ? register(name, { required })
            : { value, onChange, required })}
          className=" w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 
          placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all pr-11 bg-white
          "
        />

        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-500 hover:text-gray-700
              transition-colors
              focus:outline-none
              cursor-pointer
            "
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default SharedInput;
