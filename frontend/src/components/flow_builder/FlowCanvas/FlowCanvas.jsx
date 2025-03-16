// src/components/flow_builder/FlowCanvas/FlowCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FiDatabase, FiActivity, FiSliders } from 'react-icons/fi';

const FlowCanvas = ({ 
  nodes, 
  edges, 
  onAddNode, 
  onAddEdge, 
  onSelectNode, 
  selectedNode,
  onUpdateNodePosition
}) => {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [connectingNode, setConnectingNode] = useState(null);
  const [connectingPort, setConnectingPort] = useState(null);
  const [connectingPath, setConnectingPath] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const nodeColor = useColorModeValue('white', 'gray.800');
  const nodeBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');


// Add a debug effect to check the ref:
useEffect(() => {
  console.log("Canvas ref:", canvasRef.current);
}, [canvasRef.current]);

  useEffect(() => {
    // Set up the D3 zoom behavior
    const svg = d3.select(svgRef.current);
    const canvas = d3.select(canvasRef.current);
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        canvas.attr('transform', event.transform);
        setScale(event.transform.k);
        setTranslate({ x: event.transform.x, y: event.transform.y });
      });
    
    svg.call(zoom);
    
    // Handle drag and drop from the blocks panel
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      
      const nodeType = e.dataTransfer.getData('nodeType');
      if (nodeType) {
        // Calculate the position with respect to the canvas transform
        const svgRect = svg.node().getBoundingClientRect();
        const x = (e.clientX - svgRect.left - translate.x) / scale;
        const y = (e.clientY - svgRect.top - translate.y) / scale;
        
        onAddNode(nodeType, { x, y });
      }
    };
    
    svg.node().addEventListener('dragover', handleDragOver);
    svg.node().addEventListener('drop', handleDrop);
    
    return () => {
      // Clean up event listeners
      svg.on('.zoom', null);
      svg.node().removeEventListener('dragover', handleDragOver);
      svg.node().removeEventListener('drop', handleDrop);
    };
  }, [onAddNode, scale, translate]);

  // Handle node selection
  useEffect(() => {
    if (selectedNode) {
      // Find all connections related to the selected node
      const relatedConnections = edges.filter(
        edge => edge.source === selectedNode.id || edge.target === selectedNode.id
      );
      setHighlightedConnections(relatedConnections.map(conn => conn.id));
    } else {
      setHighlightedConnections([]);
    }
  }, [selectedNode, edges]);

  // Determine if a connection is highlighted
  const isConnectionHighlighted = (connectionId) => {
    return highlightedConnections.includes(connectionId);
  };

  // Handle node dragging
  const handleNodeMouseDown = (e, nodeId) => {
    if (e.button !== 0) return; // Only left mouse button
    
    e.stopPropagation();
    onSelectNode(nodeId);
    
    const startNodeDrag = (e) => {
      setDragging(true);
      
      const svg = svgRef.current;
      const svgRect = svg.getBoundingClientRect();
      
      // Find the node
      const nodeData = nodes.find(n => n.id === nodeId);
      
      // Get the starting position
      const startPos = {
        x: e.clientX,
        y: e.clientY
      };
      
      // Get the current node position
      const currentPos = {
        x: nodeData.x,
        y: nodeData.y
      };
      
      const moveHandler = (e) => {
        // Calculate the new position with respect to the canvas transform
        const dx = (e.clientX - startPos.x) / scale;
        const dy = (e.clientY - startPos.y) / scale;
        
        // Update the node position
        const newX = currentPos.x + dx;
        const newY = currentPos.y + dy;
        
        if (onUpdateNodePosition) {
          onUpdateNodePosition(nodeId, { x: newX, y: newY });
        }
      };
      
      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        setDragging(false);
      };
      
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    };
    
    startNodeDrag(e);
  };

  // Start connecting two nodes
  const handlePortMouseDown = (e, nodeId, portType, portIndex) => {
    if (e.button !== 0) return; // Only left mouse button
    
    e.stopPropagation();
    setConnectingNode(nodeId);
    setConnectingPort({ type: portType, index: portIndex });
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    
    // Find the node
    const nodeData = nodes.find(n => n.id === nodeId);
    
    // Create a temporary path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connecting-path');
    path.setAttribute('stroke', colorMode === 'dark' ? 'white' : 'gray');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('fill', 'none');
    
    // Add the path to the canvas
    canvasRef.current.appendChild(path);
    setConnectingPath(path);
    
    // Get the starting position
    let startX, startY;
    
    if (portType === 'output') {
      startX = nodeData.x;
      startY = nodeData.y + 30 + (portIndex * 20);
    } else { // input
      startX = nodeData.x;
      startY = nodeData.y - 30 - (portIndex * 20); 
    }
    
    // Update the path as the mouse moves
    const moveHandler = (e) => {
      // Calculate the mouse position with respect to the canvas transform
      const x = (e.clientX - svgRect.left - translate.x) / scale;
      const y = (e.clientY - svgRect.top - translate.y) / scale;
      
      // Update the mouse position state
      setMousePosition({ x, y });
      
      // Create a smooth bezier curve
      let path;
      
      if (portType === 'output') {
        path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${x - 100} ${y}, ${x} ${y}`;
      } else { // input
        path = `M ${x} ${y} C ${x + 100} ${y}, ${startX - 100} ${startY}, ${startX} ${startY}`;
      }
      
      connectingPath.setAttribute('d', path);
    };
    
    const upHandler = (e) => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      
      // Remove the temporary path
      if (connectingPath) {
        connectingPath.remove();
      }
      
      // Check if the mouse is over a compatible port
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      
      if (targetElement && targetElement.classList.contains('node-port')) {
        const targetNodeId = targetElement.getAttribute('data-node-id');
        const targetPortType = targetElement.getAttribute('data-port-type');
        const targetPortIndex = parseInt(targetElement.getAttribute('data-port-index'), 10);
        
        // Prevent connecting to the same node
        if (targetNodeId !== connectingNode) {
          // Validate connection compatibility (output -> input)
          if (
            (portType === 'output' && targetPortType === 'input') ||
            (portType === 'input' && targetPortType === 'output')
          ) {
            // Determine source and target based on the port types
            let source, target, sourcePort, targetPort;
            
            if (portType === 'output') {
              source = nodeId;
              target = targetNodeId;
              sourcePort = portIndex;
              targetPort = targetPortIndex;
            } else { // input
              source = targetNodeId;
              target = nodeId;
              sourcePort = targetPortIndex;
              targetPort = portIndex;
            }
            
            onAddEdge(source, target, sourcePort, targetPort);
          }
        }
      }
      
      setConnectingNode(null);
      setConnectingPort(null);
      setConnectingPath(null);
    };
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };

  // Get node icon
  const getNodeIcon = (nodeType) => {
    switch (nodeType) {
      case 'data':
        return <FiDatabase size={20} />;
      case 'task':
        return <FiActivity size={20} />;
      case 'parameters':
        return <FiSliders size={20} />;
      default:
        return null;
    }
  };

  // Get node color
  const getNodeColors = (nodeType, isSelected) => {
    const colors = {
      ringColor: '',
      bgColor: isSelected ? (colorMode === 'dark' ? 'gray.700' : 'gray.50') : nodeColor,
      iconColor: ''
    };
    
    switch (nodeType) {
      case 'data':
        colors.ringColor = isSelected ? 'blue.500' : 'blue.300';
        colors.iconColor = 'blue.500';
        break;
      case 'task':
        colors.ringColor = isSelected ? 'green.500' : 'green.300';
        colors.iconColor = 'green.500';
        break;
      case 'parameters':
        colors.ringColor = isSelected ? 'purple.500' : 'purple.300';
        colors.iconColor = 'purple.500';
        break;
      default:
        colors.ringColor = isSelected ? 'gray.500' : 'gray.300';
        colors.iconColor = 'gray.500';
    }
    
    return colors;
  };

  // Render node
  const renderNode = (node) => {
    const isSelected = selectedNode && selectedNode.id === node.id;
    const { ringColor, bgColor, iconColor } = getNodeColors(node.type, isSelected);
    
    // Determine input and output counts
    const inputCount = node.inputs?.length || 1;
    const outputCount = node.outputs?.length || 1;
    
    return (
      <g
        key={node.id}
        className="node"
        transform={`translate(${node.x}, ${node.y})`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
        data-node-id={node.id}
      >
        {/* Node shape */}
        <foreignObject
          x="-60"
          y="-30"
          width="120"
          height="60"
          style={{ overflow: 'visible' }}
        >
          <div 
            style={{ 
              width: '120px', 
              height: '60px', 
              borderRadius: '6px',
              border: '2px solid',
              borderColor: ringColor,
              backgroundColor: bgColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'move',
              position: 'relative',
              userSelect: 'none',
              boxShadow: isSelected ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
              transition: 'box-shadow 0.2s, transform 0.1s',
              color: textColor
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: iconColor }}>
                {getNodeIcon(node.type)}
              </div>
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{node.name}</span>
            </div>
          </div>
        </foreignObject>
        
        {/* Input ports */}
        {Array.from({ length: inputCount }).map((_, i) => (
          <g key={`input-${i}`} transform={`translate(0, ${-30 - (i * 20)})`}>
            <circle
              cx="0"
              cy="0"
              r="5"
              className="node-port"
              style={{
                fill: colorMode === 'dark' ? 'gray.700' : 'white',
                stroke: getNodeColors(node.type).ringColor,
                strokeWidth: 2,
                cursor: 'crosshair'
              }}
              data-node-id={node.id}
              data-port-type="input"
              data-port-index={i}
              onMouseDown={(e) => handlePortMouseDown(e, node.id, 'input', i)}
            />
          </g>
        ))}
        
        {/* Output ports */}
        {Array.from({ length: outputCount }).map((_, i) => (
          <g key={`output-${i}`} transform={`translate(0, ${30 + (i * 20)})`}>
            <circle
              cx="0"
              cy="0"
              r="5"
              className="node-port"
              style={{
                fill: colorMode === 'dark' ? 'gray.700' : 'white',
                stroke: getNodeColors(node.type).ringColor,
                strokeWidth: 2,
                cursor: 'crosshair'
              }}
              data-node-id={node.id}
              data-port-type="output"
              data-port-index={i}
              onMouseDown={(e) => handlePortMouseDown(e, node.id, 'output', i)}
            />
          </g>
        ))}
      </g>
    );
  };

  // Render edge
  const renderEdge = (edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    const sourcePortIndex = edge.sourcePort || 0;
    const targetPortIndex = edge.targetPort || 0;
    
    // Calculate port positions
    const sourceY = sourceNode.y + 30 + (sourcePortIndex * 20);
    const targetY = targetNode.y - 30 - (targetPortIndex * 20);
    
    // Create a smooth bezier curve
    const path = `M ${sourceNode.x} ${sourceY} C ${sourceNode.x} ${sourceY + 50}, ${targetNode.x} ${targetY - 50}, ${targetNode.x} ${targetY}`;
    
    const isHighlighted = isConnectionHighlighted(edge.id);
    const strokeColor = isHighlighted 
      ? (colorMode === 'dark' ? 'blue.300' : 'blue.500') 
      : (colorMode === 'dark' ? 'gray.500' : 'gray.400');
    const strokeWidth = isHighlighted ? 2 : 1;
    
    return (
      <path
        key={edge.id}
        className="edge-path"
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={isHighlighted ? "url(#arrow-highlighted)" : "url(#arrow)"}
        data-edge-id={edge.id}
        style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
      />
    );
  };

  return (
    <Box 
      flex="1" 
      h="100%" 
      bg={bgColor} 
      position="relative" 
      overflow="hidden"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onClick={() => onSelectNode(null)}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colorMode === 'dark' ? 'gray' : 'gray'} />
          </marker>
          <marker
            id="arrow-highlighted"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colorMode === 'dark' ? 'blue.300' : 'blue.500'} />
          </marker>
        </defs>
        <g ref={canvasRef}>
          {/* Render edges first so they're under the nodes */}
          <g>
            {edges.map(renderEdge)}
          </g>
          <g>
            {nodes.map(renderNode)}
          </g>
        </g>
      </svg>
    </Box>
  );
};

export default FlowCanvas;