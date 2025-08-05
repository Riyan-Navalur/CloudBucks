import React from 'react';
import { motion } from 'framer-motion';
import { CpuChipIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const INSTANCE_TYPES = [
  { value: 't3.micro', label: 't3.micro', description: '1 vCPU, 1 GB RAM' },
  { value: 't3.small', label: 't3.small', description: '1 vCPU, 2 GB RAM' },
  { value: 't3.medium', label: 't3.medium', description: '2 vCPU, 4 GB RAM' },
  { value: 't3.large', label: 't3.large', description: '2 vCPU, 8 GB RAM' },
  { value: 't3.xlarge', label: 't3.xlarge', description: '4 vCPU, 16 GB RAM' },
  { value: 'm5.large', label: 'm5.large', description: '2 vCPU, 8 GB RAM' },
  { value: 'm5.xlarge', label: 'm5.xlarge', description: '4 vCPU, 16 GB RAM' },
  { value: 'c5.large', label: 'c5.large', description: '2 vCPU, 4 GB RAM' },
  { value: 'c5.xlarge', label: 'c5.xlarge', description: '4 vCPU, 8 GB RAM' },
];

const REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
];

const ComputeForm = ({ compute, updateCompute, planLimits = null }) => {
  const handleChange = (field, value) => {
    updateCompute({ [field]: value });
  };

  // Check if instances exceed plan limit
  const exceedsInstanceLimit = planLimits && 
    planLimits.maxInstances !== Infinity && 
    compute.instances > planLimits.maxInstances;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CpuChipIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Compute Instances</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instance Type
          </label>
          <select
            value={compute.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="select-field"
          >
            {INSTANCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Instances
            {planLimits && planLimits.maxInstances !== Infinity && (
              <span className="text-xs text-gray-500 ml-1">
                (Max: {planLimits.maxInstances})
              </span>
            )}
          </label>
          <input
            type="number"
            min="1"
            max={planLimits?.maxInstances !== Infinity ? planLimits?.maxInstances : undefined}
            value={compute.instances}
            onChange={(e) => handleChange('instances', parseInt(e.target.value) || 1)}
            className={`input-field ${exceedsInstanceLimit ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {exceedsInstanceLimit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex items-center space-x-2 text-red-600"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-sm">
                Exceeds plan limit of {planLimits.maxInstances} instances
              </span>
            </motion.div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hours per Month
          </label>
          <input
            type="number"
            min="1"
            max="744"
            value={compute.hours}
            onChange={(e) => handleChange('hours', parseInt(e.target.value) || 1)}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum 744 hours per month (24×31 days)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={compute.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="select-field"
          >
            {REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Configuration Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Setup:</strong> {compute.instances}x {compute.type} instances
          </p>
          <p>
            <strong>Runtime:</strong> {compute.hours} hours/month in {compute.region}
          </p>
          <p>
            <strong>Total vCPU Hours:</strong> {
              INSTANCE_TYPES.find(t => t.value === compute.type)?.description.split(' ')[0] === '1' 
                ? compute.hours * compute.instances
                : (parseInt(INSTANCE_TYPES.find(t => t.value === compute.type)?.description.split(' ')[0]) || 2) * compute.hours * compute.instances
            } per month
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ComputeForm; 