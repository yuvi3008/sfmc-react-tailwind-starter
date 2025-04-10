import React from 'react'
import { useState } from 'react';

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 rounded-lg bg-white shadow-md flex justify-between items-center text-gray-700"
      >
        {value || "Select an option"}
        <span className="ml-2 text-gray-600">▼</span>
      </button>
      {isOpen && (
        <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-3 hover:bg-blue-200 cursor-pointer transition-all"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown