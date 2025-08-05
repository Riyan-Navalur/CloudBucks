import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ChevronDownIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

// Simplified SLA data - only showing key metrics
const SLA_SUMMARY = {
  '99.5': { label: 'Basic (99.5%)', downtime: '3.6h/month', providers: ['AWS EC2', 'GCP Compute'] },
  '99.9': { label: 'Standard (99.9%)', downtime: '43min/month', providers: ['AWS S3', 'Azure VMs'] },
  '99.95': { label: 'Premium (99.95%)', downtime: '22min/month', providers: ['AWS RDS', 'Azure SQL'] },
  '99.99': { label: 'Enterprise (99.99%)', downtime: '4.3min/month', providers: ['Multi-AZ', 'Regional'] }
};

const SUPPORT_TIERS = {
  basic: { name: 'Basic/Free', cost: 'Free', aws: 'Basic', azure: 'Basic', gcp: 'Basic' },
  standard: { name: 'Standard', cost: '$100/mo', aws: 'Developer', azure: 'Standard', gcp: 'Standard' },
  business: { name: 'Business', cost: '$500+/mo', aws: 'Business', azure: 'Professional', gcp: 'Enhanced' },
  enterprise: { name: 'Enterprise', cost: '$1000+/mo', aws: 'Enterprise', azure: 'Premier', gcp: 'Premium' }
};

const SLAComparison = () => {
  const { sla } = useSelector((state) => state.pricing.services);
  const [showDetails, setShowDetails] = useState(false);
  
  const selectedUptime = sla.uptime;
  const selectedSupport = sla.supportLevel;
  const selectedSLA = SLA_SUMMARY[selectedUptime];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">SLA Summary</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Compact Summary */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Selected SLA Info */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Your SLA Configuration</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-blue-900">{selectedSLA?.label}</div>
              <div className="text-xs text-blue-700">Max downtime: {selectedSLA?.downtime}</div>
              <div className="text-xs text-blue-600">
                Available from: {selectedSLA?.providers.join(', ')}
              </div>
            </div>
          </div>

          {/* Support Level */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <InformationCircleIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Support Level</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-900 capitalize">{selectedSupport}</div>
              <div className="text-xs text-green-700">
                Estimated cost: {SUPPORT_TIERS[selectedSupport]?.cost || 'Variable'}
              </div>
              <div className="text-xs text-green-600">
                Response time varies by provider
              </div>
            </div>
          </div>
        </div>

        {/* Quick SLA Reference */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(SLA_SUMMARY).map(([uptime, data]) => (
            <div
              key={uptime}
              className={`text-center p-2 rounded text-xs ${
                uptime === selectedUptime
                  ? 'bg-blue-100 border border-blue-300 text-blue-800'
                  : 'bg-gray-50 border border-gray-200 text-gray-600'
              }`}
            >
              <div className="font-medium">{uptime}%</div>
              <div className="text-xs opacity-75">{data.downtime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-4">
              
              {/* Provider Comparison */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Provider SLA Quick Reference</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-orange-50 border border-orange-200 rounded p-2">
                    <div className="font-medium text-orange-800 mb-1">AWS</div>
                    <div className="space-y-1 text-orange-700">
                      <div>EC2: 99.5% → 99.99%</div>
                      <div>RDS: 99.95%</div>
                      <div>S3: 99.9%</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="font-medium text-blue-800 mb-1">Azure</div>
                    <div className="space-y-1 text-blue-700">
                      <div>VMs: 99.9% → 99.99%</div>
                      <div>SQL: 99.99%</div>
                      <div>Storage: 99.9%</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <div className="font-medium text-green-800 mb-1">GCP</div>
                    <div className="space-y-1 text-green-700">
                      <div>Compute: 99.5% → 99.99%</div>
                      <div>Cloud SQL: 99.95%</div>
                      <div>Storage: 99.9%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Quick Reference */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Support Tier Comparison</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {Object.entries(SUPPORT_TIERS).map(([key, tier]) => (
                    <div
                      key={key}
                      className={`p-2 rounded border ${
                        key === selectedSupport
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className="font-medium">{tier.name}</div>
                      <div className="text-xs opacity-75">{tier.cost}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Insights - Condensed */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 space-y-1">
                  <div>💡 <strong>Multi-AZ deployments</strong> offer 99.99% vs 99.5% single-zone</div>
                  <div>💡 <strong>Managed services</strong> typically have better SLAs than compute instances</div>
                  <div>💡 <strong>Enterprise support</strong> can cost $1,000-$15,000+ per month</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SLAComparison; 