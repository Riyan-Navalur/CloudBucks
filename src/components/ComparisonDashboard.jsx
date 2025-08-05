import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setTimeframe, setComparisonView, setCurrency } from '../store/slices/pricingSlice';
import { convertEstimatesToCurrency } from '../utils/pricingCalculator';
import PricingCards from './dashboard/PricingCards';
import PricingChart from './dashboard/PricingChart';
import ServiceBreakdown from './dashboard/ServiceBreakdown';
import SLAComparison from './dashboard/SLAComparison';
import FreeUsageBanner from './dashboard/FreeUsageBanner';
import TimeframeToggle from './dashboard/TimeframeToggle';
import ViewToggle from './dashboard/ViewToggle';
import CurrencyToggle from './dashboard/CurrencyToggle';
import PDFActions from './dashboard/PDFActions';

const ComparisonDashboard = () => {
  const dispatch = useDispatch();
  const { 
    estimates, 
    selectedTimeframe, 
    selectedCurrency, 
    exchangeRate,
    selectedPlan,
    comparisonView, 
    isCalculating 
  } = useSelector((state) => state.pricing);

  const handleTimeframeChange = (timeframe) => {
    dispatch(setTimeframe(timeframe));
  };

  const handleViewChange = (view) => {
    dispatch(setComparisonView(view));
  };

  const handleCurrencyChange = (currency) => {
    dispatch(setCurrency(currency));
  };

  // Calculate yearly estimates and convert currency
  const getDisplayEstimates = () => {
    let displayEstimates = estimates;
    
    // Apply timeframe multiplier
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
    
    // Convert currency
    displayEstimates = convertEstimatesToCurrency(displayEstimates, selectedCurrency, exchangeRate);
    
    return displayEstimates;
  };

  const displayEstimates = getDisplayEstimates();

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Free Usage Banner */}
      <FreeUsageBanner />

      {/* Header with Controls */}
      <div className="card">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-secondary-600 rounded-full mr-3"></span>
                Cost Comparison
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real-time pricing estimates across AWS, Azure, and Google Cloud
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <TimeframeToggle
                  selected={selectedTimeframe}
                  onChange={handleTimeframeChange}
                />
                <CurrencyToggle
                  selected={selectedCurrency}
                  onChange={handleCurrencyChange}
                />
              </div>
              <ViewToggle
                selected={comparisonView}
                onChange={handleViewChange}
              />
            </div>
          </div>
          
          {/* Selected Plan Information */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Active Plan: {selectedPlan.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedPlan.description}
                  {selectedPlan.discount > 0 && (
                    <span className="text-green-600 font-medium ml-2">
                      ({selectedPlan.discount}% discount applied)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>
                  Instances: {selectedPlan.limits.maxInstances === Infinity ? 'Unlimited' : selectedPlan.limits.maxInstances}
                </span>
                <span>
                  Storage: {selectedPlan.limits.maxStorage === Infinity ? 'Unlimited' : `${selectedPlan.limits.maxStorage} GB`}
                </span>
                <span>
                  Bandwidth: {selectedPlan.limits.maxBandwidth === Infinity ? 'Unlimited' : `${selectedPlan.limits.maxBandwidth} GB`}
                </span>
              </div>
            </div>
          </div>
          
          {/* PDF Generation Actions */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Export & Share
                </h3>
                <p className="text-xs text-gray-500">
                  Generate professional reports and invoices in PDF format
                </p>
              </div>
              <PDFActions />
            </div>
          </div>
          
          {/* Exchange Rate Info for INR */}
          {selectedCurrency === 'INR' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
            >
              <span className="font-medium">Exchange Rate:</span>
              <span>1 USD = ₹{exchangeRate}</span>
              <span className="text-xs text-gray-500">
                (Approximate rate - prices may vary)
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isCalculating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Updating cost estimates...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Overview Cards */}
      {!isCalculating && (
        <PricingCards
          estimates={displayEstimates}
          timeframe={selectedTimeframe}
          currency={selectedCurrency}
          selectedPlan={selectedPlan}
        />
      )}

      {/* Chart or Table View */}
      {!isCalculating && comparisonView === 'chart' && (
        <PricingChart
          estimates={displayEstimates}
          timeframe={selectedTimeframe}
          currency={selectedCurrency}
          selectedPlan={selectedPlan}
        />
      )}

      {/* Service Breakdown */}
      {!isCalculating && (
        <ServiceBreakdown
          estimates={displayEstimates}
          timeframe={selectedTimeframe}
          currency={selectedCurrency}
          selectedPlan={selectedPlan}
        />
      )}

      {/* SLA Comparison */}
      {!isCalculating && (
        <SLAComparison />
      )}
    </motion.div>
  );
};

export default ComparisonDashboard; 