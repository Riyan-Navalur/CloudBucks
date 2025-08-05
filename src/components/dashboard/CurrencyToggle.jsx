import React from 'react';
import { motion } from 'framer-motion';
import { getCurrencySymbol } from '../../utils/pricingCalculator';

const CurrencyToggle = ({ selected, onChange }) => {
  const currencies = [
    { value: 'USD', label: 'USD', symbol: '$', name: 'US Dollar' },
    { value: 'INR', label: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {currencies.map((currency) => (
        <button
          key={currency.value}
          onClick={() => onChange(currency.value)}
          className={`relative flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            selected === currency.value
              ? 'text-primary-700 bg-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title={currency.name}
        >
          {selected === currency.value && (
            <motion.div
              layoutId="currency-bg"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              style={{ zIndex: -1 }}
            />
          )}
          <span className="text-base">{currency.symbol}</span>
          <span>{currency.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CurrencyToggle; 