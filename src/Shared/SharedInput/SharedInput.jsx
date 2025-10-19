"use client";

// React components
import React, { useState } from "react";

// Icons
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";

// Packages
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// PAckages
import { Controller } from "react-hook-form";

/**
 * SharedInput
 * Reusable input with RHF support, optional rules, password toggle, and datepicker.
 */
const SharedInput = ({
  label,
  type = "text",
  placeholder = "",
  register, // RHF register function
  name, // field name
  error, // error object from RHF
  rules = {},
  className = "",
  control, // optional Controller from RHF
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-md block mb-2">
          <span className="font-semibold text-gray-700">
            {label}
            {rules?.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* DatePicker with Controller */}
      {type === "date" && control ? (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
              <DatePicker
                placeholderText={placeholder || "Select date"}
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MMM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-4 outline-none transition-all
                  ${error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-400 focus:border-blue-500 focus:ring-blue-100"
                  }`}
              />
            </div>
          )}
        />
      ) : (
        <div className="relative">
          <input
            type={inputType}
            placeholder={placeholder}
            {...(register ? register(name, rules) : {})}
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-4 outline-none pr-11 transition-all
              ${error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-gray-400 focus:border-blue-500 focus:ring-blue-100"
              }`}
          />

          {/* Password toggle */}
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
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default SharedInput;
