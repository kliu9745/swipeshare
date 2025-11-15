import React from 'react';

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick = null
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-200',
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
    highlighted: 'bg-white border-2 border-blue-200'
  };

  return (
    <div 
      className={`rounded-xl p-4 ${variants[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
