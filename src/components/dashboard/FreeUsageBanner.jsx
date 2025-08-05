import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  InformationCircleIcon, 
  XMarkIcon, 
  StarIcon,
  DocumentTextIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const FreeUsageBanner = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Don't show banner if user is authenticated or if dismissed
  if (user || !isVisible) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-semibold text-blue-900">
                  Welcome to CloudBucks - Free Cloud Cost Comparison!
                </h3>
                <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800 font-medium mb-1">🚀 Free Features (No Sign-up Required):</p>
                  <ul className="text-blue-700 space-y-0.5 text-xs">
                    <li>• Compare AWS, Azure, and GCP pricing</li>
                    <li>• Real-time cost calculations</li>
                    <li>• Service configuration tools</li>
                    <li>• Interactive charts and breakdowns</li>
                    <li>• SLA comparison matrix</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-blue-800 font-medium mb-1">⭐ Premium Features (Free Account):</p>
                  <ul className="text-blue-700 space-y-0.5 text-xs">
                    <li>• Download professional PDF reports</li>
                    <li>• Generate personalized invoices</li>
                    <li>• Include your contact information</li>
                    <li>• Export cost comparisons</li>
                    <li>• Save and track your configurations</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  <span>Create Free Account</span>
                </motion.button>
                
                <div className="flex items-center space-x-2 text-xs text-blue-600">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Sign up only required for PDF downloads</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default FreeUsageBanner; 