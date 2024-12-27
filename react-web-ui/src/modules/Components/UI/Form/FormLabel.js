import React from 'react';

const FormLabel = ({ children, className = 'font-semibold mt-2', ...props }) => {
  return (
    <label className={`block text-sm text-nowrap ${className}`} {...props}>
      {children}
    </label>
  );
};

export default FormLabel;
