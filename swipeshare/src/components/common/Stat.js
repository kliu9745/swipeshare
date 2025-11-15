import React from 'react';
import './Stat.css';

export const Stat = ({ label, value, textColor = 'default' }) => {
  return (
    <div className={`stat stat-text-${textColor}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default Stat;
