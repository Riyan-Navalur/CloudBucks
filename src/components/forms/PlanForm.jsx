import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const PLAN_OPTIONS = [
  {
    tier: 'basic',
    name: 'Basic',
    offer: 'Free',
    icon: StarIcon,
    description: 'Perfect for small projects and learning',
    features: [
      'Up to 5 compute instances',
      'Up to 1TB storage',
      'Up to 5TB bandwidth',
      'Basic support',
      'Community access',
      'Standard SLA (99.9%)'
    ],
    discount: 0,
    limits: {
      maxInstances: 5,
      maxStorage: 1000,
      maxBandwidth: 5000,
    },
    color: 'bg-gray-50 border-gray-300',
    selectedColor: 'bg-primary-600 border-primary-600',
    iconColor: 'text-gray-600',
    selectedIconColor: 'text-white',
    offerColor: 'text-gray-700',
    selectedOfferColor: 'text-primary-100',
    textColor: 'text-gray-900',
    selectedTextColor: 'text-white'
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    offer: '15% Off',
    icon: BuildingOfficeIcon,
    description: 'Comprehensive solution for businesses',
    features: [
      'Unlimited compute instances',
      'Unlimited storage',
      'Unlimited bandwidth',
      '24/7 priority support',
      'Dedicated account manager',
      'Premium SLA (99.99%)',
      'Advanced security features',
      '15% discount on all services'
    ],
    discount: 15,
    limits: {
      maxInstances: Infinity,
      maxStorage: Infinity,
      maxBandwidth: Infinity,
    },
    color: 'bg-blue-50 border-blue-300',
    selectedColor: 'bg-blue-600 border-blue-600',
    iconColor: 'text-blue-600',
    selectedIconColor: 'text-white',
    offerColor: 'text-blue-700',
    selectedOfferColor: 'text-blue-100',
    textColor: 'text-gray-900',
    selectedTextColor: 'text-white',
    popular: true
  },
  {
    tier: 'student',
    name: 'Student',
    offer: '50% Off',
    icon: AcademicCapIcon,
    description: 'Special pricing for students and educators',
    features: [
      'Up to 3 compute instances',
      'Up to 500GB storage',
      'Up to 2TB bandwidth',
      'Educational support',
      'Learning resources',
      'Standard SLA (99.9%)',
      '50% discount on all services',
      'Valid student ID required'
    ],
    discount: 50,
    limits: {
      maxInstances: 3,
      maxStorage: 500,
      maxBandwidth: 2000,
    },
    color: 'bg-green-50 border-green-300',
    selectedColor: 'bg-green-600 border-green-600',
    iconColor: 'text-green-600',
    selectedIconColor: 'text-white',
    offerColor: 'text-green-700',
    selectedOfferColor: 'text-green-100',
    textColor: 'text-gray-900',
    selectedTextColor: 'text-white'
  }
];

