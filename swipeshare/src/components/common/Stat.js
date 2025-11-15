import React from 'react';

export const Stat = ({ label, value, color = 'bg-white' }) => {
  return (
    <div className={`${color} rounded-xl p-3 text-center`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1 text-gray-600">{label}</div>
    </div>
  );
};

export default Stat;
