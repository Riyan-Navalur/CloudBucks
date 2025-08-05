import React from 'react';
import { motion } from 'framer-motion';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const BANDWIDTH_PRESETS = [
  { value: 100, label: '100 GB - Light Usage' },
  { value: 500, label: '500 GB - Medium Usage' },
  { value: 1000, label: '1 TB - Heavy Usage' },
  { value: 5000, label: '5 TB - Enterprise' },
  { value: 10000, label: '10 TB - High Traffic' },
];

const BandwidthForm = ({ bandwidth, updateBandwidth }) => {
  const handleChange = (field, value) => {
    updateBandwidth({ [field]: value });
  };

  const formatBandwidth = (gb) => {
    if (gb >= 1000) {
      return `${(gb / 1000).toFixed(1)} TB`;
    }
    return `${gb} GB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <ArrowsRightLeftIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Bandwidth Transfer</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Data Transfer (GB)
        </label>
        <input
          type="number"
          min="1"
          max="100000"
          value={bandwidth.amount}
          onChange={(e) => handleChange('amount', parseInt(e.target.value) || 500)}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          Data transfer out from cloud to internet
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BANDWIDTH_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleChange('amount', preset.value)}
              className={`p-2 text-left rounded-lg border transition-all ${
                bandwidth.amount === preset.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gray-50 rounded-lg border"
      >
        <div className="text-sm text-gray-600">
          <p className="font-medium">Bandwidth Configuration:</p>
          <p>
            {formatBandwidth(bandwidth.amount)} monthly transfer
          </p>
          <p>
            Average daily: {formatBandwidth(Math.round(bandwidth.amount / 30))}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BandwidthForm; 