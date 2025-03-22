// src/utils/flowExport.js

/**
 * Exports the flow canvas as a PNG image
 * @param {Array} nodes - The nodes in the flow
 * @param {Array} edges - The edges connecting the nodes
 * @param {Object} selectedNode - The currently selected node (if any)
 * @param {string} colorMode - Current color mode ('light' or 'dark')
 * @returns {Promise} - Promise that resolves when export is complete
 */
export const exportFlowAsPNG = (nodes, edges, selectedNode, colorMode) => {
    return new Promise((resolve, reject) => {
      if (!nodes || nodes.length === 0) {
        reject(new Error("No flow content to export."));
        return;
      }
      
      try {
        // Create a new SVG element for export
        const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        
        // Calculate the bounding box based on node positions
        let boundingBox = getFlowBoundingBox(nodes);
        const { minX, maxX, minY, maxY } = boundingBox;
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Set attributes for the export SVG
        exportSvg.setAttribute('width', width);
        exportSvg.setAttribute('height', height);
        exportSvg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
        
        // Add a background
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute('x', minX);
        bgRect.setAttribute('y', minY);
        bgRect.setAttribute('width', width);
        bgRect.setAttribute('height', height);
        bgRect.setAttribute('fill', colorMode === 'dark' ? '#1e1f21' : '#f2f3f4');
        exportSvg.appendChild(bgRect);
        
        // Create a group for the grid (optional)
        const gridPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        gridPattern.setAttribute('id', 'grid-export');
        gridPattern.setAttribute('width', '50');
        gridPattern.setAttribute('height', '50');
        gridPattern.setAttribute('patternUnits', 'userSpaceOnUse');
        
        const gridPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        gridPath.setAttribute('d', 'M 50 0 L 0 0 0 50');
        gridPath.setAttribute('fill', 'none');
        gridPath.setAttribute('stroke', colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
        gridPath.setAttribute('stroke-width', '1');
        
        gridPattern.appendChild(gridPath);
        
        // Add the pattern to defs
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.appendChild(gridPattern);
        
        // Create arrow markers
        const arrowMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        arrowMarker.setAttribute('id', 'arrow-export');
        arrowMarker.setAttribute('viewBox', '0 0 10 10');
        arrowMarker.setAttribute('refX', '8');
        arrowMarker.setAttribute('refY', '5');
        arrowMarker.setAttribute('markerWidth', '5');
        arrowMarker.setAttribute('markerHeight', '5');
        arrowMarker.setAttribute('orient', 'auto');
        
        const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10');
        arrowPath.setAttribute('fill', 'none');
        arrowPath.setAttribute('stroke', colorMode === 'dark' ? '#A0AEC0' : '#718096');
        arrowPath.setAttribute('stroke-width', '1.5');
        arrowPath.setAttribute('stroke-linejoin', 'round');
        
        arrowMarker.appendChild(arrowPath);
        defs.appendChild(arrowMarker);
        
        exportSvg.appendChild(defs);
        
        // Add the grid
        const gridRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        gridRect.setAttribute('width', '10000');
        gridRect.setAttribute('height', '10000');
        gridRect.setAttribute('x', '-5000');
        gridRect.setAttribute('y', '-5000');
        gridRect.setAttribute('fill', 'url(#grid-export)');
        exportSvg.appendChild(gridRect);
        
        // Create groups for edges and nodes
        const edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Draw all edges first
        edges.forEach(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (sourceNode && targetNode) {
            const sourcePortIndex = edge.sourcePort || 0;
            const targetPortIndex = edge.targetPort || 0;
            
            // Calculate port positions
            const sourceY = sourceNode.y + 30 + (sourcePortIndex * 20);
            const targetY = targetNode.y - 30 - (targetPortIndex * 20);
            
            // Create a smooth bezier curve
            const path = `M ${sourceNode.x} ${sourceY} C ${sourceNode.x} ${sourceY + 50}, ${targetNode.x} ${targetY - 50}, ${targetNode.x} ${targetY}`;
            
            const edgePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            edgePath.setAttribute('d', path);
            edgePath.setAttribute('stroke', colorMode === 'dark' ? '#A0AEC0' : '#718096');
            edgePath.setAttribute('stroke-width', '2');
            edgePath.setAttribute('fill', 'none');
            edgePath.setAttribute('marker-end', 'url(#arrow-export)');
            
            edgesGroup.appendChild(edgePath);
          }
        });
        
        // Draw all nodes
        nodes.forEach(node => {
          // Create node group
          const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
          
          // Get node styling
          const isSelected = selectedNode && selectedNode.id === node.id;
          const nodeColor = getNodeColor(node.type, isSelected);
          
          // Node background
          const nodeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          nodeRect.setAttribute('x', '-60');
          nodeRect.setAttribute('y', '-30');
          nodeRect.setAttribute('width', '120');
          nodeRect.setAttribute('height', '60');
          nodeRect.setAttribute('rx', '6');
          nodeRect.setAttribute('ry', '6');
          nodeRect.setAttribute('fill', colorMode === 'dark' ? '#1A202C' : '#FFFFFF');
          nodeRect.setAttribute('stroke', nodeColor);
          nodeRect.setAttribute('stroke-width', '2');
          
          nodeGroup.appendChild(nodeRect);
          
          // Add text for node name
          const nodeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          nodeText.setAttribute('x', '0');
          nodeText.setAttribute('y', '5');
          nodeText.setAttribute('text-anchor', 'middle');
          nodeText.setAttribute('font-size', '14');
          nodeText.setAttribute('fill', colorMode === 'dark' ? '#FFFFFF' : '#000000');
          nodeText.textContent = node.name;
          
          nodeGroup.appendChild(nodeText);
          
          // Input ports
          const inputCount = node.inputs?.length || 1;
          for (let i = 0; i < inputCount; i++) {
            const portCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            portCircle.setAttribute('cx', '0');
            portCircle.setAttribute('cy', `${-30 - (i * 20)}`);
            portCircle.setAttribute('r', '5');
            portCircle.setAttribute('fill', colorMode === 'dark' ? '#FFFFFF' : '#000000');
            portCircle.setAttribute('stroke', nodeColor);
            portCircle.setAttribute('stroke-width', '2');
            
            nodeGroup.appendChild(portCircle);
          }
          
          // Output ports
          const outputCount = node.outputs?.length || 1;
          for (let i = 0; i < outputCount; i++) {
            const portCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            portCircle.setAttribute('cx', '0');
            portCircle.setAttribute('cy', `${30 + (i * 20)}`);
            portCircle.setAttribute('r', '5');
            portCircle.setAttribute('fill', colorMode === 'dark' ? '#FFFFFF' : '#000000');
            portCircle.setAttribute('stroke', nodeColor);
            portCircle.setAttribute('stroke-width', '2');
            
            nodeGroup.appendChild(portCircle);
          }
          
          nodesGroup.appendChild(nodeGroup);
        });
        
        // Add edges and nodes to the export SVG
        exportSvg.appendChild(edgesGroup);
        exportSvg.appendChild(nodesGroup);
        
        // Convert the SVG to a data URL
        const svgData = new XMLSerializer().serializeToString(exportSvg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        // Create an image from the SVG
        const img = new Image();
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = colorMode === 'dark' ? '#1e1f21' : '#f2f3f4';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to PNG
          const dataUrl = canvas.toDataURL('image/png');
          
          // Return the data URL
          resolve(dataUrl);
          
          // Clean up
          URL.revokeObjectURL(url);
        };
        
        img.onerror = (error) => {
          console.error("Failed to load SVG as image:", error);
          URL.revokeObjectURL(url);
          reject(new Error("Could not convert the flow to an image."));
        };
        
        img.src = url;
      } catch (error) {
        console.error("Export error:", error);
        reject(new Error("An unexpected error occurred during export."));
      }
    });
  };
  
  /**
   * Calculate the bounding box of all nodes in the flow
   * @param {Array} nodes - The nodes in the flow
   * @returns {Object} The bounding box coordinates
   */
  const getFlowBoundingBox = (nodes) => {
    if (!nodes || nodes.length === 0) {
      return { minX: 0, maxX: 800, minY: 0, maxY: 600 };
    }
    
    // Initialize with the first node
    let minX = nodes[0].x;
    let maxX = nodes[0].x;
    let minY = nodes[0].y;
    let maxY = nodes[0].y;
    
    // Find the min/max values
    nodes.forEach(node => {
      // Add padding for node width/height (approximate)
      minX = Math.min(minX, node.x - 100);
      maxX = Math.max(maxX, node.x + 100);
      minY = Math.min(minY, node.y - 50);
      maxY = Math.max(maxY, node.y + 50);
    });
    
    // Add padding
    const padding = 50;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;
    
    return { minX, maxX, minY, maxY };
  };
  
  /**
   * Get the color for a node based on its type
   * @param {string} nodeType - The type of the node
   * @param {boolean} isSelected - Whether the node is selected
   * @returns {string} The color for the node
   */
  const getNodeColor = (nodeType, isSelected) => {
    // Define node type colors
    const nodeTypes = {
      data: '#3182CE', // blue.500
      task: '#38A169', // green.500
      parameters: '#805AD5', // purple.500
      default: '#718096', // gray.500
    };
    
    // Return the color for the node type, or default to gray
    const baseColor = nodeTypes[nodeType] || nodeTypes.default;
    
    // Use a more prominent color for selected nodes
    return isSelected ? '#4299E1' : baseColor; // blue.400 for selected
  };