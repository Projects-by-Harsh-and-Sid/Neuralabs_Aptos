// src/utils/node-data.js

// Simulated node data for the flow builder
const nodeData = {
    // Node categories for organizing the blocks panel
    categories: [
      {
        id: 'flow-control',
        name: 'Flow Control',
        nodes: ['start', 'end', 'case']
      },
      {
        id: 'inputs-data',
        name: 'Inputs and Data',
        nodes: ['chat-input', 'context-history', 'datablocks', 'sql-database', 'rest-api']
      },
      {
        id: 'onchain',
        name: 'Onchain',
        nodes: ['blockchain-read', 'transaction-json']
      },
      {
        id: 'util',
        name: 'Util',
        nodes: ['selector', 'merger', 'random-generator', 'time']
      },
      {
        id: 'ai',
        name: 'AI Blocks',
        nodes: ['llm-free', 'llm-structured']
      },
      {
        id: 'custom',
        name: 'Custom Block',
        nodes: ['custom-script']
      }
    ],
    
    // Node types available in the system
    nodeTypes: {
      // Flow Control
      'start': {
          name: 'Start Block',
          description: 'Entry point for the flow',
          icon: 'play-circle',
          color: 'green.500',
          category: 'flow-control',
      },
      'end': {
          name: 'End Block',
          description: 'Exit point for the flow',
          icon: 'x-circle',
          color: 'red.500',
          category: 'flow-control',
      },
      'case': {
          name: 'Case Block',
          description: 'Conditional branching based on cases',
          icon: 'git-branch',
          color: 'orange.500',
          category: 'flow-control',
      },
      
      // Inputs and Data
      'chat-input': {
          name: 'Chat Input',
          description: 'Process user chat inputs',
          icon: 'message-circle',
          color: 'blue.500',
          category: 'inputs-data',
      },
      'context-history': {
          name: 'Context History',
          description: 'Access conversation history',
          icon: 'book-open',
          color: 'blue.400',
          category: 'inputs-data',
      },
      'datablocks': {
          name: 'Datablocks',
          description: 'Process structured data',
          icon: 'database',
          color: 'blue.600',
          category: 'inputs-data',
      },
      'sql-database': {
          name: 'SQL Database',
          description: 'Connect to SQL databases',
          icon: 'server',
          color: 'blue.700',
          category: 'inputs-data',
      },
      'rest-api': {
          name: 'REST API',
          description: 'Make external API calls',
          icon: 'globe',
          color: 'blue.300',
          category: 'inputs-data',
      },
      
      // Onchain
      'blockchain-read': {
          name: 'Read Blockchain',
          description: 'Read data from blockchain',
          icon: 'link',
          color: 'purple.500',
          category: 'onchain',
      },
      'transaction-json': {
          name: 'Transaction JSON',
          description: 'Build blockchain transaction data',
          icon: 'file-text',
          color: 'purple.600',
          category: 'onchain',
      },
      
      // Util
      'selector': {
          name: 'Selector',
          description: 'Select specific data from input',
          icon: 'filter',
          color: 'yellow.500',
          category: 'util',
      },
      'merger': {
          name: 'Merger',
          description: 'Merge multiple data inputs',
          icon: 'git-merge',
          color: 'yellow.600',
          category: 'util',
      },
      'random-generator': {
          name: 'Random Generator',
          description: 'Generate random values',
          icon: 'shuffle',
          color: 'yellow.400',
          category: 'util',
      },
      'time': {
          name: 'Time',
          description: 'Work with time and dates',
          icon: 'clock',
          color: 'yellow.300',
          category: 'util',
      },
      
      // AI Blocks
      'llm-free': {
          name: 'LLM Free Flowing',
          description: 'Open-ended LLM generation',
          icon: 'cpu',
          color: 'teal.500',
          category: 'ai',
      },
      'llm-structured': {
          name: 'LLM Structured',
          description: 'Structured output from LLM',
          icon: 'layout',
          color: 'teal.600',
          category: 'ai',
      },
      
      // Custom Block
      'custom-script': {
          name: 'Custom Script',
          description: 'Write custom code for special processing',
          icon: 'code',
          color: 'pink.500',
          category: 'custom',
      },
      
      // Original types for backward compatibility
      data: {
          name: 'Data',
          description: 'Connect to external data sources',
          icon: 'database',
          color: 'blue.500',
          category: 'input',
      },
      task: {
          name: 'Task',
          description: 'Process data with custom logic',
          icon: 'activity',
          color: 'green.500',
          category: 'processing',
      },
      parameters: {
          name: 'Parameters',
          description: 'Define input parameters for the workflow',
          icon: 'sliders',
          color: 'purple.500',
          category: 'configuration',
      }
  }
  };
  
  export default nodeData;