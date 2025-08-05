// Simplified pricing data for cloud providers
// Note: These are approximate values for demo purposes
// In a real application, you would use official APIs or updated pricing data

const PRICING_DATA = {
  aws: {
    compute: {
      't3.micro': 0.0104,   // per hour
      't3.small': 0.0208,
      't3.medium': 0.0416,
      't3.large': 0.0832,
      't3.xlarge': 0.1664,
      'm5.large': 0.096,
      'm5.xlarge': 0.192,
      'c5.large': 0.085,
      'c5.xlarge': 0.17,
    },
    storage: {
      ssd: 0.10,  // per GB per month
      hdd: 0.045,
    },
    bandwidth: 0.09,  // per GB
    database: {
      mysql: {
        storage: 0.115,  // per GB per month
        instance: 0.017,  // per hour for db.t3.micro
      },
      postgresql: {
        storage: 0.115,
        instance: 0.017,
      },
    },
    disasterRecovery: {
      backup: 0.05,  // per GB per month
      replication: 1.5,  // multiplier
    },
    sla: {
      uptimeMultipliers: {
        '99.5': 1.0,   // Basic - no additional cost
        '99.9': 1.03,  // Standard - 3% premium
        '99.95': 1.08, // Premium - 8% premium
        '99.99': 1.15  // Enterprise - 15% premium
      },
      supportCosts: {
        basic: 0,        // Free
        developer: 29,   // AWS Developer Support
        business: 100,   // AWS Business Support (minimum)
        enterprise: 1000 // AWS Enterprise Support (estimated)
      }
    }
  },
  
  azure: {
    compute: {
      'B1s': 0.0104,   // Basic tier
      'B1ms': 0.0208,
      'B2s': 0.0416,
      'B2ms': 0.0832,
      'B4ms': 0.1664,
      'D2s_v3': 0.096,
      'D4s_v3': 0.192,
      'F2s_v2': 0.085,
      'F4s_v2': 0.17,
    },
    storage: {
      ssd: 0.12,
      hdd: 0.04,
    },
    bandwidth: 0.087,
    database: {
      mysql: {
        storage: 0.12,
        instance: 0.018,
      },
      postgresql: {
        storage: 0.12,
        instance: 0.018,
      },
    },
    disasterRecovery: {
      backup: 0.055,
      replication: 1.4,
    },
    sla: {
      uptimeMultipliers: {
        '99.5': 1.0,   // Basic - no additional cost
        '99.9': 1.05,  // Standard - 5% premium
        '99.95': 1.12, // Premium - 12% premium
        '99.99': 1.20  // Enterprise - 20% premium
      },
      supportCosts: {
        basic: 0,        // Free
        developer: 100,  // Azure Standard Support
        business: 1000,  // Azure Professional Direct
        enterprise: 2000 // Azure Premier Support (estimated)
      }
    }
  },
  
  gcp: {
    compute: {
      'e2-micro': 0.00838,
      'e2-small': 0.01675,
      'e2-medium': 0.03351,
      'e2-standard-2': 0.067,
      'e2-standard-4': 0.134,
      'n1-standard-1': 0.0475,
      'n1-standard-2': 0.095,
      'n2-standard-2': 0.097,
      'n2-standard-4': 0.194,
    },
    storage: {
      ssd: 0.17,
      hdd: 0.04,
    },
    bandwidth: 0.085,
    database: {
      mysql: {
        storage: 0.09,
        instance: 0.015,
      },
      postgresql: {
        storage: 0.09,
        instance: 0.015,
      },
    },
    disasterRecovery: {
      backup: 0.026,
      replication: 1.3,
    },
    sla: {
      uptimeMultipliers: {
        '99.5': 1.0,   // Basic - no additional cost
        '99.9': 1.02,  // Standard - 2% premium (GCP competitive)
        '99.95': 1.08, // Premium - 8% premium
        '99.99': 1.15  // Enterprise - 15% premium
      },
      supportCosts: {
        basic: 0,        // Free
        developer: 100,  // GCP Standard Support
        business: 500,   // GCP Enhanced Support
        enterprise: 1500 // GCP Premium Support (estimated)
      }
    }
  }
};

// Mapping for instance type equivalents across providers
const INSTANCE_MAPPING = {
  aws: {
    't3.micro': ['B1s', 'e2-micro'],
    't3.small': ['B1ms', 'e2-small'],
    't3.medium': ['B2s', 'e2-medium'],
    't3.large': ['B2ms', 'e2-standard-2'],
    't3.xlarge': ['B4ms', 'e2-standard-4'],
    'm5.large': ['D2s_v3', 'n1-standard-1'],
    'm5.xlarge': ['D4s_v3', 'n1-standard-2'],
    'c5.large': ['F2s_v2', 'n2-standard-2'],
    'c5.xlarge': ['F4s_v2', 'n2-standard-4'],
  }
};

