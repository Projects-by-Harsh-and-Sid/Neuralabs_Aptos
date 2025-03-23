// src/utils/access-api.js - to be added to your existing api.js
import axios from 'axios';

// Simulate API call for development
const simulateApiCall = (response, delay = 600) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: response });
    }, delay);
  });
};

// Access Management API
export const accessManagementApi = {
  // Get all access levels
  getAccessLevels: () => simulateApiCall({
    levels: [
      { id: 6, name: "Access Level 6", flows: ["item-1", "item-2", "item-3", "item-4"] },
      { id: 5, name: "Access Level 5", flows: ["item-5", "item-6"] },
      { id: 4, name: "Access Level 4", flows: ["item-7"] },
      { id: 3, name: "Access Level 3", flows: ["item-8"] },
      { id: 2, name: "Access Level 2", flows: ["item-9"] },
      { id: 1, name: "Access Level 1", flows: [] },
      { id: 0, name: "Flows Under Development", flows: [] }
    ]
  }),
  
  // Get all flows
  getAllFlows: () => simulateApiCall([
    {
      id: 'item-1',
      name: 'Data Cleaner Pro',
      description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
      icon: 'A',
      accessLevel: 6
    },
    {
      id: 'item-2',
      name: 'Data Cleaner Pro',
      description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
      icon: 'A',
      accessLevel: 6
    },
    {
      id: 'item-3',
      name: 'Data Cleaner Pro',
      description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
      icon: 'A',
      accessLevel: 6
    },
    {
      id: 'item-4',
      name: 'Data Cleaner Pro',
      description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
      icon: 'A',
      accessLevel: 6
    },
    {
      id: 'item-5',
      name: 'Gaussian Integral',
      description: 'Advanced mathematical analysis tool for complex calculations.',
      icon: 'G',
      accessLevel: 5
    },
    {
      id: 'item-6',
      name: 'SQL Connector',
      description: 'Connect to and query SQL databases directly.',
      icon: 'S',
      accessLevel: 5
    },
    {
      id: 'item-7',
      name: 'Neural Network',
      description: 'Build and train neural networks with a simple interface.',
      icon: 'N',
      accessLevel: 4
    },
    {
      id: 'item-8',
      name: 'Feature Extractor',
      description: 'Extract features from text, images, and more.',
      icon: 'F',
      accessLevel: 3
    },
    {
      id: 'item-9',
      name: 'Data Visualizer',
      description: 'Create beautiful visualizations of your data.',
      icon: 'D',
      accessLevel: 2
    }
  ]),
  
  // Get details about a specific flow's access
  getFlowAccess: (flowId) => simulateApiCall({
    id: flowId,
    name: "Data Cleaner Pro",
    creationDate: "2025-02-10",
    owner: "John Doe",
    coOwner: "Jane Smith",
    accessLevel: 6,
    usersWithAccess: 15,
    addresses: [
      { address: "0x43AD...6612", level: 6 },
      { address: "0xcb6d...2912", level: 6 },
      { address: "0x87FE...1234", level: 5 },
      { address: "0x34AB...9876", level: 4 }
    ]
  }),
  
  // Update access for a flow
  updateFlowAccess: (flowId, data) => simulateApiCall({ 
    success: true, 
    message: "Access updated successfully" 
  }, 1000),
  
  // Add a new address to a flow
  addAddressToFlow: (flowId, address, level) => simulateApiCall({
    success: true,
    message: "Address added successfully"
  }, 1000),
  
  // Remove an address from a flow
  removeAddressFromFlow: (flowId, address) => simulateApiCall({
    success: true,
    message: "Address removed successfully"
  }, 1000)
};