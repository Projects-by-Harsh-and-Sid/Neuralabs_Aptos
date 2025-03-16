// src/components/FlowCanvas/FlowCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './FlowCanvas.scss';

const FlowCanvas = ({ 
  nodes, 
  edges, 
  onAddNode, 
  onAddEdge, 
  onSelectNode, 
  selectedNode 
}) => {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [connectingNode, setConnectingNode] = useState(null);
  const [connectingPath, setConnectingPath] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    svg.node().addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });
    
    svg.node().addEventListener('drop', (e) => {
      e.preventDefault();
      
      const nodeType = e.dataTransfer.getData('nodeType');
      if (nodeType) {
        // Calculate the position with respect to the canvas transform
        const svgRect = svg.node().getBoundingClientRect();
        const x = (e.clientX - svgRect.left - translate.x) / scale;
        const y = (e.clientY - svgRect.top - translate.y) / scale;
        
        onAddNode(nodeType, { x, y });
      }
    });
    
    return () => {
      // Clean up event listeners
      svg.on('.zoom', null);
    };
  }, [onAddNode, scale, translate]);

  // Handle node dragging
  const startNodeDrag = (e, nodeId) => {
    if (e.button !== 0) return; // Only left mouse button
    
    e.stopPropagation();
    setDragging(true);
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    
    // Find the node
    const nodeElement = svg.querySelector(`[data-node-id="${nodeId}"]`);
    const nodeData = nodes.find(n => n.id === nodeId);
    
    // Get the starting position
    let startPos = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Get the current node position
    let currentPos = {
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
      
      // Update the node element position
      nodeElement.setAttribute('transform', `translate(${newX}, ${newY})`);
      
      // Update the connected edges
      edges.forEach((edge) => {
        if (edge.source === nodeId || edge.target === nodeId) {
          updateEdgePath(edge);
        }
      });
    };
    
    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      setDragging(false);
      
      // Update the node position in the state
      // This would be handled by the parent component
      const newX = currentPos.x + (e.clientX - startPos.x) / scale;
      const newY = currentPos.y + (e.clientY - startPos.y) / scale;
      
      // Here you would update the node position in the state
      // onUpdateNodePosition(nodeId, { x: newX, y: newY });
    };
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };

  // Start connecting two nodes
  const startConnectingNodes = (e, nodeId) => {
    if (e.button !== 0) return; // Only left mouse button
    
    e.stopPropagation();
    setConnectingNode(nodeId);
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    
    // Find the node
    const nodeElement = svg.querySelector(`[data-node-id="${nodeId}"]`);
    const nodeData = nodes.find(n => n.id === nodeId);
    
    // Create a temporary path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'flow-canvas__edge-path--connecting');
    path.setAttribute('stroke', 'var(--edge-stroke)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    
    // Add the path to the canvas
    canvasRef.current.appendChild(path);
    setConnectingPath(path);
    
    // Get the starting position
    const startX = nodeData.x;
    const startY = nodeData.y;
    
    // Update the path as the mouse moves
    const moveHandler = (e) => {
      // Calculate the mouse position with respect to the canvas transform
      const x = (e.clientX - svgRect.left - translate.x) / scale;
      const y = (e.clientY - svgRect.top - translate.y) / scale;
      
      // Update the mouse position state
      setMousePosition({ x, y });
      
      // Create a smooth bezier curve
      const path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${x - 100} ${y}, ${x} ${y}`;
      connectingPath.setAttribute('d', path);
    };
    
    const upHandler = (e) => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      
      // Remove the temporary path
      if (connectingPath) {
        connectingPath.remove();
      }
      
      // Check if the mouse is over a node
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const targetNodeElement = targetElement?.closest('[data-node-id]');
      
      if (targetNodeElement) {
        const targetNodeId = targetNodeElement.getAttribute('data-node-id');
        
        // Prevent connecting to the same node
        if (targetNodeId !== connectingNode) {
          onAddEdge(connectingNode, targetNodeId);
        }
      }
      
      setConnectingNode(null);
      setConnectingPath(null);
    };
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };

  // Update the edge path
  const updateEdgePath = (edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Create a smooth bezier curve
    const path = `M ${sourceNode.x} ${sourceNode.y} C ${sourceNode.x + 100} ${sourceNode.y}, ${targetNode.x - 100} ${targetNode.y}, ${targetNode.x} ${targetNode.y}`;
    
    // Update the edge element
    const edgeElement = svgRef.current.querySelector(`[data-edge-id="${edge.id}"]`);
    if (edgeElement) {
      edgeElement.setAttribute('d', path);
    }
  };

  // Render node
  const renderNode = (node) => {
    const nodeType = node.type;
    const isSelected = selectedNode && selectedNode.id === node.id;
    
    // Define colors based on node type
    const colors = {
      data: {
        fill: 'var(--node-fill-default)',
        stroke: '#00bcff',
        icon: '#00bcff'
      },
      task: {
        fill: 'var(--node-fill-default)',
        stroke: '#31e27b',
        icon: '#31e27b'
      },
      parameters: {
        fill: 'var(--node-fill-default)',
        stroke: '#a000bc',
        icon: '#a000bc'
      }
    };
    
    const nodeColor = colors[nodeType] || colors.data;
    
    return (
      <g
        key={node.id}
        className={`flow-canvas__node ${isSelected ? 'flow-canvas__node--selected' : ''}`}
        transform={`translate(${node.x}, ${node.y})`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        }}
        onMouseDown={(e) => startNodeDrag(e, node.id)}
        data-node-id={node.id}
      >
        {/* Node shape */}
        <rect
          x="-60"
          y="-30"
          width="120"
          height="60"
          rx="5"
          ry="5"
          fill={isSelected ? 'var(--node-fill-selected)' : nodeColor.fill}
          stroke={isSelected ? 'var(--node-stroke-selected)' : nodeColor.stroke}
          strokeWidth="2"
        />
        
        {/* Node label */}
        <text
          y="5"
          textAnchor="middle"
          fontSize="14"
          fontWeight="500"
          fill="var(--color-text)"
        >
          {node.name}
        </text>
        
        {/* Connection point */}
        <circle
          cx="0"
          cy="-30"
          r="6"
          fill={nodeColor.icon}
          className="flow-canvas__node-connector flow-canvas__node-connector--input"
        />
        
        <circle
          cx="0"
          cy="30"
          r="6"
          fill={nodeColor.icon}
          className="flow-canvas__node-connector flow-canvas__node-connector--output"
          onMouseDown={(e) => startConnectingNodes(e, node.id)}
        />
      </g>
    );
  };

  // Render edge
  const renderEdge = (edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    // Create a smooth bezier curve
    const path = `M ${sourceNode.x} ${sourceNode.y + 30} C ${sourceNode.x} ${sourceNode.y + 100}, ${targetNode.x} ${targetNode.y - 100}, ${targetNode.x} ${targetNode.y - 30}`;
    
    return (
      <path
        key={edge.id}
        className="flow-canvas__edge-path"
        d={path}
        stroke="var(--edge-stroke)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrow)"
        data-edge-id={edge.id}
      />
    );
  };

  return (
    <div className="flow-canvas">
      <svg
        ref={svgRef}
        className="flow-canvas__svg"
        onClick={() => onSelectNode(null)}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-arrowhead-fill)" />
          </marker>
        </defs>
        <g ref={canvasRef} className="flow-canvas__container">
          {/* Render edges first so they're under the nodes */}
          <g className="flow-canvas__edges">
            {edges.map(renderEdge)}
          </g>
          <g className="flow-canvas__nodes">
            {nodes.map(renderNode)}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default FlowCanvas;