const PlanForm = ({ selectedPlan, updatePlan }) => {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handlePlanChange = (plan) => {
    updatePlan({
      tier: plan.tier,
      name: plan.name + ' Plan',
      description: plan.description,
      features: plan.features,
      discount: plan.discount,
      limits: plan.limits
    });
  };

  const handleMouseEnter = (plan, event) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate position relative to the container
    const x = rect.left + rect.width / 2;
    const y = rect.bottom + 8; // 8px below the card
    
    setPopupPosition({ x, y });
    setHoveredPlan(plan);
  };

  const handleMouseLeave = () => {
    // Add a small delay before hiding to allow moving to popup
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isPopupHovered) {
        setHoveredPlan(null);
      }
    }, 100);
  };

  const handlePopupMouseEnter = () => {
    setIsPopupHovered(true);
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handlePopupMouseLeave = () => {
    setIsPopupHovered(false);
    setHoveredPlan(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
      ref={containerRef}
    >
      <div className="flex items-center space-x-2 mb-4">
        <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Service Plan</h3>
        <InformationCircleIcon className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-gray-500">Hover for details</span>
      </div>

      {/* Compact Plan Selection */}
      <div className="relative overflow-visible">
        {/* Add extra padding top for popular badge */}
        <div className="pt-8 pb-2">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {PLAN_OPTIONS.map((plan, index) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan.tier === plan.tier;
              
              return (
                <div key={plan.tier} className="relative flex-1 min-w-0">
                  {/* Popular badge with proper margin */}
                  {plan.popular && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <motion.label
                    className="cursor-pointer block relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={(e) => handleMouseEnter(plan, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.tier}
                      checked={isSelected}
                      onChange={() => handlePlanChange(plan)}
                      className="sr-only"
                    />
                    
                    <div className={`p-2 rounded-lg border-2 transition-all h-full min-h-[95px] flex flex-col justify-between ${
                      isSelected ? plan.selectedColor : plan.color
                    } hover:shadow-md`}>
                      {/* Plan Header - simple layout without check mark */}
                      <div className="flex items-center space-x-1.5 mb-1.5">
                        <Icon className={`h-3.5 w-3.5 ${isSelected ? plan.selectedIconColor : plan.iconColor} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <span className={`font-semibold text-sm leading-tight block ${
                            isSelected ? plan.selectedTextColor : plan.textColor
                          }`}>
                            {plan.name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Plan Offer */}
                      <div className={`text-sm font-medium mb-1 ${
                        isSelected ? plan.selectedOfferColor : plan.offerColor
                      }`}>
                        {plan.offer}
                      </div>
                      
                      {/* Subtle indicator for limits */}
                      <div className={`text-xs leading-tight ${
                        isSelected ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        {plan.limits.maxInstances === Infinity ? 'Unlimited resources' : 
                         `Up to ${plan.limits.maxInstances} instances`}
                      </div>
                    </div>
                  </motion.label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Hover Popup */}
        <AnimatePresence>
          {hoveredPlan && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 pointer-events-auto"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                transform: 'translateX(-50%)',
                width: '320px',
                maxWidth: '90vw',
                maxHeight: '400px'
              }}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
            >
              {/* Popup Header */}
              <div className="flex items-center space-x-2 mb-3">
                <hoveredPlan.icon className={`h-5 w-5 ${hoveredPlan.iconColor}`} />
                <div>
                  <h4 className="font-semibold text-gray-900">{hoveredPlan.name} Plan</h4>
                  <p className={`text-sm font-medium ${hoveredPlan.offerColor}`}>{hoveredPlan.offer}</p>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{hoveredPlan.description}</p>
              
              {/* Scrollable Content Container */}
              <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                {/* Features */}
                <div className="mb-3">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
                    Features:
                  </h5>
                  <ul className="space-y-1">
                    {hoveredPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-xs text-gray-600">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Resource Limits */}
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Resource Limits:</h5>
                  <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Instances:</span>
                      <span>{hoveredPlan.limits.maxInstances === Infinity ? 'Unlimited' : hoveredPlan.limits.maxInstances}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Storage:</span>
                      <span>{hoveredPlan.limits.maxStorage === Infinity ? 'Unlimited' : `${hoveredPlan.limits.maxStorage} GB`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Bandwidth:</span>
                      <span>{hoveredPlan.limits.maxBandwidth === Infinity ? 'Unlimited' : `${hoveredPlan.limits.maxBandwidth} GB`}</span>
                    </div>
                  </div>
                </div>
                
                {/* Discount highlight */}
                {hoveredPlan.discount > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      💰 Save {hoveredPlan.discount}% on all services!
                    </p>
                  </div>
                )}
              </div>

              {/* Fixed bottom instruction */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  📜 Scroll within popup for more details
                </p>
              </div>

              {/* Small arrow pointing to the card */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Plan Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900">{selectedPlan.name}</h4>
            <p className="text-sm text-gray-600">{selectedPlan.description}</p>
          </div>
          {selectedPlan.discount > 0 && (
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-green-600 font-semibold">{selectedPlan.discount}% OFF</p>
              <p className="text-xs text-green-600">All services</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanForm; 