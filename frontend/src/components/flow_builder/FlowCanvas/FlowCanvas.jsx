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
  onUpdateNodePosition,
  scale = 1,
  translate = { x: 0, y: 0 },
  setScale,
  setTranslate,
  svgRef: externalSvgRef, // Allow using an external ref if provided
  zoomBehaviorRef: externalZoomRef
}) => {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
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
  const edgeColor = useColorModeValue('gray.400', 'gray.500');
  const edgeHighlightColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    // Use external ref if provided, otherwise use internal ref
    const svgElement = externalSvgRef?.current || svgRef.current;
    if (!svgElement) return;
    
    const svg = d3.select(svgElement);
    const canvas = d3.select(canvasRef.current);
    
    // Use external zoom behavior if provided, otherwise create a new one
    let zoom;
    if (externalZoomRef?.current) {
      zoom = externalZoomRef.current;
    } else {
      zoom = d3.zoom()
        .scaleExtent([0.1, 4]);
    }
    
    // Configure zoom behavior
    zoom.on('zoom', (event) => {
      canvas.attr('transform', event.transform);
      
      // Batch state updates to prevent render loops
      const scaleChanged = Math.abs(event.transform.k - scale) > 0.001;
      const translateXChanged = Math.abs(event.transform.x - translate.x) > 0.001;
      const translateYChanged = Math.abs(event.transform.y - translate.y) > 0.001;
      
      if ((scaleChanged || translateXChanged || translateYChanged) && setScale && setTranslate) {
        // Use requestAnimationFrame to throttle updates
        requestAnimationFrame(() => {
          if (scaleChanged && setScale) {
            setScale(event.transform.k);
          }
          if ((translateXChanged || translateYChanged) && setTranslate) {
            setTranslate({ x: event.transform.x, y: event.transform.y });
          }
        });
      }
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
        const svgRect = svgElement.getBoundingClientRect();
        const x = (e.clientX - svgRect.left - translate.x) / scale;
        const y = (e.clientY - svgRect.top - translate.y) / scale;
        
        onAddNode(nodeType, { x, y });
      }
    };
    
    svgElement.addEventListener('dragover', handleDragOver);
    svgElement.addEventListener('drop', handleDrop);
    
    return () => {
      // Clean up event listeners
      svg.on('.zoom', null);
      svgElement.removeEventListener('dragover', handleDragOver);
      svgElement.removeEventListener('drop', handleDrop);
    };
  }, [onAddNode, externalSvgRef, externalZoomRef, scale, translate, setScale, setTranslate]);

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
      if (!nodeData) return;
      
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
      
      // Use a local variable to track the current position without causing rerenders
      let latestPosition = { ...currentPos };
      
      const moveHandler = (e) => {
        // Calculate the new position with respect to the canvas transform
        const dx = (e.clientX - startPos.x) / scale;
        const dy = (e.clientY - startPos.y) / scale;
        
        // Update the node position
        latestPosition = {
          x: currentPos.x + dx,
          y: currentPos.y + dy
        };
        
        // Update the node visually without causing a state update
        const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
          nodeElement.setAttribute('transform', `translate(${latestPosition.x}, ${latestPosition.y})`);
        }
      };
      
      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        setDragging(false);
        
        // Only update state once at the end of drag
        if (onUpdateNodePosition) {
          onUpdateNodePosition(nodeId, latestPosition);
        }
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
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    
    // Find the node
    const nodeData = nodes.find(n => n.id === nodeId);
    if (!nodeData) return;
    
    setConnectingNode(nodeId);
    setConnectingPort({ type: portType, index: portIndex });
    
    // Calculate the start position of the connection
    const startX = nodeData.x;
    let startY;
    
    if (portType === 'output') {
      startY = nodeData.y + 30 + (portIndex * 20);
    } else { // input
      startY = nodeData.y - 30 - (portIndex * 20); 
    }
    
    // Create a temporary path
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('stroke', colorMode === 'dark' ? 'white' : 'gray');
    tempPath.setAttribute('stroke-width', '2');
    tempPath.setAttribute('stroke-dasharray', '5,5');
    tempPath.setAttribute('fill', 'none');
    
    // Add the path to the canvas
    if (canvasRef.current) {
      canvasRef.current.appendChild(tempPath);
      setConnectingPath(tempPath);
    }
    
    // Update the path as the mouse moves
    const moveHandler = (e) => {
      if (!tempPath) return;
      
      // Calculate the mouse position with respect to the canvas transform
      const mouseX = (e.clientX - svgRect.left - translate.x) / scale;
      const mouseY = (e.clientY - svgRect.top - translate.y) / scale;
      
      // Update the mouse position state
      setMousePosition({ x: mouseX, y: mouseY });
      
      // Create a smooth bezier curve
      let pathData;
      
      if (portType === 'output') {
        pathData = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${mouseX - 100} ${mouseY}, ${mouseX} ${mouseY}`;
      } else { // input
        pathData = `M ${mouseX} ${mouseY} C ${mouseX + 100} ${mouseY}, ${startX - 100} ${startY}, ${startX} ${startY}`;
      }
      
      tempPath.setAttribute('d', pathData);
    };
    
    const upHandler = (e) => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      
      // Remove the temporary path
      if (tempPath && tempPath.parentNode) {
        tempPath.parentNode.removeChild(tempPath);
      }
      
      // Check if the mouse is over a compatible port
      const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
      const portElement = elementsUnderMouse.find(el => 
        el.classList && (el.classList.contains('node-port') || el.hasAttribute('data-port-type'))
      );
      
      if (portElement) {
        const targetNodeId = portElement.getAttribute('data-node-id');
        const targetPortType = portElement.getAttribute('data-port-type');
        const targetPortIndex = parseInt(portElement.getAttribute('data-port-index'), 10);
        
        // Prevent connecting to the same node
        if (targetNodeId && targetNodeId !== connectingNode) {
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

  // Get node color - Using consistent vibrant colors regardless of theme
  const getNodeColors = (nodeType, isSelected) => {
    const colors = {
      ringColor: '',
      bgColor: isSelected 
              ? (colorMode === 'dark' ? 'gray.700' : 'gray.50') 
              : (colorMode === 'dark' ? 'gray.800' : 'white'),
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
        className={`node ${isSelected ? 'node-selected' : ''}`}
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
              boxShadow: isSelected ? '0 0 8px rgba(0,188,255,0.5)' : 'none',
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
              fill={colorMode === 'dark' ? 'gray.700' : 'white'}
              stroke={getNodeColors(node.type).ringColor}
              strokeWidth="2"
              style={{
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
              fill={colorMode === 'dark' ? 'gray.700' : 'white'}
              stroke={getNodeColors(node.type).ringColor}
              strokeWidth="2"
              style={{
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
    const strokeColor = isHighlighted ? edgeHighlightColor : edgeColor;
    const strokeWidth = isHighlighted ? 2 : 1;
    
    return (
      <path
        key={edge.id}
        className={`edge-path ${isHighlighted ? 'edge-highlighted' : ''}`}
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill={edgeColor} />
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill={edgeHighlightColor} />
          </marker>
        </defs>
        <g ref={canvasRef}>
          {/* Grid (optional) */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="1"/>
          </pattern>
          <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid)" />
          
          {/* Render edges first so they're under the nodes */}
          <g className="edges">
            {edges.map(renderEdge)}
          </g>
          <g className="nodes">
            {nodes.map(renderNode)}
          </g>
        </g>
      </svg>
    </Box>
  );
};

export default FlowCanvas;