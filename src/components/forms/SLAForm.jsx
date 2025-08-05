import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, LifebuoyIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Realistic SLA tiers based on actual cloud provider offerings
const UPTIME_OPTIONS = [
  { 
    value: '99.5', 
    label: '99.5% Uptime', 
    description: 'Basic - ~3.6 hours downtime/month',
    tier: 'Basic',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    services: 'Basic compute instances, dev/test workloads',
    providers: 'Entry-level offerings across providers'
  },
  { 
    value: '99.9', 
    label: '99.9% Uptime', 
    description: 'Standard - ~43 minutes downtime/month',
    tier: 'Standard',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    services: 'Standard VMs, storage accounts, basic databases',
    providers: 'AWS EC2 (single AZ), Azure VMs, GCP Compute Engine'
  },
  { 
    value: '99.95', 
    label: '99.95% Uptime', 
    description: 'Premium - ~22 minutes downtime/month',
    tier: 'Premium',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    services: 'Premium storage, managed databases',
    providers: 'AWS RDS, Azure SQL Database, GCP Cloud SQL'
  },
  { 
    value: '99.99', 
    label: '99.99% Uptime', 
    description: 'Enterprise - ~4.3 minutes downtime/month',
    tier: 'Enterprise',
    color: 'bg-green-100 text-green-700 border-green-300',
    services: 'Multi-AZ deployments, enterprise databases',
    providers: 'AWS EC2 (multi-AZ), Azure Premium, GCP Regional Persistent Disks'
  }
];

// Accurate support levels based on real cloud provider offerings
const SUPPORT_LEVELS = [
  {
    value: 'basic',
    label: 'Basic Support',
    description: 'Community forums, documentation, billing support',
    features: [
      'Community forums access',
      'Documentation and whitepapers', 
      'Billing and account support',
      'Service health dashboard',
      'Best-effort response time'
    ],
    cost: 'Free',
    providers: {
      aws: 'AWS Basic Support (Free)',
      azure: 'Azure Basic Support (Free)', 
      gcp: 'GCP Basic Support (Free)'
    }
  },
  {
    value: 'developer',
    label: 'Developer Support',
    description: 'Business hours email support, general guidance',
    features: [
      'Business hours email support',
      'General architectural guidance',
      'Best practices documentation',
      '< 24 hour response for general issues',
      'Access to support forums'
    ],
    cost: '$29-100/month or 3% of monthly usage',
    providers: {
      aws: 'AWS Developer Support ($29/month)',
      azure: 'Azure Standard Support ($100/month)',
      gcp: 'GCP Standard Support ($100/month)'
    }
  },
  {
    value: 'business',
    label: 'Business Support',
    description: '24/7 technical support, faster response times',
    features: [
      '24/7 technical support via phone/chat',
      'Architectural guidance for use cases',
      'Third-party software support',
      '< 4 hour response for production issues',
      '< 1 hour response for urgent issues',
      'Infrastructure Event Management'
    ],
    cost: '$100-1000/month or 10% of monthly usage',
    providers: {
      aws: 'AWS Business Support ($100/month minimum)',
      azure: 'Azure Professional Direct ($1000/month)',
      gcp: 'GCP Enhanced Support ($500/month)'
    }
  },
  {
    value: 'enterprise',
    label: 'Enterprise Support',
    description: 'Dedicated support team, proactive monitoring',
    features: [
      'Dedicated Technical Account Manager',
      'Proactive monitoring and optimization',
      'Infrastructure Event Management',
      '< 1 hour response for urgent issues',
      '< 15 minutes for business-critical issues',
      'Access to AWS/Azure/GCP engineers',
      'Custom training and workshops'
    ],
    cost: '$1000-15000/month (10-15% of usage)',
    providers: {
      aws: 'AWS Enterprise Support ($15,000/month minimum)',
      azure: 'Azure Premier Support (Custom pricing)',
      gcp: 'GCP Premium Support (Custom pricing)'
    }
  }
];

const SLAForm = ({ sla, updateSLA }) => {
  const handleChange = (field, value) => {
    updateSLA({ [field]: value });
  };

  const selectedUptimeOption = UPTIME_OPTIONS.find(option => option.value === sla.uptime);
  const selectedSupportLevel = SUPPORT_LEVELS.find(level => level.value === sla.supportLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <ClockIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">SLA & Support</h3>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Real Cloud Provider SLAs</p>
            <p>These SLA tiers are based on actual offerings from AWS, Azure, and Google Cloud. Different services within each provider may have varying SLA guarantees.</p>
          </div>
        </div>
      </div>

      {/* Uptime SLA Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <LifebuoyIcon className="h-4 w-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            Service Level Agreement (Uptime Guarantee)
          </label>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {UPTIME_OPTIONS.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="uptime"
                  value={option.value}
                  checked={sla.uptime === option.value}
                  onChange={(e) => handleChange('uptime', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  sla.uptime === option.value 
                    ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-500 ring-opacity-50' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${option.color}`}>
                          {option.tier}
                        </div>
                        <h4 className="font-semibold text-gray-900">{option.label}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-medium">Services:</span> {option.services}</p>
                        <p><span className="font-medium">Examples:</span> {option.providers}</p>
                      </div>
                    </div>
                    {sla.uptime === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-3"
                      >
                        <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Level Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <LifebuoyIcon className="h-4 w-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            Support Level
          </label>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {SUPPORT_LEVELS.map((level) => (
            <motion.div
              key={level.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="supportLevel"
                  value={level.value}
                  checked={sla.supportLevel === level.value}
                  onChange={(e) => handleChange('supportLevel', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  sla.supportLevel === level.value 
                    ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-500 ring-opacity-50' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{level.label}</h4>
                        <span className={`text-sm font-medium ${
                          level.value === 'basic' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {level.cost}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                      
                      {/* Features */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {level.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Provider Examples */}
                      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <p className="font-medium mb-1">Provider Examples:</p>
                        <div className="space-y-0.5">
                          <p><span className="font-medium text-orange-600">AWS:</span> {level.providers.aws}</p>
                          <p><span className="font-medium text-blue-600">Azure:</span> {level.providers.azure}</p>
                          <p><span className="font-medium text-green-600">GCP:</span> {level.providers.gcp}</p>
                        </div>
                      </div>
                    </div>
                    {sla.supportLevel === level.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-3"
                      >
                        <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(selectedUptimeOption && selectedSupportLevel) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <h4 className="font-medium text-gray-900 mb-2">Selected Configuration</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">SLA Tier:</span> {selectedUptimeOption.tier} - {selectedUptimeOption.label}</p>
            <p><span className="font-medium">Support Level:</span> {selectedSupportLevel.label}</p>
            <p><span className="font-medium">Estimated Cost Impact:</span> {selectedSupportLevel.cost}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SLAForm; 