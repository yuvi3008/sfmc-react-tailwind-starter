import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Datepicker({ value, onChange }) {
  return (
    <DatePicker
      selected={value || null}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      placeholderText="Select date"
      maxDate={new Date()}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100} // optional, how many years to show
      className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 shadow-md"
    />
  )
}

export default Datepicker
