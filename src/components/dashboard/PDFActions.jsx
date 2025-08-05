import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  DocumentArrowDownIcon, 
  DocumentTextIcon,
  ChevronDownIcon,
  CheckIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { generateCostReport, generateProviderReport, generateInvoice } from '../../utils/pdfGenerator';
import { convertEstimatesToCurrency } from '../../utils/pricingCalculator';
import { useAuth } from '../../contexts/AuthContext';

const PROVIDER_OPTIONS = [
  { 
    value: 'aws', 
    label: 'Amazon AWS', 
    color: 'bg-orange-500',
    shortName: 'AWS'
  },
  { 
    value: 'azure', 
    label: 'Microsoft Azure', 
    color: 'bg-blue-500',
    shortName: 'Azure'
  },
  { 
    value: 'gcp', 
    label: 'Google Cloud Platform', 
    color: 'bg-green-500',
    shortName: 'GCP'
  }
];

const REPORT_OPTIONS = [
  {
    value: 'comparison',
    label: 'Full Comparison Report',
    description: 'Compare all cloud providers',
    icon: '📊'
  },
  ...PROVIDER_OPTIONS.map(provider => ({
    value: provider.value,
    label: `${provider.shortName} Report`,
    description: `Individual ${provider.label} report`,
    icon: provider.value === 'aws' ? '🟠' : provider.value === 'azure' ? '🔵' : '🟢'
  }))
];

