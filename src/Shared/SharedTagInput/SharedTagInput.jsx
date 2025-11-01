// React Components
import React, { useState } from 'react';

// Icons
import { ImCross } from 'react-icons/im';

const SharedTagInput = ({
  items = [],
  appendItem,
  removeItem,
  label = "Items",
  placeholder = "Add new item",
  showNumbers = false,
}) => {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    const value = newValue.trim();
    if (value) {
      if (showNumbers) {
        appendItem({
          value: `${items.length + 1}. ${value}`,
          index: items.length + 1,
        });
      } else {
        appendItem({ value });
      }
      setNewValue("");
    }
  };


  return (
    <div className="mb-3 w-full">
      {/* Label */}
      <label className="block font-semibold text-sm mb-2 capitalize">
        {label}
      </label>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => removeItem(index)}
              className="flex items-center border-1 border-gray-600 
              hover:border-blue-600 font-semibold text-gray-800 
              gap-2 px-3 sm:px-5 py-1 rounded-md cursor-pointer 
              hover:bg-blue-100 transition-all duration-200 text-md"
            >
              {item.value} <ImCross className="text-blue-500 text-[10px]" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm px-2 sm:px-5 py-2 w-full">
            No {label.toLowerCase()} added yet.
          </p>
        )}
      </div>

      {/* Add New Tag */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">

        {/* Input */}
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="input input-bordered bg-white text-black border-black w-full sm:w-[65%] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow-xl hover:shadow-2xl px-5 py-2 sm:py-1 w-full sm:w-auto cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default SharedTagInput;