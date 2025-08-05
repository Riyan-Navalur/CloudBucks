import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const BACKUP_FREQUENCIES = [
  { value: 'daily', label: 'Daily Backups' },
  { value: 'hourly', label: 'Hourly Backups' },
  { value: 'weekly', label: 'Weekly Backups' },
];

const DisasterRecoveryForm = ({ disasterRecovery, updateDisasterRecovery }) => {
  const handleChange = (field, value) => {
    updateDisasterRecovery({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Disaster Recovery</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="disaster-recovery-enabled"
            checked={disasterRecovery.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="disaster-recovery-enabled" className="text-sm font-medium text-gray-700">
            Enable Disaster Recovery & Backup
          </label>
        </div>

        {disasterRecovery.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Frequency
              </label>
              <select
                value={disasterRecovery.backupFrequency}
                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                className="select-field"
              >
                {BACKUP_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Disaster Recovery includes:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Automated backups of all data</li>
                  <li>Cross-region replication</li>
                  <li>Additional compute instances for failover</li>
                  <li>Network redundancy</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!disasterRecovery.enabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gray-50 rounded-lg border"
          >
            <div className="text-sm text-gray-600">
              <p>
                Disaster recovery is disabled. Your data will have basic provider-level redundancy only.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DisasterRecoveryForm; 