const PDFActions = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showInvoiceMenu, setShowInvoiceMenu] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  
  const {
    services,
    estimates,
    selectedTimeframe,
    selectedCurrency,
    exchangeRate,
    selectedPlan
  } = useSelector((state) => state.pricing);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Handle click when user is not authenticated
  const handleUnauthenticatedClick = (action) => {
    setShowLoginPrompt(true);
    setShowReportMenu(false);
    setShowInvoiceMenu(false);
  };

  // Get estimates in selected currency and timeframe
  const getDisplayEstimates = () => {
    let displayEstimates = estimates;
    
    if (selectedTimeframe === 'yearly') {
      const yearlyEstimates = {};
      Object.keys(estimates).forEach(provider => {
        yearlyEstimates[provider] = {};
        Object.keys(estimates[provider]).forEach(service => {
          yearlyEstimates[provider][service] = estimates[provider][service] * 12;
        });
      });
      displayEstimates = yearlyEstimates;
    }
    
    if (selectedCurrency === 'INR') {
      return convertEstimatesToCurrency(displayEstimates, exchangeRate);
    }
    
    return displayEstimates;
  };

  const handleGenerateReport = async (reportType) => {
    // Check authentication first
    if (!isAuthenticated) {
      handleUnauthenticatedClick('report');
      return;
    }

    try {
      setIsGenerating(true);
      setShowReportMenu(false);
      
      const displayEstimates = getDisplayEstimates();
      
      if (reportType === 'comparison') {
        setGenerationStatus('Generating comparison report...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        generateCostReport(
          services,
          displayEstimates,
          selectedTimeframe,
          selectedCurrency,
          exchangeRate,
          selectedPlan,
          user
        );
        
        setGenerationStatus('Comparison report generated successfully!');
      } else {
        const providerName = PROVIDER_OPTIONS.find(p => p.value === reportType)?.shortName;
        setGenerationStatus(`Generating ${providerName} report...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        generateProviderReport(
          services,
          displayEstimates,
          reportType,
          selectedTimeframe,
          selectedCurrency,
          exchangeRate,
          selectedPlan,
          user
        );
        
        setGenerationStatus(`${providerName} report generated successfully!`);
      }
      
      setTimeout(() => setGenerationStatus(''), 3000);
      
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerationStatus('Error generating report. Please try again.');
      setTimeout(() => setGenerationStatus(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInvoice = async (provider) => {
    // Check authentication first
    if (!isAuthenticated) {
      handleUnauthenticatedClick('invoice');
      return;
    }

    try {
      setIsGenerating(true);
      setShowInvoiceMenu(false);
      setGenerationStatus(`Generating ${PROVIDER_OPTIONS.find(p => p.value === provider)?.shortName} invoice...`);
      
      const displayEstimates = getDisplayEstimates();
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      generateInvoice(
        services,
        displayEstimates,
        provider,
        selectedTimeframe,
        selectedCurrency,
        exchangeRate,
        selectedPlan,
        user
      );
      
      setGenerationStatus('Invoice generated successfully!');
      setTimeout(() => setGenerationStatus(''), 3000);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      setGenerationStatus('Error generating invoice. Please try again.');
      setTimeout(() => setGenerationStatus(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Login Prompt Modal
  const LoginPromptModal = () => (
    <AnimatePresence>
      {showLoginPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowLoginPrompt(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Login Required
                  </h3>
                  <p className="text-sm text-gray-600">
                    Authentication needed to generate reports and invoices
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why login is required:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Your contact information is included in reports</li>
                      <li>• Invoices contain your billing details</li>
                      <li>• Secure document generation with your data</li>
                      <li>• Track and manage your generated documents</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    // Note: In a real app, you might navigate to login page
                    // or trigger a login modal here
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Sign In to Continue</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Authentication Status Indicator */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <LockClosedIcon className="h-4 w-4" />
              <span className="font-medium">Login required for PDF generation</span>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Generate Report Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isAuthenticated) {
                  handleUnauthenticatedClick('report');
                } else {
                  setShowReportMenu(!showReportMenu);
                }
              }}
              disabled={isGenerating}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isAuthenticated 
                  ? 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white focus:ring-primary-500' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {!isAuthenticated && <LockClosedIcon className="h-5 w-5" />}
              <DocumentTextIcon className="h-5 w-5" />
              <span>Generate Report</span>
              <ChevronDownIcon className={`h-5 w-5 transition-transform ${showReportMenu ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Report Selection Dropdown - Only show if authenticated */}
            <AnimatePresence>
              {showReportMenu && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[250px]"
                >
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Select Report Type
                  </div>
                  {REPORT_OPTIONS.map((report) => (
                    <motion.button
                      key={report.value}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => handleGenerateReport(report.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">{report.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {report.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.description}
                        </div>
                      </div>
                      {isGenerating && generationStatus.includes(report.value === 'comparison' ? 'comparison' : PROVIDER_OPTIONS.find(p => p.value === report.value)?.shortName) && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate Invoice Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isAuthenticated) {
                  handleUnauthenticatedClick('invoice');
                } else {
                  setShowInvoiceMenu(!showInvoiceMenu);
                }
              }}
              disabled={isGenerating}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isAuthenticated 
                  ? 'bg-secondary-600 hover:bg-secondary-700 disabled:bg-secondary-400 text-white focus:ring-secondary-500' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {!isAuthenticated && <LockClosedIcon className="h-5 w-5" />}
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Generate Invoice</span>
              <ChevronDownIcon className={`h-5 w-5 transition-transform ${showInvoiceMenu ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Provider Selection Dropdown - Only show if authenticated */}
            <AnimatePresence>
              {showInvoiceMenu && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[200px]"
                >
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Select Provider
                  </div>
                  {PROVIDER_OPTIONS.map((provider) => (
                    <motion.button
                      key={provider.value}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => handleGenerateInvoice(provider.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center space-x-3"
                    >
                      <div className={`w-3 h-3 rounded-full ${provider.color}`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {provider.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          Generate invoice for {provider.shortName}
                        </div>
                      </div>
                      {isGenerating && generationStatus.includes(provider.shortName) && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Generation Status */}
        <AnimatePresence>
          {generationStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center space-x-2 text-sm"
            >
              {generationStatus.includes('successfully') ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : generationStatus.includes('Error') ? (
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              ) : (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              )}
              <span className={`${
                generationStatus.includes('successfully') 
                  ? 'text-green-700' 
                  : generationStatus.includes('Error') 
                    ? 'text-red-700' 
                    : 'text-gray-700'
              }`}>
                {generationStatus}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside handler for dropdowns */}
        {(showReportMenu || showInvoiceMenu) && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => {
              setShowReportMenu(false);
              setShowInvoiceMenu(false);
            }}
          />
        )}
      </motion.div>

      {/* Login Prompt Modal */}
      <LoginPromptModal />
    </>
  );
};

export default PDFActions; 