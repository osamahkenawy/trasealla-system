'use client';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const CustomFlatpickr = ({
  className,
  value,
  options,
  placeholder,
  onChange,
  disabled
}) => {
  // Handle flatpickr onChange - it passes [selectedDates, dateStr, instance]
  const handleChange = (selectedDates, dateStr, instance) => {
    if (onChange) {
      // Pass the formatted date string (YYYY-MM-DD format)
      onChange(dateStr);
    }
  };

  return (
    <Flatpickr
      className={`form-control ${className || ''}`}
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default CustomFlatpickr;