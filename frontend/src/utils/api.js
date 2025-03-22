// src/utils/api.js
import axios from 'axios';
import marketplaceData from './marketplace-data';
import nodeData from './node-data';

// Base API configuration - will be used in the future when backend is available
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.REACT_APP_API_KEY || 'SuperSecretApiKey',
  },
});

// Simulated API responses using imported JSON data
const simulateApiCall = (response, delay = 600) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: response });
    }, delay);
  });
};

// Marketplace API
export const marketplaceApi = {
  // Get all marketplace items
  getAll: () => simulateApiCall(marketplaceData.items),
  
  // Get featured marketplace items
  getFeatured: () => simulateApiCall(marketplaceData.featured),
  
  // Get owned marketplace items
  getOwned: () => simulateApiCall(marketplaceData.owned),
  
  // Get a specific item by ID
  getItem: (id) => {
    const item = marketplaceData.items.find(item => item.id === id);
    return simulateApiCall(item || null);
  },

  
  
  // Search marketplace items
  searchItems: (query) => {
    const lowercaseQuery = query.toLowerCase();
    const results = marketplaceData.items.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
    return simulateApiCall(results);
  },
  
  // Install a marketplace item
  installItem: (id) => {
    return simulateApiCall({ success: true, message: "Item installed successfully" }, 1200);
  },
  
  // Uninstall a marketplace item
  uninstallItem: (id) => {
    return simulateApiCall({ success: true, message: "Item uninstalled successfully" }, 1200);
  },
  
  // Get marketplace categories
  getCategories: () => simulateApiCall(marketplaceData.categories),
};

export const nodeApi = {
  // Get all available node types
  getNodeTypes: () => simulateApiCall(nodeData.nodeTypes),

  getNodeCategories: () => simulateApiCall(nodeData.categories),
};

export default api;