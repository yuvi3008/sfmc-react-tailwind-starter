import React from 'react'
import CustomDropdown from './CustomDropdown'


function Select({ options, value, onChange }){
    return(
        <CustomDropdown options={options} value={value} onChange={onChange} />
    )
}

export default Select