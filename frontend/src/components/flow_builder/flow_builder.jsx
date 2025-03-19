// src/components/flow_builder/flow_builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Flex, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FiDatabase, FiActivity, FiSliders } from 'react-icons/fi';
import NavPanel from './NavPanel/NavPanel';
import BlocksPanel from './BlocksPanel/BlocksPanel';
import CanvasControls from './CanvasControls/CanvasControls';
import FlowCanvas from './FlowCanvas/FlowCanvas';
import DetailsPanel from './DetailsPanel/DetailsPanel';
import TemplatePanel from './TemplatePanel/TemplatePanel';
import VisualizePanel from './VisualizePanel/VisualizePanel';
import CodePanel from './CodePanel/CodePanel';

import * as d3 from 'd3';

// Define node types with colors and icons
const NODE_TYPES = {
  data: {
    name: 'Data',
    icon: FiDatabase,
    color: 'blue.500',
  },
  task: {
    name: 'Task',
    icon: FiActivity,
    color: 'green.500',
  },
  parameters: {
    name: 'Parameters',
    icon: FiSliders,
    color: 'purple.500',
  },
};

const FlowBuilder = () => {
  const { colorMode } = useColorMode();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [customTemplates, setCustomTemplates] = useState([]);
  const [visualizePanelOpen, setVisualizePanelOpen] = useState(false);
  
  // Refs for d3 zoom behavior
  const zoomBehaviorRef = useRef(null);
  
  // Handle adding nodes
  const handleAddNode = (nodeType, position) => {
    const template = [...customTemplates, ...Object.keys(NODE_TYPES)].find(t => 
      t === nodeType || (typeof t === 'object' && t.type === nodeType)
    );
    
    // Define inputs and outputs based on the node type
    let inputs = [], outputs = [];
    
    if (typeof template === 'object') {
      inputs = template.inputs || [];
      outputs = template.outputs || [];
    } else {
      // Default inputs/outputs for built-in node types
      if (nodeType === 'data') {
        outputs = [{ name: 'data', type: 'any' }];
      } else if (nodeType === 'task') {
        inputs = [{ name: 'input', type: 'any' }];
        outputs = [{ name: 'output', type: 'any' }];
      } else if (nodeType === 'parameters') {
        outputs = [{ name: 'params', type: 'any' }];
      }
    }
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      x: position.x,
      y: position.y,
      name: typeof template === 'object' ? template.name : `${nodeType}_${nodes.length + 1}`,
      inputs,
      outputs,
      templateId: typeof template === 'object' ? template.id : null
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    return newNode;
  };

  // // Handle adding edges
  // const handleAddEdge = (sourceId, targetId, sourcePort = 0, targetPort = 0) => {
  //   const newEdge = {
  //     id: `edge-${Date.now()}`,
  //     source: sourceId,
  //     target: targetId,
  //     sourcePort,
  //     targetPort
  //   };
    
  //   setEdges(prevEdges => [...prevEdges, newEdge]);
  // };

  const handleAddEdge = (source, target, sourcePort = 0, targetPort = 0) => {
    // First check if this connection already exists
    const connectionExists = edges.some(edge => 
      edge.source === source && 
      edge.target === target && 
      edge.sourcePort === sourcePort && 
      edge.targetPort === targetPort
    );
    
    if (connectionExists) {
      console.log("Connection already exists");
      return;
    }
    
    // Create a new unique ID for the edge
    const newEdge = {
      id: `edge-${Date.now()}`,
      source,
      target,
      sourcePort,
      targetPort
    };
    
    // Update the edges state
    console.log("Adding new edge:", newEdge);
    setEdges(prevEdges => [...prevEdges, newEdge]);
  };

  // Handle node selection
  const handleNodeSelect = (nodeId) => {
    if (nodeId === null) {
      setSelectedNode(null);
      setDetailsOpen(false);
    } else {
      const node = nodes.find(n => n.id === nodeId);
      setSelectedNode(node);
      setDetailsOpen(true);
      // Close template panel if it's open
      if (templateOpen) {
        setTemplateOpen(false);
        setEditingTemplate(null);
      }
      setCodeOpen(false);
    }
  };

  // Handle node update
  const handleUpdateNode = (nodeId, updates) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
    
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, ...updates }));
    }
  };

  // Handle node position update
  const handleUpdateNodePosition = (nodeId, position) => {
    handleUpdateNode(nodeId, position);
  };

  // Handle node deletion
  const handleDeleteNode = (nodeId) => {
    // Delete connected edges first
    setEdges(prevEdges => 
      prevEdges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      )
    );
    
    // Delete the node
    setNodes(prevNodes => 
      prevNodes.filter(node => node.id !== nodeId)
    );
    
    setSelectedNode(null);
  };

  // Handle template saving
  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setCustomTemplates(prev => 
        prev.map(template => 
          template.id === editingTemplate.id 
            ? { ...template, ...templateData, id: editingTemplate.id } 
            : template
        )
      );
      
      // Update nodes that use this template
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.templateId === editingTemplate.id 
            ? { ...node, name: templateData.name } 
            : node
        )
      );
      
      setEditingTemplate(null);
    } else {
      // Create new template
      const newTemplate = {
        ...templateData,
        id: `template-${Date.now()}`
      };
      setCustomTemplates(prev => [...prev, newTemplate]);
    }
    
    setTemplateOpen(false);
  };
  
  // Handle template editing
  const handleEditTemplate = (templateId) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(template);
      setTemplateOpen(true);
      setDetailsOpen(false);
    }
  };

  // Handle opening the template panel
  const handleOpenTemplatePanel = () => {
    setEditingTemplate(null);
    setDetailsOpen(false);
    setTemplateOpen(true);
  };

  // Toggle code panel
  const toggleCodePanel = () => {
    setCodeOpen(!codeOpen);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle visualize panel
  const toggleVisualizePanel = () => {
    setVisualizePanelOpen(!visualizePanelOpen);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 4));
    
    // Apply the zoom using d3 if the ref exists
    if (zoomBehaviorRef.current) {
      const svg = d3.select('svg');
      zoomBehaviorRef.current.scaleBy(svg.transition().duration(300), 1.1);
    }
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
    
    // Apply the zoom using d3 if the ref exists
    if (zoomBehaviorRef.current) {
      const svg = d3.select('svg');
      zoomBehaviorRef.current.scaleBy(svg.transition().duration(300), 0.9);
    }
  };

  const handleFitView = () => {
    // In a real implementation, this would calculate the appropriate
    // zoom level to fit all nodes in view
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    
    // Reset the view using d3 if the ref exists
    if (zoomBehaviorRef.current) {
      const svg = d3.select('svg');
      svg.transition().duration(300).call(
        zoomBehaviorRef.current.transform, 
        d3.zoomIdentity.translate(0, 0).scale(1)
      );
    }
  };

  return (
    <Flex h="100%" w="100%" overflow="hidden">
      <NavPanel 
        toggleSidebar={toggleSidebar}
        toggleVisualizePanel={toggleVisualizePanel}
      />
      
      {sidebarOpen && (
        <BlocksPanel 
          onAddNode={handleAddNode}
          onOpenTemplate={handleOpenTemplatePanel}
          customTemplates={customTemplates}
          onEditTemplate={handleEditTemplate}
        />
      )}
      
      {visualizePanelOpen && (
        <VisualizePanel />
      )}
      
      <Flex position="relative" flex="1" h="100%" overflow="hidden">
        <FlowCanvas 
          nodes={nodes}
          edges={edges}
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onSelectNode={handleNodeSelect}
          selectedNode={selectedNode}
          onUpdateNodePosition={handleUpdateNodePosition}
          scale={scale}
          translate={translate}
          setScale={setScale}
          setTranslate={setTranslate}
          zoomBehaviorRef={zoomBehaviorRef}
        />
        
        <CanvasControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onToggleOrientation={() => {}}
          onScreenshot={() => {}}
          zoomLevel={scale}
        />
      </Flex>
      
      {codeOpen && (
        <CodePanel 
          node={selectedNode} 
          template={editingTemplate} 
          isTemplate={!!templateOpen}
          onClose={() => setCodeOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      )}
      
      {detailsOpen && selectedNode && (
        <DetailsPanel 
          selectedNode={selectedNode}
          onClose={() => setDetailsOpen(false)}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onToggleCode={toggleCodePanel}
          codeOpen={codeOpen}
        />
      )}
      
      {templateOpen && (
        <TemplatePanel 
          template={editingTemplate}
          onClose={() => {
            setTemplateOpen(false);
            setEditingTemplate(null);
          }}
          onSaveTemplate={handleSaveTemplate}
          onToggleCode={toggleCodePanel}
          codeOpen={codeOpen}
        />
      )}
    </Flex>
  );
};

export default FlowBuilder;