import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, UserIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { formatCustomerName } from '../utils/nameFormatter';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getUserDisplayName = () => {
    const nameInfo = formatCustomerName(user);
    return nameInfo.display;
  };

  const getUserCompany = () => {
    const company = user?.user_metadata?.company;
    return company ? company.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') : null;
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <img 
                src="/header_icon.png" 
                alt="CloudBucks Logo" 
                className="h-12 w-12 object-contain"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                CloudBucks
              </h1>
              <p className="text-sm text-gray-600">
                Compare cloud pricing across AWS, Azure & GCP in USD/INR
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <ChartBarIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Real-time Estimates
              </span>
            </motion.div>

            {/* User Authentication Section */}
            <div className="relative">
              {user ? (
                // Authenticated User Profile
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    {getUserCompany() && (
                      <p className="text-xs text-gray-500">
                        {getUserCompany()}
                      </p>
                    )}
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>
              ) : (
                // Non-authenticated Sign In Button
                <motion.div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Free to use • Sign in for PDF downloads
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign In</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {user ? (
                    // Authenticated User Menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                        {getUserCompany() && (
                          <p className="text-xs text-gray-400">
                            {getUserCompany()}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {user?.id?.slice(-8) || 'N/A'}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    // Sign In/Sign Up Menu for non-authenticated users
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          CloudBucks Account
                        </p>
                        <p className="text-xs text-gray-500">
                          Sign in to download reports and invoices
                        </p>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowAuthModal(true);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          Sign In / Create Account
                        </button>
                        <div className="px-3 py-2 text-xs text-gray-500 bg-blue-50 rounded">
                          <p className="font-medium text-blue-800 mb-1">Free Features:</p>
                          <ul className="space-y-0.5">
                            <li>• Compare cloud pricing</li>
                            <li>• View cost breakdowns</li>
                            <li>• Configure services</li>
                          </ul>
                          <p className="font-medium text-blue-800 mt-2 mb-1">Premium (Free Account):</p>
                          <ul className="space-y-0.5">
                            <li>• Download PDF reports</li>
                            <li>• Generate invoices</li>
                            <li>• Save configurations</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </motion.header>
  );
};

export default Header; 