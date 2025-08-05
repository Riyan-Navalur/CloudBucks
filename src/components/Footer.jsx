import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-white border-t border-gray-200 mt-12"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* App Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">CloudBucks</h3>
            <p className="text-sm text-gray-600 mb-4">
              Compare cloud pricing across AWS, Azure, and Google Cloud Platform. 
              Make informed decisions for your cloud infrastructure with multi-currency support and professional reporting.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>for cloud enthusiasts</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              <span>Important Notice</span>
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • Pricing estimates are approximations for comparison purposes
              </p>
              <p>
                • Actual costs may vary based on usage patterns and regions
              </p>
              <p>
                • Currency conversion rates are approximate and may fluctuate
              </p>
              <p>
                • Generated reports and invoices are for estimation only
              </p>
              <p>
                • Always consult official provider pricing for final decisions
              </p>
              <p>
                • Prices are updated periodically and may not reflect latest changes
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>✅ Real-time cost estimates</p>
              <p>✅ Multi-provider comparison</p>
              <p>✅ USD & INR currency support</p>
              <p>✅ Service breakdown analysis</p>
              <p>✅ Tier plans (Basic/Enterprise/Student)</p>
              <p>✅ SLA & support configuration</p>
              <p>✅ Monthly & yearly projections</p>
              <p>✅ Interactive charts</p>
              <p>✅ PDF reports & invoices</p>
              <p>✅ Mobile responsive design</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 CloudBucks. Built with React, Tailwind CSS, and ❤️
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>AWS</span>
              <span>•</span>
              <span>Azure</span>
              <span>•</span>
              <span>Google Cloud</span>
              <span>•</span>
              <span>USD/INR</span>
              <span>•</span>
              <span>PDF Export</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 