// src/utils/flowImportJSON.js

/**
 * Imports flow data from JSON and reconstructs the flow
 * @param {Object} jsonData - The JSON data to import
 * @param {Function} setNodes - Function to update nodes state
 * @param {Function} setEdges - Function to update edges state
 * @returns {Promise} - Promise that resolves when import is complete
 */
export const importFlowFromJSON = (jsonData, setNodes, setEdges) => {
    return new Promise((resolve, reject) => {
      try {
        // Validate JSON structure
        if (!jsonData || !jsonData.nodes || !jsonData.edges) {
          reject(new Error("Invalid JSON format: Missing nodes or edges"));
          return;
        }
  
        // Process nodes
        const importedNodes = jsonData.nodes.map(node => ({
          id: node.id,
          type: node.type,
          name: node.name,
          x: node.x,
          y: node.y,
          inputs: node.inputs || [],
          outputs: node.outputs || [],
          metadata: node.metadata || {}
        }));
  
        // Process edges
        const importedEdges = jsonData.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourcePort: edge.sourcePort || 0,
          targetPort: edge.targetPort || 0
        }));
  
        // Validate that all edge sources and targets exist in nodes
        const nodeIds = new Set(importedNodes.map(node => node.id));
        const invalidEdges = importedEdges.filter(edge => 
          !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
        );
  
        if (invalidEdges.length > 0) {
          reject(new Error("Invalid edges: Some source or target nodes not found"));
          return;
        }
  
        // Update state
        setNodes(importedNodes);
        setEdges(importedEdges);
  
        resolve({
          nodes: importedNodes,
          edges: importedEdges
        });
      } catch (error) {
        console.error("Import error:", error);
        reject(new Error("An unexpected error occurred during import"));
      }
    });
  };