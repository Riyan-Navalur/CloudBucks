import { createSlice } from '@reduxjs/toolkit';

// Initial state for the pricing calculator
const initialState = {
  // Service selections
  services: {
    compute: {
      instances: 1,
      type: 't3.medium', // Default instance type
      hours: 744, // Hours per month (24 * 31)
      region: 'us-east-1',
    },
    storage: {
      type: 'ssd',
      amount: 100, // GB
    },
    bandwidth: {
      amount: 500, // GB
    },
    database: {
      type: 'mysql',
      storage: 20, // GB
      instances: 1,
    },
    disasterRecovery: {
      enabled: false,
      backupFrequency: 'daily',
    },
    sla: {
      uptime: '99.9', // Percentage uptime requirement
      tier: 'standard', // basic, standard, premium, enterprise
      supportLevel: 'basic', // basic, developer, business, enterprise
    }
  },
  
  // Plan selection
  selectedPlan: {
    tier: 'basic', // basic, enterprise, student
    name: 'Basic Plan',
    description: 'Perfect for small projects and learning',
    features: ['Basic support', 'Standard resources', 'Community access'],
    discount: 0, // No discount for basic
    limits: {
      maxInstances: 5,
      maxStorage: 1000, // GB
      maxBandwidth: 5000, // GB
    }
  },
  
  // Calculated estimates
  estimates: {
    aws: {
      compute: 0,
      storage: 0,
      bandwidth: 0,
      database: 0,
      disasterRecovery: 0,
      sla: 0,
      total: 0,
    },
    azure: {
      compute: 0,
      storage: 0,
      bandwidth: 0,
      database: 0,
      disasterRecovery: 0,
      sla: 0,
      total: 0,
    },
    gcp: {
      compute: 0,
      storage: 0,
      bandwidth: 0,
      database: 0,
      disasterRecovery: 0,
      sla: 0,
      total: 0,
    }
  },
  
  // UI state
  selectedTimeframe: 'monthly', // monthly or yearly
  selectedCurrency: 'USD', // USD or INR
  comparisonView: 'chart', // chart or table
  isCalculating: false,
  lastUpdated: null,
  
  // Exchange rate (USD to INR) - in real app, this would come from an API
  exchangeRate: 83.25, // Approximate rate as of 2024
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    // Update service configurations
    updateCompute: (state, action) => {
      state.services.compute = { ...state.services.compute, ...action.payload };
    },
    
    updateStorage: (state, action) => {
      state.services.storage = { ...state.services.storage, ...action.payload };
    },
    
    updateBandwidth: (state, action) => {
      state.services.bandwidth = { ...state.services.bandwidth, ...action.payload };
    },
    
    updateDatabase: (state, action) => {
      state.services.database = { ...state.services.database, ...action.payload };
    },
    
    updateDisasterRecovery: (state, action) => {
      state.services.disasterRecovery = { ...state.services.disasterRecovery, ...action.payload };
    },
    
    updateSLA: (state, action) => {
      state.services.sla = { ...state.services.sla, ...action.payload };
    },
    
    // Update plan selection
    updatePlan: (state, action) => {
      state.selectedPlan = { ...state.selectedPlan, ...action.payload };
    },
    
    // Update estimates
    updateEstimates: (state, action) => {
      state.estimates = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // UI state updates
    setTimeframe: (state, action) => {
      state.selectedTimeframe = action.payload;
    },
    
    setCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    
    setComparisonView: (state, action) => {
      state.comparisonView = action.payload;
    },
    
    setCalculating: (state, action) => {
      state.isCalculating = action.payload;
    },
    
    updateExchangeRate: (state, action) => {
      state.exchangeRate = action.payload;
    },
    
    // Reset all services to default
    resetServices: (state) => {
      state.services = initialState.services;
      state.estimates = initialState.estimates;
    },
    
    // Load saved configuration
    loadConfiguration: (state, action) => {
      state.services = action.payload.services;
      state.estimates = action.payload.estimates || initialState.estimates;
    }
  },
});

export const {
  updateCompute,
  updateStorage,
  updateBandwidth,
  updateDatabase,
  updateDisasterRecovery,
  updateSLA,
  updatePlan,
  updateEstimates,
  setTimeframe,
  setCurrency,
  setComparisonView,
  setCalculating,
  updateExchangeRate,
  resetServices,
  loadConfiguration,
} = pricingSlice.actions;

export default pricingSlice.reducer; 