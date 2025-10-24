"use client";

import React, { useEffect } from "react";

// Packages
import { useFieldArray } from "react-hook-form";

// Icons
import { FaPlus, FaTrash } from "react-icons/fa";

// Shared 
import SharedInput from "@/Shared/SharedInput/SharedInput";

/**
 * DynamicItemsInput
 * Renders dynamic rows of inputs. Each row can have multiple fields like:
 * name, description, price, quantity, etc.
 * 
 * Props:
 * - register: react-hook-form register
 * - control: react-hook-form control
 * - errors: errors from react-hook-form
 * - fieldName: string (name of the field array, e.g., "recept_items")
 * - fieldsConfig: array of objects defining each input per row
 */
const DynamicItemsInput = ({
  errors,
  control,
  register,
  fieldName = "items",
  fieldsConfig = [
    {
      type: "text",
      name: "description",
      label: "Description",
      placeholder: "Item description"
    },
    {
      name: "price",
      type: "number",
      label: "Price (USD)",
      placeholder: "Price"
    }
  ]
}) => {
  // Field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  // Ensure at least one row exists by default
  useEffect(() => {
    if (fields.length === 0) {
      const defaultRow = {};
      fieldsConfig.forEach(f => (defaultRow[f.name] = ""));
      append(defaultRow);
    }
  }, [fields, append, fieldsConfig]);

  // Remove row
  const handleRemove = (index) => {
    remove(index);
    if (fields.length === 1) {
      const defaultRow = {};
      fieldsConfig.forEach(f => (defaultRow[f.name] = ""));
      append(defaultRow);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="font-semibold text-gray-700 block mb-2">Items / Details</label>

      {/* Horizontal line */}
      <p className="w-full bg-gray-500 h-[1px]"></p>

      {/* Rows */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-wrap items-end gap-3">
          {/* Index */}
          <div className="flex items-center justify-center w-6 text-gray-600 font-medium pb-2">
            {index + 1}.
          </div>

          {/* Input fields */}
          {fieldsConfig.map((f, idx) => (
            <div
              key={idx}
              className={f.width ? `w-${f.width}` : "flex-1 min-w-[150px]"}
            >
              <SharedInput
                label={f.label}
                name={`${fieldName}.${index}.${f.name}`}
                type={f.type || "text"}
                placeholder={f.placeholder || ""}
                register={register}
                rules={f.rules || (f.type === "number" ? {
                  required: `${f.label} is required`,
                  min: { value: 0, message: `${f.label} must be positive` }
                } : { required: `${f.label} is required` })}
                error={errors?.[fieldName]?.[index]?.[f.name]}
              />
            </div>
          ))}

          {/* Delete button */}
          <div className="flex items-end mt-6">
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="flex items-center gap-1 px-3 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-semibold"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* Horizontal line */}
      <p className="w-full bg-gray-500 h-[1px]"></p>

      {/* Add button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            const defaultRow = {};
            fieldsConfig.forEach(f => (defaultRow[f.name] = ""));
            append(defaultRow);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all mt-1"
        >
          <FaPlus /> Add Item
        </button>
      </div>
    </div>
  );
};

export default DynamicItemsInput;
