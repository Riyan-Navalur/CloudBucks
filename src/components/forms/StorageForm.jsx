import React from 'react';
import { motion } from 'framer-motion';
import { CircleStackIcon } from '@heroicons/react/24/outline';

const STORAGE_TYPES = [
  { value: 'ssd', label: 'SSD (High Performance)', description: 'Fast, low-latency storage' },
  { value: 'hdd', label: 'HDD (Standard)', description: 'Cost-effective bulk storage' },
];

const StorageForm = ({ storage, updateStorage }) => {
  const handleChange = (field, value) => {
    updateStorage({ [field]: value });
  };

  const selectedType = STORAGE_TYPES.find(type => type.value === storage.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CircleStackIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Storage</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Type
          </label>
          <select
            value={storage.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="select-field"
          >
            {STORAGE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {selectedType && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedType.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Amount (GB)
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={storage.amount}
            onChange={(e) => handleChange('amount', parseInt(e.target.value) || 100)}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">
            1 GB - 10,000 GB
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gray-50 rounded-lg border"
      >
        <div className="text-sm text-gray-600">
          <p className="font-medium">Storage Configuration:</p>
          <p>
            {storage.amount} GB of {selectedType?.label.toLowerCase()}
          </p>
          <p>
            Estimated IOPS: {storage.type === 'ssd' ? storage.amount * 3 : Math.floor(storage.amount * 0.5)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StorageForm; 