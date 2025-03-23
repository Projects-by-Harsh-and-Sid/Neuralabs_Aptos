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

// Define all flows data in one place to ensure consistency
const flowsData = [
  {
    id: 'item-1',
    name: 'Data Cleaner Pro',
    description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
    longDescription: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs. It helps you clean, transform, and prepare your data for analysis with just a few clicks. The tool identifies and handles missing values, removes duplicates, standardizes formats, and much more.',
    author: 'DataScience Tools',
    icon: 'A',
    accessLevel: 6,
    rating: 4.5,
    downloads: 2580,
    tags: ['Lorem', 'Lorem ipsum'],
    creationDate: "2025-02-10",
    owner: "John Doe",
    coOwner: "Jane Smith",
    usersWithAccess: 15
  },
  {
    id: 'item-2',
    name: 'Data Cleaner Pro',
    description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
    longDescription: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs. It helps you clean, transform, and prepare your data for analysis with just a few clicks. The tool identifies and handles missing values, removes duplicates, standardizes formats, and much more.',
    author: 'DataScience Tools',
    icon: 'A',
    accessLevel: 6,
    rating: 4.2,
    downloads: 2100,
    tags: ['Lorem', 'Lorem ipsum'],
    creationDate: "2025-01-15",
    owner: "Robert Johnson",
    coOwner: "Maria Garcia",
    usersWithAccess: 12
  },
  {
    id: 'item-3',
    name: 'Data Cleaner Pro',
    description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
    longDescription: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs. It helps you clean, transform, and prepare your data for analysis with just a few clicks. The tool identifies and handles missing values, removes duplicates, standardizes formats, and much more.',
    author: 'DataScience Tools',
    icon: 'A',
    accessLevel: 6,
    rating: 4.3,
    downloads: 1950,
    tags: ['Lorem'],
    creationDate: "2025-01-20",
    owner: "Sarah Williams",
    coOwner: "David Brown",
    usersWithAccess: 10
  },
  {
    id: 'item-4',
    name: 'Data Cleaner Pro',
    description: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs.',
    longDescription: 'Data cleaner Pro is the only one stop solution for all your data cleaning needs. It helps you clean, transform, and prepare your data for analysis with just a few clicks. The tool identifies and handles missing values, removes duplicates, standardizes formats, and much more.',
    author: 'DataScience Tools',
    icon: 'A',
    accessLevel: 6,
    rating: 4.7,
    downloads: 3120,
    tags: ['Lorem', 'Lorem ipsum'],
    creationDate: "2025-02-01",
    owner: "Michael Chen",
    coOwner: "Lisa Wilson",
    usersWithAccess: 18
  },
  {
    id: 'item-5',
    name: 'Gaussian Integral',
    description: 'Advanced mathematical analysis tool for complex calculations.',
    longDescription: 'Our Gaussian Integral tool offers advanced mathematical capabilities for complex calculations. Use it to solve multi-dimensional integrals, perform statistical analysis, and implement sophisticated mathematical models in your data pipelines.',
    author: 'MathWorks Inc',
    icon: 'G',
    accessLevel: 5,
    rating: 4.8,
    downloads: 1850,
    tags: ['Math', 'Analysis'],
    creationDate: "2025-01-05",
    owner: "Alex Morgan",
    coOwner: "Daniel White",
    usersWithAccess: 9
  },
  {
    id: 'item-6',
    name: 'SQL Connector',
    description: 'Connect to and query SQL databases directly.',
    longDescription: 'The SQL Connector tool provides seamless integration with your databases. Build complex queries, transform data, and automate database operations with this powerful tool.',
    author: 'Database Solutions',
    icon: 'S',
    accessLevel: 5,
    rating: 4.6,
    downloads: 2340,
    tags: ['SQL', 'Database'],
    creationDate: "2025-01-12",
    owner: "Patricia Evans",
    coOwner: "James Taylor",
    usersWithAccess: 14
  },
  {
    id: 'item-7',
    name: 'Neural Network',
    description: 'Build and train neural networks with a simple interface.',
    longDescription: 'Create, train, and deploy neural networks without writing complex code. This tool makes deep learning accessible with its intuitive interface and powerful backend.',
    author: 'AI Research Group',
    icon: 'N',
    accessLevel: 4,
    rating: 4.4,
    downloads: 1720,
    tags: ['AI', 'Machine Learning'],
    creationDate: "2025-01-18",
    owner: "Kevin Lee",
    coOwner: "Elena Rodriguez",
    usersWithAccess: 8
  },
  {
    id: 'item-8',
    name: 'Feature Extractor',
    description: 'Extract features from text, images, and more.',
    longDescription: 'The Feature Extractor processes raw data to identify and extract meaningful features for machine learning models. Support for text, images, audio, and structured data.',
    author: 'Data Science Hub',
    icon: 'F',
    accessLevel: 3,
    rating: 4.1,
    downloads: 1350,
    tags: ['Feature Engineering', 'ML'],
    creationDate: "2025-01-25",
    owner: "Thomas Anderson",
    coOwner: "Samantha Wright",
    usersWithAccess: 6
  },
  {
    id: 'item-9',
    name: 'Data Visualizer',
    description: 'Create beautiful visualizations of your data.',
    longDescription: 'Transform your data into compelling visual stories with the Data Visualizer. Create interactive dashboards, charts, and graphs with just a few clicks.',
    author: 'Visual Analytics',
    icon: 'D',
    accessLevel: 2,
    rating: 4.3,
    downloads: 2050,
    tags: ['Visualization', 'Dashboard'],
    creationDate: "2025-02-05",
    owner: "Olivia Martinez",
    coOwner: "William Johnson",
    usersWithAccess: 11
  }
];

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
  
  // Get all flows - This was the missing function
  getAllFlows: () => simulateApiCall(flowsData),
  
  // Get details about a specific flow's access
  getFlowAccess: (flowId) => {
    // Find the flow with matching id
    const flow = flowsData.find(f => f.id === flowId) || flowsData[0];
    
    // Return flow data + addresses
    return simulateApiCall({
      ...flow,
      addresses: [
        { address: "0x43AD...6612", level: 6 },
        { address: "0xcb6d...2912", level: 6 },
        { address: "0x87FE...1234", level: 5 },
        { address: "0x34AB...9876", level: 4 }
      ]
    });
  },
  
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