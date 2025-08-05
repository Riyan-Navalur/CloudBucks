import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const ViewToggle = ({ selected, onChange }) => {
  const options = [
    { value: 'chart', label: 'Charts', icon: ChartBarIcon },
    { value: 'table', label: 'Table', icon: TableCellsIcon }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selected === option.value
                ? 'text-primary-700 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {selected === option.value && (
              <motion.div
                layoutId="view-bg"
                className="absolute inset-0 bg-white rounded-md shadow-sm"
                style={{ zIndex: -1 }}
              />
            )}
            <Icon className="h-4 w-4" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle; 