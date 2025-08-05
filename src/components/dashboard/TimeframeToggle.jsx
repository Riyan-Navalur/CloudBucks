import React from 'react';
import { motion } from 'framer-motion';

const TimeframeToggle = ({ selected, onChange }) => {
  const options = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            selected === option.value
              ? 'text-primary-700 bg-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {selected === option.value && (
            <motion.div
              layoutId="timeframe-bg"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              style={{ zIndex: -1 }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeToggle; 