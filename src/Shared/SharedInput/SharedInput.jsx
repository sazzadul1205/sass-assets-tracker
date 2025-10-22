"use client";

// React components
import React, { useState } from "react";

// Icons
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";

// Packages
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// RHF
import { Controller } from "react-hook-form";

/**
 * SharedInput
 * Reusable input supporting:
 * - text, password, email, number, etc.
 * - textarea with configurable rows
 * - datepicker via react-hook-form Controller
 * - select dropdown (options from parent)
 * - error display
 */
const SharedInput = ({
  label,
  type = "text",
  placeholder = "",
  register,
  name,
  error,
  rules = {},
  className = "",
  control,
  rows = 3,
  options = [],
  dateLimit = "past",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  const commonClasses = `w-full px-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-4 outline-none transition-all ${error
    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
    : "border-gray-400 focus:border-blue-500 focus:ring-blue-100"
    }`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-md block mb-2">
          <span className="font-semibold text-gray-700">
            {label}
            {rules?.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Textarea */}
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={rows}
          {...(register ? register(name, rules) : {})}
          className={commonClasses + " resize-none"}
        />
      ) : type === "select" ? (
        // Dropdown select
        <select
          {...(register ? register(name, rules) : {})}
          className={commonClasses}
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === "date" && control ? (
        // DatePicker
        // DatePicker
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => {
            // Handle date restriction
            let dateProps = {};
            if (dateLimit === "past") dateProps.maxDate = new Date();
            else if (dateLimit === "future") dateProps.minDate = new Date();
            // if "none", no limits added

            return (
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
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  className={`pl-10 ${commonClasses}`}
                  {...dateProps}
                />
              </div>
            );
          }}
        />
      ) : (
        // Regular input
        <div className="relative">
          <input
            type={inputType}
            placeholder={placeholder}
            {...(register ? register(name, rules) : {})}
            className={commonClasses + " pr-11"}
          />

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

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default SharedInput;
