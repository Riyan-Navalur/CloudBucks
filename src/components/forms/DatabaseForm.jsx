import React from 'react';
import { motion } from 'framer-motion';
import { CircleStackIcon } from '@heroicons/react/24/outline';

const DATABASE_TYPES = [
  { value: 'mysql', label: 'MySQL', description: 'Popular open-source relational database' },
  { value: 'postgresql', label: 'PostgreSQL', description: 'Advanced open-source relational database' },
];

const DatabaseForm = ({ database, updateDatabase }) => {
  const handleChange = (field, value) => {
    updateDatabase({ [field]: value });
  };

  const selectedType = DATABASE_TYPES.find(type => type.value === database.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CircleStackIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Database</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Type
          </label>
          <select
            value={database.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="select-field"
          >
            {DATABASE_TYPES.map((type) => (
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
            Number of Instances
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={database.instances}
            onChange={(e) => handleChange('instances', parseInt(e.target.value) || 1)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Database Storage (GB)
        </label>
        <input
          type="number"
          min="20"
          max="1000"
          value={database.storage}
          onChange={(e) => handleChange('storage', parseInt(e.target.value) || 20)}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 20 GB, Maximum: 1,000 GB
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gray-50 rounded-lg border"
      >
        <div className="text-sm text-gray-600">
          <p className="font-medium">Database Configuration:</p>
          <p>
            {database.instances} × {selectedType?.label} instance{database.instances > 1 ? 's' : ''}
          </p>
          <p>
            {database.storage} GB storage per instance
          </p>
          <p>
            Total storage: {database.storage * database.instances} GB
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DatabaseForm; 