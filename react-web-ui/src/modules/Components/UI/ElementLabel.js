import React from 'react';

const ElementLabel = ({ children, bgColor = 'bg-gray-500', className = '', ...props }) => {
  return (
    <span className={`text-white px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${bgColor} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default ElementLabel;
