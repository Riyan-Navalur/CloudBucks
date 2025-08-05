import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/pricingCalculator';
import { 
  CpuChipIcon,
  CircleStackIcon,
  ArrowsRightLeftIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SERVICE_CONFIGS = {
  compute: {
    name: 'Compute Instances',
    icon: CpuChipIcon,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    description: 'Virtual machines and processing power'
  },
  storage: {
    name: 'Storage',
    icon: CircleStackIcon,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Data storage and file systems'
  },
  bandwidth: {
    name: 'Bandwidth',
    icon: ArrowsRightLeftIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Data transfer and network usage'
  },
  database: {
    name: 'Database',
    icon: CircleStackIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Managed database services'
  },
  disasterRecovery: {
    name: 'Disaster Recovery',
    icon: ShieldCheckIcon,
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    description: 'Backup and disaster recovery'
  },
  sla: {
    name: 'SLA & Support',
    icon: ClockIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Service level agreements and support plans'
  }
};

const PROVIDER_NAMES = {
  aws: 'Amazon AWS',
  azure: 'Microsoft Azure',
  gcp: 'Google Cloud'
};

const ServiceBreakdown = ({ estimates, timeframe, currency = 'USD' }) => {
  const services = ['compute', 'storage', 'bandwidth', 'database', 'disasterRecovery', 'sla'];

  const formatTimeframe = (timeframe) => {
    return timeframe === 'monthly' ? 'Monthly' : 'Annual';
  };

  const getCheapestProviderForService = (service) => {
    const providers = Object.entries(estimates);
    return providers.reduce((cheapest, [provider, costs]) => {
      return costs[service] < cheapest.cost ? { provider, cost: costs[service] } : cheapest;
    }, { provider: providers[0][0], cost: providers[0][1][service] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {formatTimeframe(timeframe)} Service Breakdown ({currency})
        </h3>
        <div className="text-sm text-gray-500">
          Comparing across all providers
        </div>
      </div>

      <div className="space-y-6">
        {services.map((service, index) => {
          const config = SERVICE_CONFIGS[service];
          const Icon = config.icon;
          const cheapest = getCheapestProviderForService(service);

          return (
            <motion.div
              key={service}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{config.name}</h4>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estimates).map(([provider, costs]) => {
                  const isCheapest = provider === cheapest.provider;
                  const cost = costs[service];
                  
                  return (
                    <div
                      key={provider}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isCheapest 
                          ? 'border-secondary-300 bg-secondary-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-700">
                          {PROVIDER_NAMES[provider]}
                        </span>
                        {isCheapest && (
                          <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full font-medium">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(cost, currency)}
                      </div>
                      {!isCheapest && cost > 0 && cheapest.cost > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          +{(((cost - cheapest.cost) / cost) * 100).toFixed(1)}% more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Service-specific insights */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Total across all providers:</span>
                    <span className="font-medium">
                      {formatCurrency(Object.values(estimates).reduce((sum, provider) => sum + provider[service], 0), currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Average cost:</span>
                    <span className="font-medium">
                      {formatCurrency(Object.values(estimates).reduce((sum, provider) => sum + provider[service], 0) / Object.keys(estimates).length, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200"
      >
        <h4 className="font-semibold text-gray-900 mb-2">Cost Summary ({currency})</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Total {formatTimeframe(timeframe).toLowerCase()} cost range:</strong>{' '}
            {formatCurrency(Math.min(...Object.values(estimates).map(e => e.total)), currency)} -{' '}
            {formatCurrency(Math.max(...Object.values(estimates).map(e => e.total)), currency)}
          </p>
          <p>
            <strong>Potential savings:</strong>{' '}
            {formatCurrency(Math.max(...Object.values(estimates).map(e => e.total)) - Math.min(...Object.values(estimates).map(e => e.total)), currency)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceBreakdown; 