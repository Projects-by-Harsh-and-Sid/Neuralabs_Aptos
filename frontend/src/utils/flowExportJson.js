// src/utils/flowExportJSON.js

/**
 * Exports the flow canvas data as JSON
 * @param {Array} nodes - The nodes in the flow
 * @param {Array} edges - The edges connecting the nodes
 * @returns {Promise} - Promise that resolves with the JSON data
 */
export const exportFlowAsJSON = (nodes, edges) => {
    return new Promise((resolve, reject) => {
      if (!nodes || nodes.length === 0) {
        reject(new Error("No flow content to export."));
        return;
      }
  
      try {
        // Prepare the flow data structure
        const flowData = {
          exportDate: new Date().toISOString(),
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            name: node.name,
            x: node.x,
            y: node.y,
            inputs: node.inputs || [],
            outputs: node.outputs || [],
            metadata: node.metadata || {}
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourcePort: edge.sourcePort || 0,
            targetPort: edge.targetPort || 0
          })),
          version: "1.0"
        };
  
        // Convert to JSON string with formatting
        const jsonString = JSON.stringify(flowData, null, 2);
        
        // Create a blob and URL
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        resolve({
          data: jsonString,
          url: url,
          filename: `flow-export-${new Date().toISOString().split('T')[0]}.json`
        });
      } catch (error) {
        console.error("JSON Export error:", error);
        reject(new Error("An unexpected error occurred during JSON export."));
      }
    });
  };