export const calculateAWSPricing = (services) => {
  const pricing = PRICING_DATA.aws;
  
  // Compute costs
  const computeHourlyRate = pricing.compute[services.compute.type] || 0;
  const computeCost = computeHourlyRate * services.compute.hours * services.compute.instances;
  
  // Storage costs
  const storageCost = services.storage.amount * pricing.storage[services.storage.type];
  
  // Bandwidth costs
  const bandwidthCost = services.bandwidth.amount * pricing.bandwidth;
  
  // Database costs
  const dbStorageCost = services.database.storage * pricing.database[services.database.type].storage;
  const dbInstanceCost = pricing.database[services.database.type].instance * 744 * services.database.instances; // 744 hours per month
  const databaseCost = dbStorageCost + dbInstanceCost;
  
  // Disaster recovery costs
  let disasterRecoveryCost = 0;
  if (services.disasterRecovery.enabled) {
    const backupCost = (services.storage.amount + services.database.storage) * pricing.disasterRecovery.backup;
    const replicationCost = computeCost * (pricing.disasterRecovery.replication - 1);
    disasterRecoveryCost = backupCost + replicationCost;
  }
  
  // SLA costs
  const uptimeMultiplier = pricing.sla.uptimeMultipliers[services.sla.uptime] || 1.0;
  const supportCost = pricing.sla.supportCosts[services.sla.supportLevel] || 0;
  
  // Apply SLA uptime multiplier to core services (compute, storage, database)
  const coreServicesCost = computeCost + storageCost + databaseCost;
  const slaUptimeCost = coreServicesCost * (uptimeMultiplier - 1.0);
  const slaCost = slaUptimeCost + supportCost;
  
  const total = computeCost + storageCost + bandwidthCost + databaseCost + disasterRecoveryCost + slaCost;
  
  return {
    compute: Math.round(computeCost * 100) / 100,
    storage: Math.round(storageCost * 100) / 100,
    bandwidth: Math.round(bandwidthCost * 100) / 100,
    database: Math.round(databaseCost * 100) / 100,
    disasterRecovery: Math.round(disasterRecoveryCost * 100) / 100,
    sla: Math.round(slaCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const calculateAzurePricing = (services) => {
  const pricing = PRICING_DATA.azure;
  
  // Map AWS instance type to Azure equivalent
  const awsType = services.compute.type;
  const azureType = INSTANCE_MAPPING.aws[awsType] ? INSTANCE_MAPPING.aws[awsType][0] : 'B2s';
  
  const computeHourlyRate = pricing.compute[azureType] || 0;
  const computeCost = computeHourlyRate * services.compute.hours * services.compute.instances;
  
  const storageCost = services.storage.amount * pricing.storage[services.storage.type];
  const bandwidthCost = services.bandwidth.amount * pricing.bandwidth;
  
  const dbStorageCost = services.database.storage * pricing.database[services.database.type].storage;
  const dbInstanceCost = pricing.database[services.database.type].instance * 744 * services.database.instances;
  const databaseCost = dbStorageCost + dbInstanceCost;
  
  let disasterRecoveryCost = 0;
  if (services.disasterRecovery.enabled) {
    const backupCost = (services.storage.amount + services.database.storage) * pricing.disasterRecovery.backup;
    const replicationCost = computeCost * (pricing.disasterRecovery.replication - 1);
    disasterRecoveryCost = backupCost + replicationCost;
  }
  
  // SLA costs
  const uptimeMultiplier = pricing.sla.uptimeMultipliers[services.sla.uptime] || 1.0;
  const supportCost = pricing.sla.supportCosts[services.sla.supportLevel] || 0;
  
  const coreServicesCost = computeCost + storageCost + databaseCost;
  const slaUptimeCost = coreServicesCost * (uptimeMultiplier - 1.0);
  const slaCost = slaUptimeCost + supportCost;
  
  const total = computeCost + storageCost + bandwidthCost + databaseCost + disasterRecoveryCost + slaCost;
  
  return {
    compute: Math.round(computeCost * 100) / 100,
    storage: Math.round(storageCost * 100) / 100,
    bandwidth: Math.round(bandwidthCost * 100) / 100,
    database: Math.round(databaseCost * 100) / 100,
    disasterRecovery: Math.round(disasterRecoveryCost * 100) / 100,
    sla: Math.round(slaCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const calculateGCPPricing = (services) => {
  const pricing = PRICING_DATA.gcp;
  
  // Map AWS instance type to GCP equivalent
  const awsType = services.compute.type;
  const gcpType = INSTANCE_MAPPING.aws[awsType] ? INSTANCE_MAPPING.aws[awsType][1] : 'e2-medium';
  
  const computeHourlyRate = pricing.compute[gcpType] || 0;
  const computeCost = computeHourlyRate * services.compute.hours * services.compute.instances;
  
  const storageCost = services.storage.amount * pricing.storage[services.storage.type];
  const bandwidthCost = services.bandwidth.amount * pricing.bandwidth;
  
  const dbStorageCost = services.database.storage * pricing.database[services.database.type].storage;
  const dbInstanceCost = pricing.database[services.database.type].instance * 744 * services.database.instances;
  const databaseCost = dbStorageCost + dbInstanceCost;
  
  let disasterRecoveryCost = 0;
  if (services.disasterRecovery.enabled) {
    const backupCost = (services.storage.amount + services.database.storage) * pricing.disasterRecovery.backup;
    const replicationCost = computeCost * (pricing.disasterRecovery.replication - 1);
    disasterRecoveryCost = backupCost + replicationCost;
  }
  
  // SLA costs
  const uptimeMultiplier = pricing.sla.uptimeMultipliers[services.sla.uptime] || 1.0;
  const supportCost = pricing.sla.supportCosts[services.sla.supportLevel] || 0;
  
  const coreServicesCost = computeCost + storageCost + databaseCost;
  const slaUptimeCost = coreServicesCost * (uptimeMultiplier - 1.0);
  const slaCost = slaUptimeCost + supportCost;
  
  const total = computeCost + storageCost + bandwidthCost + databaseCost + disasterRecoveryCost + slaCost;
  
  return {
    compute: Math.round(computeCost * 100) / 100,
    storage: Math.round(storageCost * 100) / 100,
    bandwidth: Math.round(bandwidthCost * 100) / 100,
    database: Math.round(databaseCost * 100) / 100,
    disasterRecovery: Math.round(disasterRecoveryCost * 100) / 100,
    sla: Math.round(slaCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const calculateAllEstimates = (services, selectedPlan = null) => {
  const baseEstimates = {
    aws: calculateAWSPricing(services),
    azure: calculateAzurePricing(services),
    gcp: calculateGCPPricing(services),
  };

  // Apply plan discount if a plan is selected
  if (selectedPlan && selectedPlan.discount > 0) {
    const discountMultiplier = (100 - selectedPlan.discount) / 100;
    
    Object.keys(baseEstimates).forEach(provider => {
      const providerEstimate = baseEstimates[provider];
      Object.keys(providerEstimate).forEach(service => {
        if (service !== 'total') {
          providerEstimate[service] = Math.round(providerEstimate[service] * discountMultiplier * 100) / 100;
        }
      });
      
      // Recalculate total
      providerEstimate.total = Math.round(
        (providerEstimate.compute + 
         providerEstimate.storage + 
         providerEstimate.bandwidth + 
         providerEstimate.database + 
         providerEstimate.disasterRecovery + 
         providerEstimate.sla) * 100
      ) / 100;
    });
  }

  return baseEstimates;
};

// Utility function to validate service limits against plan
export const validateServiceLimits = (services, planLimits) => {
  const warnings = [];
  
  if (planLimits) {
    if (services.compute.instances > planLimits.maxInstances) {
      warnings.push(`Compute instances (${services.compute.instances}) exceed plan limit (${planLimits.maxInstances})`);
    }
    
    if (services.storage.amount > planLimits.maxStorage) {
      warnings.push(`Storage amount (${services.storage.amount} GB) exceeds plan limit (${planLimits.maxStorage} GB)`);
    }
    
    if (services.bandwidth.amount > planLimits.maxBandwidth) {
      warnings.push(`Bandwidth amount (${services.bandwidth.amount} GB) exceeds plan limit (${planLimits.maxBandwidth} GB)`);
    }
  }
  
  return warnings;
};

// Utility function to get plan-adjusted pricing
export const getPlanAdjustedPrice = (basePrice, selectedPlan) => {
  if (!selectedPlan || selectedPlan.discount === 0) {
    return basePrice;
  }
  
  const discountMultiplier = (100 - selectedPlan.discount) / 100;
  return Math.round(basePrice * discountMultiplier * 100) / 100;
};

// Utility function to get the cheapest provider
export const getCheapestProvider = (estimates) => {
  const providers = Object.entries(estimates);
  return providers.reduce((cheapest, [provider, costs]) => {
    return costs.total < cheapest.total ? { provider, total: costs.total } : cheapest;
  }, { provider: providers[0][0], total: providers[0][1].total });
};

// Currency conversion utility
export const convertCurrency = (amount, currency, exchangeRate) => {
  if (currency === 'INR') {
    return amount * exchangeRate;
  }
  return amount; // USD is base currency
};

// Convert all estimates to selected currency
export const convertEstimatesToCurrency = (estimates, currency, exchangeRate) => {
  if (currency === 'USD') {
    return estimates;
  }
  
  const convertedEstimates = {};
  Object.keys(estimates).forEach(provider => {
    convertedEstimates[provider] = {};
    Object.keys(estimates[provider]).forEach(service => {
      convertedEstimates[provider][service] = convertCurrency(
        estimates[provider][service], 
        currency, 
        exchangeRate
      );
    });
  });
  
  return convertedEstimates;
};

// Utility function to format currency based on selected currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get currency symbol
export const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    INR: '₹'
  };
  return symbols[currency] || '$';
};

// Get currency name
export const getCurrencyName = (currency) => {
  const names = {
    USD: 'US Dollar',
    INR: 'Indian Rupee'
  };
  return names[currency] || 'US Dollar';
}; 