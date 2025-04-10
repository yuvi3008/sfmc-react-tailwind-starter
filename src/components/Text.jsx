import React from 'react'

function Text({ value, onChange }) {
  return (
    <input
    type="text"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 shadow-md"
  />
  )
}

export default Text