import React from 'react';
import './Card.css';

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick = null
}) => {
  return (
    <div 
      className={`card card-${variant} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {children}
    </div>
  );
};

export default Card;
