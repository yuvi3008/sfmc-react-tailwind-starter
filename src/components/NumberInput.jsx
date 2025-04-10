import React from 'react'

function NumberInput({value, onChange}) {
  return (
    <input
    type="number"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 shadow-md"
  />
  )
}

export default NumberInput