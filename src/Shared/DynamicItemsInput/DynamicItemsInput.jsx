"use client";

import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
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
  title = "Items / Details",
  showIndex = true,
  fieldsConfig = [
    {
      type: "text",
      name: "description",
      label: "Description",
      placeholder: "Item description",
      widthClass: "flex-1 min-w-[150px]",
    },
    {
      name: "price",
      type: "number",
      label: "Price (USD)",
      placeholder: "Price",
      widthClass: "w-32",
    },
  ],
}) => {
  const { fields, append, remove } = useFieldArray({ control, name: fieldName });

  // Ensure at least one row exists by default
  useEffect(() => {
    if (fields.length === 0) {
      const defaultRow = {};
      fieldsConfig.forEach(f => (defaultRow[f.name] = ""));
      append(defaultRow);
    }
  }, [fields, append, fieldsConfig]);

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
      <label className="font-semibold text-gray-700 block mb-2">{title}</label>
      <p className="w-full bg-gray-500 h-[1px]"></p>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-wrap items-end gap-3">
          {showIndex && (
            <div className="flex items-center justify-center w-6 text-gray-600 font-medium pb-2">
              {index + 1}.
            </div>
          )}

          {fieldsConfig.map((f, idx) => (
            <div key={idx} className={f.widthClass || "flex-1 min-w-[150px]"}>
              <SharedInput
                label={f.label}
                name={`${fieldName}.${index}.${f.name}`}
                type={f.type || "text"}
                placeholder={f.placeholder || ""}
                register={register}
                rules={f.rules || undefined} // optional by default
                error={errors?.[fieldName]?.[index]?.[f.name]}
              />
            </div>
          ))}

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

      <p className="w-full bg-gray-500 h-[1px]"></p>

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
