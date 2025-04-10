import React from 'react'
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

function Phoneinput({ value, onChange, error, setError }) {
  return (
    <div>
      <PhoneInput
        international
        defaultCountry="IN"
        value={value || ""}
        onChange={(phone) => {
          if (phone && isValidPhoneNumber(phone)) {
            setError("");
          } else {
            setError("Invalid phone number for the selected country");
          }
          onChange(phone);
        }}
        className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 shadow-md focus:ring-0 focus:outline-none focus:border-transparent"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Phoneinput