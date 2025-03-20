// src/utils/flowBeautifier.js

/**
 * Beautifies a flow graph by organizing nodes into layers and positioning them neatly
 * @param {Array} nodes - Array of node objects with positions
 * @param {Array} edges - Array of edge objects {source, target}
 * @returns {Object} - {nodes: rearranged nodes, layerMap: map of layers to node ids}
 */
export const beautifyFlow = (nodes, edges) => {
    if (!nodes.length) return { nodes: [], layerMap: {} };
  
    // 1. Create an adjacency map for the graph
    const outgoingMap = {}; // node -> outgoing nodes
    const incomingMap = {}; // node -> incoming nodes
    
    // Initialize maps
    nodes.forEach(node => {
      outgoingMap[node.id] = [];
      incomingMap[node.id] = [];
    });
    
    // Populate adjacency maps
    edges.forEach(edge => {
      outgoingMap[edge.source].push(edge.target);
      incomingMap[edge.target].push(edge.source);
    });
    
    // 2. Find source nodes (nodes with no incoming edges)
    const sourceNodes = nodes
      .filter(node => incomingMap[node.id].length === 0)
      .map(node => node.id);
    
    // If no source nodes found, pick a random node as source
    if (sourceNodes.length === 0 && nodes.length > 0) {
      sourceNodes.push(nodes[0].id);
    }
    
    // 3. Assign layers using BFS from source nodes
    const nodeToLayer = {};
    const layerToNodes = {};
    const queue = sourceNodes.map(id => ({ id, layer: 0 }));
    const visited = new Set();
    
    while (queue.length > 0) {
      const { id, layer } = queue.shift();
      
      if (visited.has(id)) {
        // If we've seen this node before, update its layer to be the maximum
        nodeToLayer[id] = Math.max(nodeToLayer[id], layer);
        continue;
      }
      
      visited.add(id);
      nodeToLayer[id] = layer;
      
      // Add to layer map
      if (!layerToNodes[layer]) {
        layerToNodes[layer] = [];
      }
      layerToNodes[layer].push(id);
      
      // Add all outgoing nodes to queue with incremented layer
      outgoingMap[id].forEach(targetId => {
        queue.push({ id: targetId, layer: layer + 1 });
      });
    }
    
    // Handle nodes not visited in BFS (disconnected components)
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const layer = Math.max(...Object.values(nodeToLayer), 0) + 1;
        nodeToLayer[node.id] = layer;
        
        if (!layerToNodes[layer]) {
          layerToNodes[layer] = [];
        }
        layerToNodes[layer].push(node.id);
      }
    });
    
    // 4. Calculate positions for each node
    const VERTICAL_SPACING = 200;
    const HORIZONTAL_SPACING = 250;
    const BASE_Y = 100;
    
    // Sort layers
    const sortedLayers = Object.keys(layerToNodes)
      .map(Number)
      .sort((a, b) => a - b);
    
    // Create updated nodes with new positions
    const updatedNodes = nodes.map(node => {
      const layer = nodeToLayer[node.id];
      const nodesInLayer = layerToNodes[layer];
      const indexInLayer = nodesInLayer.indexOf(node.id);
      
      // Calculate position in the layer
      const layerWidth = (nodesInLayer.length - 1) * HORIZONTAL_SPACING;
      const startX = -layerWidth / 2;
      
      const x = startX + indexInLayer * HORIZONTAL_SPACING;
      const y = BASE_Y + layer * VERTICAL_SPACING;
      
      return { ...node, x, y };
    });
    
    // Create a readable layer map for UI display
    const layerMap = {};
    sortedLayers.forEach(layer => {
      layerMap[layer] = layerToNodes[layer].map(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        return {
          id: nodeId,
          name: node.name,
          type: node.type
        };
      });
    });
    
    return { nodes: updatedNodes, layerMap };
  };