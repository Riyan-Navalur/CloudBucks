import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, getCurrencySymbol } from '../../utils/pricingCalculator';

const PROVIDER_COLORS = {
  aws: '#f97316',    // orange-500
  azure: '#3b82f6',  // blue-500
  gcp: '#22c55e'     // green-500
};

const SERVICE_COLORS = {
  compute: '#8b5cf6',         // violet-500
  storage: '#06b6d4',         // cyan-500
  bandwidth: '#f59e0b',       // amber-500
  database: '#ef4444',        // red-500
  disasterRecovery: '#84cc16', // lime-500
  sla: '#ec4899'              // pink-500
};

// Short labels for pie chart to prevent overlapping
const SERVICE_SHORT_NAMES = {
  compute: 'Compute',
  storage: 'Storage', 
  bandwidth: 'Bandwidth',
  database: 'Database',
  disasterRecovery: 'DR',
  sla: 'SLA'
};

const PricingChart = ({ estimates, timeframe, currency = 'USD' }) => {
  const currencySymbol = getCurrencySymbol(currency);
  
  // Prepare data for total cost comparison
  const totalCostData = Object.entries(estimates).map(([provider, costs]) => ({
    provider: provider.toUpperCase(),
    total: costs.total,
    compute: costs.compute,
    storage: costs.storage,
    bandwidth: costs.bandwidth,
    database: costs.database,
    disasterRecovery: costs.disasterRecovery,
    sla: costs.sla
  }));

  // Prepare data for service breakdown pie chart
  const serviceBreakdownData = Object.keys(estimates.aws).filter(key => key !== 'total').map(service => {
    const total = Object.values(estimates).reduce((sum, provider) => sum + provider[service], 0);
    return {
      name: SERVICE_SHORT_NAMES[service] || service.charAt(0).toUpperCase() + service.slice(1),
      fullName: service === 'sla' ? 'SLA & Support' : service.charAt(0).toUpperCase() + service.slice(1),
      value: total,
      color: SERVICE_COLORS[service]
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'sla' ? 'SLA & Support' : entry.dataKey}: {formatCurrency(entry.value, currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.payload.fullName}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value, currency)} ({((data.value / serviceBreakdownData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Format tick values for Y-axis based on currency
  const formatYAxisTick = (value) => {
    if (currency === 'INR') {
      // For INR, show abbreviated values for large numbers
      if (value >= 100000) {
        return `₹${(value / 100000).toFixed(0)}L`;
      }
      if (value >= 1000) {
        return `₹${(value / 1000).toFixed(0)}K`;
      }
      return `₹${value}`;
    }
    return `$${value}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Cost Comparison Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Total Cost Comparison ({currency})
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totalCostData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="provider" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Total Cost"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Service Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Service Cost Distribution ({currency})
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Stacked Bar Chart for Service Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card lg:col-span-2"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Service Breakdown by Provider ({currency})
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totalCostData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="provider" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                dataKey="compute" 
                stackId="a" 
                fill={SERVICE_COLORS.compute}
                name="Compute"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="storage" 
                stackId="a" 
                fill={SERVICE_COLORS.storage}
                name="Storage"
              />
              <Bar 
                dataKey="bandwidth" 
                stackId="a" 
                fill={SERVICE_COLORS.bandwidth}
                name="Bandwidth"
              />
              <Bar 
                dataKey="database" 
                stackId="a" 
                fill={SERVICE_COLORS.database}
                name="Database"
              />
              <Bar 
                dataKey="disasterRecovery" 
                stackId="a" 
                fill={SERVICE_COLORS.disasterRecovery}
                name="Disaster Recovery"
              />
              <Bar 
                dataKey="sla" 
                stackId="a" 
                fill={SERVICE_COLORS.sla}
                name="SLA & Support"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingChart; 