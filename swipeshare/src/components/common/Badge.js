import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'px-3 py-1 bg-gray-100 text-gray-700',
    success: 'px-3 py-1 bg-green-100 text-green-700',
    warning: 'px-3 py-1 bg-yellow-100 text-yellow-700',
    danger: 'px-3 py-1 bg-red-100 text-red-700',
    pending: 'px-3 py-1 bg-yellow-100 text-yellow-700'
  };

  return (
    <span className={`rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
