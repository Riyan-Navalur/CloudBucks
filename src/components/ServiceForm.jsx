import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  updateCompute,
  updateStorage,
  updateBandwidth,
  updateDatabase,
  updateDisasterRecovery,
  updateSLA,
  updatePlan,
  updateEstimates,
  setCalculating,
} from '../store/slices/pricingSlice';
import { calculateAllEstimates } from '../utils/pricingCalculator';
import ComputeForm from './forms/ComputeForm';
import StorageForm from './forms/StorageForm';
import BandwidthForm from './forms/BandwidthForm';
import DatabaseForm from './forms/DatabaseForm';
import DisasterRecoveryForm from './forms/DisasterRecoveryForm';
import SLAForm from './forms/SLAForm';
import PlanForm from './forms/PlanForm';

const ServiceForm = () => {
  const dispatch = useDispatch();
  const { services, selectedPlan, isCalculating } = useSelector((state) => state.pricing);

  // Calculate estimates when services or plan change
  useEffect(() => {
    const calculateEstimates = async () => {
      dispatch(setCalculating(true));
      
      // Simulate API delay for realistic UX
      setTimeout(() => {
        const estimates = calculateAllEstimates(services, selectedPlan);
        dispatch(updateEstimates(estimates));
        dispatch(setCalculating(false));
      }, 500);
    };

    calculateEstimates();
  }, [services, selectedPlan, dispatch]);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
          Service Configuration
        </h2>
        
        <div className="space-y-6">
          <PlanForm 
            selectedPlan={selectedPlan}
            updatePlan={(data) => dispatch(updatePlan(data))}
          />
          
          <ComputeForm 
            compute={services.compute}
            updateCompute={(data) => dispatch(updateCompute(data))}
            planLimits={selectedPlan.limits}
          />
          
          <StorageForm 
            storage={services.storage}
            updateStorage={(data) => dispatch(updateStorage(data))}
            planLimits={selectedPlan.limits}
          />
          
          <BandwidthForm 
            bandwidth={services.bandwidth}
            updateBandwidth={(data) => dispatch(updateBandwidth(data))}
            planLimits={selectedPlan.limits}
          />
          
          <DatabaseForm 
            database={services.database}
            updateDatabase={(data) => dispatch(updateDatabase(data))}
          />
          
          <DisasterRecoveryForm 
            disasterRecovery={services.disasterRecovery}
            updateDisasterRecovery={(data) => dispatch(updateDisasterRecovery(data))}
          />
          
          <SLAForm 
            sla={services.sla}
            updateSLA={(data) => dispatch(updateSLA(data))}
          />
        </div>

        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200"
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="text-primary-700 font-medium">
                Calculating estimates...
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceForm; 