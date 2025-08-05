import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, getCheapestProvider } from '../../utils/pricingCalculator';
import { 
  CheckCircleIcon, 
  TrophyIcon,
  CloudIcon,
  ServerIcon 
} from '@heroicons/react/24/outline';

const PROVIDER_CONFIGS = {
  aws: {
    name: 'Amazon AWS',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    icon: '🟠'
  },
  azure: {
    name: 'Microsoft Azure',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: '🔵'
  },
  gcp: {
    name: 'Google Cloud',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: '🟢'
  }
};

const PricingCards = ({ estimates, timeframe, currency = 'USD' }) => {
  const cheapestProvider = getCheapestProvider(estimates);

  const formatTimeframe = (timeframe) => {
    return timeframe === 'monthly' ? '/month' : '/year';
  };

  const calculateSavings = (providerTotal, cheapestTotal) => {
    if (providerTotal === cheapestTotal) return 0;
    return ((providerTotal - cheapestTotal) / providerTotal * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(estimates).map(([provider, costs], index) => {
        const config = PROVIDER_CONFIGS[provider];
        const isCheapest = provider === cheapestProvider.provider;
        const savings = calculateSavings(costs.total, cheapestProvider.total);

        return (
          <motion.div
            key={provider}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`card card-hover relative ${
              isCheapest ? 'ring-2 ring-secondary-400 ring-opacity-50' : ''
            }`}
          >
            {/* Best Value Badge */}
            {isCheapest && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-3 -right-3 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
              >
                <TrophyIcon className="h-3 w-3" />
                <span>Best Value</span>
              </motion.div>
            )}

            {/* Provider Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                  <CloudIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-500">
                    {provider.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {isCheapest && (
                <CheckCircleIcon className="h-6 w-6 text-secondary-500" />
              )}
            </div>

            {/* Total Cost */}
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(costs.total, currency)}
              </div>
              <div className="text-sm text-gray-500">
                {formatTimeframe(timeframe)}
              </div>
            </div>

            {/* Savings/Difference */}
            {!isCheapest && savings > 0 && (
              <div className="mb-4">
                <div className="text-sm text-red-600">
                  +{savings}% more expensive
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(costs.total - cheapestProvider.total, currency)} more
                </div>
              </div>
            )}

            {isCheapest && (
              <div className="mb-4">
                <div className="text-sm text-secondary-600 font-medium">
                  Most cost-effective option
                </div>
              </div>
            )}

            {/* Service Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Service Breakdown:
              </div>
              
              {['compute', 'storage', 'bandwidth', 'database', 'disasterRecovery', 'sla'].map((service) => (
                <div key={service} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {service === 'disasterRecovery' ? 'DR' : 
                     service === 'sla' ? 'SLA & Support' : service}:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(costs[service], currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar showing cost distribution */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">Cost Distribution</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(costs.total / Math.max(...Object.values(estimates).map(e => e.total))) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 rounded-full ${config.color}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PricingCards; 