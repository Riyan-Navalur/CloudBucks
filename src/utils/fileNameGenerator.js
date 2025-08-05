/**
 * Utility functions for generating safe, professional file names for PDF downloads
 */

import { formatCustomerName } from './nameFormatter';

/**
 * Creates a safe file name string by removing/replacing invalid characters
 * @param {string} str - The string to make file-safe
 * @returns {string} - Safe file name string
 */
const makeSafeFileName = (str) => {
  if (!str || typeof str !== 'string') return 'Document';
  
  return str
    .trim()
    .replace(/[<>:"/\\|?*]/g, '') // Remove Windows/Unix invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[.,;]/g, '') // Remove punctuation
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
    || 'Document';
};

/**
 * Formats the current date for file names
 * @returns {string} - Date in YYYY-MM-DD format
 */
const getDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Gets customer prefix for file names
 * @param {Object} user - The user object from Supabase
 * @returns {string} - Safe customer prefix
 */
const getCustomerPrefix = (user) => {
  if (!user) return 'Guest';
  
  const nameInfo = formatCustomerName(user);
  
  // If we have a real name, use it
  if (nameInfo.hasRealName) {
    return makeSafeFileName(nameInfo.full);
  }
  
  // If we have initials, use them with last 4 of customer ID
  if (nameInfo.initials && nameInfo.initials !== 'C') {
    const shortId = user.id?.slice(-4)?.toUpperCase() || '0000';
    return `${nameInfo.initials}-${shortId}`;
  }
  
  // Fallback to email username or customer ID
  if (user.email) {
    const emailPrefix = user.email.split('@')[0];
    return makeSafeFileName(emailPrefix);
  }
  
  return `Customer-${user.id?.slice(-4)?.toUpperCase() || '0000'}`;
};

/**
 * Generates a professional file name for cost comparison reports
 * @param {Object} user - The user object from Supabase
 * @param {string} selectedTimeframe - Monthly or yearly
 * @param {string} selectedCurrency - USD or INR
 * @returns {string} - Professional file name
 */
export const generateCostReportFileName = (user, selectedTimeframe, selectedCurrency) => {
  const customerPrefix = getCustomerPrefix(user);
  const dateString = getDateString();
  
  return `${customerPrefix}_CloudBucks-Cost-Report_${selectedTimeframe}_${selectedCurrency}_${dateString}.pdf`;
};

/**
 * Generates a professional file name for individual provider reports
 * @param {Object} user - The user object from Supabase
 * @param {string} selectedProvider - AWS, Azure, or GCP
 * @param {string} selectedTimeframe - Monthly or yearly
 * @param {string} selectedCurrency - USD or INR
 * @returns {string} - Professional file name
 */
export const generateProviderReportFileName = (user, selectedProvider, selectedTimeframe, selectedCurrency) => {
  const customerPrefix = getCustomerPrefix(user);
  const dateString = getDateString();
  
  return `${customerPrefix}_${selectedProvider}-Report_${selectedTimeframe}_${selectedCurrency}_${dateString}.pdf`;
};

/**
 * Generates a professional file name for invoices
 * @param {Object} user - The user object from Supabase
 * @param {string} selectedProvider - AWS, Azure, or GCP
 * @param {string} selectedTimeframe - Monthly or yearly
 * @param {string} selectedCurrency - USD or INR
 * @returns {string} - Professional file name
 */
export const generateInvoiceFileName = (user, selectedProvider, selectedTimeframe, selectedCurrency) => {
  const customerPrefix = getCustomerPrefix(user);
  const dateString = getDateString();
  
  return `${customerPrefix}_${selectedProvider}-Invoice_${selectedTimeframe}_${selectedCurrency}_${dateString}.pdf`;
};

/**
 * Generates file name examples for user preview
 * @param {Object} user - The user object from Supabase
 * @returns {Object} - Example file names
 */
export const getFileNameExamples = (user) => {
  const customerPrefix = getCustomerPrefix(user);
  const dateString = getDateString();
  
  return {
    costReport: `${customerPrefix}_CloudBucks-Cost-Report_Monthly_USD_${dateString}.pdf`,
    providerReport: `${customerPrefix}_AWS-Report_Yearly_INR_${dateString}.pdf`,
    invoice: `${customerPrefix}_Azure-Invoice_Monthly_USD_${dateString}.pdf`,
    customerPrefix
  };
};

export default {
  generateCostReportFileName,
  generateProviderReportFileName,
  generateInvoiceFileName,
  getFileNameExamples,
  makeSafeFileName,
  getCustomerPrefix
}; 