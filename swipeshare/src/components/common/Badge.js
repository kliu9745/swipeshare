import React from 'react';
import './Badge.css';

export const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
