// src/utils/node-data.js

// Simulated node data for the flow builder
const nodeData = {
    // Node types available in the system
    nodeTypes: {
      data: {
        name: 'Data',
        description: 'Connect to external data sources',
        icon: 'database', // We'll map this to the appropriate icon in the component
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
      },
      output: {
        name: 'Output',
        description: 'Define the workflow output',
        icon: 'external-link',
        color: 'orange.500',
        category: 'output',
      },
      transform: {
        name: 'Transform',
        description: 'Transform data between formats',
        icon: 'repeat',
        color: 'pink.500',
        category: 'processing',
      },
      condition: {
        name: 'Condition',
        description: 'Branch based on conditions',
        icon: 'git-branch',
        color: 'yellow.500',
        category: 'flow',
      }
    }
  };
  
  export default nodeData;