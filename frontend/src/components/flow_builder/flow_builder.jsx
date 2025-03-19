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
import MarketplacePanel from './MarketplacePanel/MarketplacePanel';
import MarketplaceDetailPanel from './MarketplacePanel/MarketplaceDetailPanel';
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
  const [marketplacePanelOpen, setMarketplacePanelOpen] = useState(false);
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState(null);
  
  // Refs for d3 zoom behavior
  const zoomBehaviorRef = useRef(null);
  const svgRef = useRef(null); // Add this line to create the svgRef
  
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
// Update the toggleSidebar function to close the marketplace panel when opening the sidebar
const toggleSidebar = () => {
  // If sidebar is currently closed and we're opening it
  if (!sidebarOpen) {
    // Close marketplace panel if it's open
    if (marketplacePanelOpen) {
      setMarketplacePanelOpen(false);
    }
    // Close marketplace detail panel if it's open
    if (selectedMarketplaceItem) {
      setSelectedMarketplaceItem(null);
    }
    // Open the sidebar
    setSidebarOpen(true);
  } else {
    // Just toggle the sidebar if we're closing it
    setSidebarOpen(false);
  }
};
  // Toggle visualize panel
  const toggleVisualizePanel = () => {
    setVisualizePanelOpen(!visualizePanelOpen);
  };

  const toggleMarketplacePanel = () => {
    // If marketplace panel is being opened, close blocks panel
    if (!marketplacePanelOpen) {
      setSidebarOpen(false);
    } else {
      // If we're closing the marketplace panel, also close the detail panel
      setSelectedMarketplaceItem(null); // Close marketplace detail panel
    }
    setMarketplacePanelOpen(!marketplacePanelOpen);
  };


  // Handle marketplace item selection
  const handleSelectMarketplaceItem = (item) => {
    setSelectedMarketplaceItem(item);
  };
  
  // Close marketplace detail panel
  const closeMarketplaceDetailPanel = () => {
    setSelectedMarketplaceItem(null);
  };

  const handleCloseDetailsPanel = () => {
    setDetailsOpen(false);
    // Close code panel if it's open
    if (codeOpen) {
      setCodeOpen(false);
    }
  };
  

  // // Zoom controls
  // const handleZoomIn = () => {
  //   setScale(prev => Math.min(prev + 0.1, 4));
    
  //   // Apply the zoom using d3 if the ref exists
  //   if (zoomBehaviorRef.current) {
  //     const svg = d3.select('svg');
  //     zoomBehaviorRef.current.scaleBy(svg.transition().duration(300), 1.1);
  //   }
  // };

  // const handleZoomIn = () => {
  //   // Log the current scale
  //   console.log("Zooming in from:", scale);
    
  //   // Update the scale in state
  //   setScale(prev => {
  //     const newScale = Math.min(prev + 0.1, 4); // Max zoom 400%
  //     console.log("New scale:", newScale);
  //     return newScale;
  //   });
    
  //   // Apply the zoom using d3 if the ref exists
  //   if (zoomBehaviorRef.current) {
  //     try {
  //       const svg = d3.select(svgRef.current);
  //       zoomBehaviorRef.current.scaleBy(svg.transition().duration(300), 1.2);
  //       console.log("D3 zoom applied");
  //     } catch (e) {
  //       console.error("Error applying d3 zoom:", e);
  //     }
  //   } else {
  //     console.warn("Zoom behavior ref not available");
  //   }
  // };

  const handleZoomIn = () => {
    setScale(prevScale => {
      const newScale = Math.min(prevScale + 0.1, 4);
      console.log("New scale:", newScale);
      return newScale;
    });
  };
  

  // const handleZoomOut = () => {
  //   setScale(prev => Math.max(prev - 0.1, 0.1));
    
  //   // Apply the zoom using d3 if the ref exists
  //   if (zoomBehaviorRef.current) {
  //     const svg = d3.select('svg');
  //     zoomBehaviorRef.current.scaleBy(svg.transition().duration(300), 0.9);
  //   }
  // };
  const handleZoomOut = () => {
    setScale(prevScale => {
      const newScale = Math.max(prevScale - 0.1, 0.8);
      console.log("New scale:", newScale);
      return newScale;
    });
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
        toggleMarketplacePanel={toggleMarketplacePanel}
        sidebarOpen={sidebarOpen}
        visualizePanelOpen={visualizePanelOpen}
        marketplacePanelOpen={marketplacePanelOpen}
      />
      
      {/* Conditionally render either sidebar or marketplace panel */}
      {sidebarOpen && !marketplacePanelOpen && (
        <BlocksPanel 
          onAddNode={handleAddNode}
          onOpenTemplate={handleOpenTemplatePanel}
          customTemplates={customTemplates}
          onEditTemplate={handleEditTemplate}
        />
      )}
      
      {/* Add marketplace panel */}
      {marketplacePanelOpen && (
        <MarketplacePanel 
          onClose={toggleMarketplacePanel}
          onSelectItem={handleSelectMarketplaceItem}
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
          leftPanelOpen={sidebarOpen}
          leftPanelWidth={280} // Adjust based on your actual sidebar width
          rightPanelOpen={detailsOpen || templateOpen || marketplacePanelOpen}
          rightPanelWidth={detailsOpen ? 350 : (templateOpen ? 400 : 300)} // Adjust based on which panel is open
          detailsPanelOpen={detailsOpen}
          detailsPanelWidth={350} // Adjust to match your actual details panel width
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
      
      {/* Add marketplace detail panel */}
      {selectedMarketplaceItem && (
        <MarketplaceDetailPanel 
          item={selectedMarketplaceItem}
          onClose={closeMarketplaceDetailPanel}
        />
      )}
      
      {codeOpen && (
        <CodePanel 
          node={selectedNode} 
          template={editingTemplate} 
          isTemplate={!!templateOpen}
          onClose={() => setCodeOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      )}
      
      {/* Rest of the existing panels */}
      {detailsOpen && selectedNode && (
      <DetailsPanel 
        selectedNode={selectedNode}
        onClose={handleCloseDetailsPanel}
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