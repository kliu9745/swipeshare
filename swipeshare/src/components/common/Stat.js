import React from 'react';
import './Stat.css';

export const Stat = ({ label, value, color = 'white', textColor = '#4b5563' }) => {
  return (
    <div className="stat" style={{ backgroundColor: color }}>
      <div className="stat-value" style={{ color: textColor }}>{value}</div>
      <div className="stat-label" style={{ color: textColor }}>{label}</div>
    </div>
  );
};

export default Stat;
