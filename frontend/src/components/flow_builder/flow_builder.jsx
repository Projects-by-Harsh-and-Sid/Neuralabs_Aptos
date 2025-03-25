
import React, { useState, useEffect, useRef ,useCallback} from 'react';
import { Flex, useColorMode, useColorModeValue, useToast, Box } from '@chakra-ui/react';
import { FiActivity, FiDatabase, FiSliders, FiExternalLink, FiRepeat, FiGitBranch } from 'react-icons/fi';

import NavPanel from '../common_components/NavPanel/NavelPanel';
import BlocksPanel from './BlocksPanel/BlocksPanel';
import FlowCanvas from './FlowCanvas/FlowCanvas';
import DetailsPanel from './DetailsPanel/DetailsPanel';
import TemplatePanel from './TemplatePanel/TemplatePanel';
import VisualizePanel from './VisualizePanel/VisualizePanel';
import CodePanel from './CodePanel/CodePanel';
import MarketplaceSidebar from '../marketplace/MarketplacePanel/MarketplaceSidebar';
import MarketplaceDetailPanel from '../marketplace/MarketplaceContent/MarketplaceDetailPanel';
import { beautifyFlow } from '../../utils/flowBeautifier';
import * as d3 from 'd3';
import { exportFlowAsPNG } from '../../utils/flowExport';
import {exportFlowAsJSON} from '../../utils/flowExportJson';
import {importFlowFromJSON} from '../../utils/flowImportJson';
import { nodeApi } from '../../utils/api';


import ICON_MAP from './Common/IconMap'

const FlowBuilder = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [isCustomScriptNode, setIsCustomScriptNode] = useState(false); // New state to track custom script node
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [customTemplates, setCustomTemplates] = useState([]);
  const [visualizePanelOpen, setVisualizePanelOpen] = useState(true); // Always visible now
  const [MarketplaceSidebarOpen, setMarketplaceSidebarOpen] = useState(false);
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState(null);
  
  // States for view-only mode and beautify mode
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [hideTextLabels, setHideTextLabels] = useState(false);
  const [previousState, setPreviousState] = useState({});
  
  // New states for beautify feature
  const [beautifyMode, setBeautifyMode] = useState(false);
  const [layerMap, setLayerMap] = useState({});
  const [originalNodePositions, setOriginalNodePositions] = useState({});
  const [availableLayers, setAvailableLayers] = useState([]);
  
  // Refs for d3 zoom behavior and canvas export
  const zoomBehaviorRef = useRef(null);
  const svgRef = useRef(null);
  const flowCanvasRef = useRef(null);
  
  const [nodeTypes, setNodeTypes] = useState({});
  const [nodeCategories, setNodeCategories] = useState([]);

  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        // Fetch node types
        const nodeTypesResponse = await nodeApi.getNodeTypes();
        
        // Transform the API response to include the actual icon components
        const transformedNodeTypes = {};
        Object.entries(nodeTypesResponse.data).forEach(([key, nodeType]) => {
          transformedNodeTypes[key] = {
            ...nodeType,
            icon: ICON_MAP[nodeType.icon] || "activity" // Default to FiActivity if icon not found
          };
        });
        
        setNodeTypes(transformedNodeTypes);
        console.log('Node types fetched:', transformedNodeTypes);
        
        // Fetch node categories
        const categoriesResponse = await nodeApi.getNodeCategories();
        console.log('Raw categories data:', categoriesResponse.data);
        setNodeCategories(categoriesResponse.data);
        
      } catch (err) {
        console.error('Error fetching node data:', err);
        // Fallback code if needed
      }
    };
    
    fetchNodeData();
  }, []);
  

  // Handle adding nodes
  const handleAddNode = (nodeType, position) => {
    if (viewOnlyMode) return null;
    
    const template = [...customTemplates, ...Object.keys(nodeTypes)].find(t => 
      t === nodeType || (typeof t === 'object' && t.type === nodeType)
    );
    
    // Define inputs and outputs based on the node type
    let inputs = [], outputs = [];
    
    if (typeof template === 'object') {
      inputs = template.inputs || [];
      outputs = template.outputs || [];
    } else {
      // Default inputs/outputs for built-in node types
      if (nodeType === 'data' || nodeType === 'chat-input' || nodeType === 'context-history' ||
          nodeType === 'datablocks' || nodeType === 'sql-database' || nodeType === 'rest-api') {
        outputs = [{ name: 'data', type: 'any' }];
      } else if (nodeType === 'task' || nodeType === 'custom-script' || nodeType === 'blockchain-read' ||
                nodeType === 'transaction-json' || nodeType === 'selector' || nodeType === 'merger' ||
                nodeType === 'random-generator' || nodeType === 'time') {
        inputs = [{ name: 'input', type: 'any' }];
        outputs = [{ name: 'output', type: 'any' }];
      } else if (nodeType === 'parameters') {
        outputs = [{ name: 'params', type: 'any' }];
      } else if (nodeType === 'start') {
        outputs = [{ name: 'start', type: 'any' }];
      } else if (nodeType === 'end') {
        inputs = [{ name: 'end', type: 'any' }];
      } else if (nodeType === 'case') {
        inputs = [{ name: 'condition', type: 'any' }];
        outputs = [
          { name: 'true', type: 'any' },
          { name: 'false', type: 'any' }
        ];
      } else if (nodeType === 'llm-free' || nodeType === 'llm-structured') {
        inputs = [{ name: 'prompt', type: 'any' }];
        outputs = [{ name: 'response', type: 'any' }];
      }
    }

    // Create initial code for custom script nodes
    let initialCode = '';
    if (nodeType === 'custom-script') {
      initialCode = `// Custom script for processing data
// This code will be executed when the node is processed

function processData(input) {
  // Your custom logic here
  console.log("Processing input:", input);
  
  // Example: transform the input data
  const output = {
    ...input,
    processed: true,
    timestamp: new Date().toISOString()
  };
  
  return output;
}

// Export the processing function
module.exports = processData;`;
    }
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      x: position.x,
      y: position.y,
      name: typeof template === 'object' ? template.name : `${nodeType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      inputs,
      outputs,
      layer: 0, // Default layer
      templateId: typeof template === 'object' ? template.id : null,
      code: initialCode // Add code property for custom script nodes
    };
    
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // If beautify mode is active, reapply beautify after adding a node
    if (beautifyMode) {
      applyBeautify(updatedNodes, edges);
    }

    // Automatically open appropriate panel based on node type
// Update the handleAddNode function to open both panels for custom script nodes
if (nodeType === 'custom-script') {
  setSelectedNode(newNode);
  setDetailsOpen(true); // Open details panel 
  setCodeOpen(false); // Open code panel
  setIsCustomScriptNode(true);
} else {
  // For all other node types, open details panel
  setSelectedNode(newNode);
  setDetailsOpen(true);
  setCodeOpen(false);
  setIsCustomScriptNode(false);
}
    
    return newNode;
  };

  const handleAddEdge = (source, target, sourcePort = 0, targetPort = 0) => {
    if (viewOnlyMode) return;
    
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
    const updatedEdges = [...edges, newEdge];
    setEdges(updatedEdges);
    
    // If beautify mode is active, reapply beautify after adding an edge
    if (beautifyMode) {
      applyBeautify(nodes, updatedEdges);
    }
  };

  // Handle node selection - modified to support view-only mode and custom script nodes
  const handleNodeSelect = (nodeId) => {
    if (nodeId === null) {
      setSelectedNode(null);
      setDetailsOpen(false);
      setCodeOpen(false);
      setIsCustomScriptNode(false);
      return;
    }
    
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node);
    
    // Special handling for custom script nodes
    if (node.type === 'custom-script') {
      setDetailsOpen(true); // Don't show details panel for custom script
      // setCodeOpen(true); // Show code panel instead
      setIsCustomScriptNode(true);
    } else {
      // For all other node types, show details panel
      setDetailsOpen(true);
      setCodeOpen(false);
      setIsCustomScriptNode(false);
    }
    
    // In view-only mode, we keep details panel open but don't allow editing
    if (!viewOnlyMode) {
      // Close template panel if it's open
      if (templateOpen) {
        setTemplateOpen(false);
        setEditingTemplate(null);
      }
    }
  };

  // Handle node update
  const handleUpdateNode = (nodeId, updates) => {
    if (viewOnlyMode) return;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
    
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, ...updates }));
    }
    
    // Update available layers when a node's layer changes
    if (updates.layer !== undefined) {
      updateAvailableLayers();
    }
  };

  // Handle saving code for a node
  const handleSaveCode = (nodeId, code) => {
    if (viewOnlyMode) return;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, code } : node
      )
    );
    
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, code }));
    }
    
    // Show success toast
    toast({
      title: "Code saved",
      description: "Your custom script has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Update available layers based on current nodes
  const updateAvailableLayers = () => {
    const layers = nodes.map(node => node.layer || 0);
    setAvailableLayers([...new Set(layers)]);
  };

  // Handle node position update
  const handleUpdateNodePosition = (nodeId, position) => {
    if (viewOnlyMode || beautifyMode) return;
    
    handleUpdateNode(nodeId, position);
  };

  // Handle node deletion
  const handleDeleteNode = (nodeId) => {
    if (viewOnlyMode) return;
    
    // Delete connected edges first
    const updatedEdges = edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    setEdges(updatedEdges);
    
    // Delete the node
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    setNodes(updatedNodes);
    
    setSelectedNode(null);
    setDetailsOpen(false);
    setCodeOpen(false);
    setIsCustomScriptNode(false);
    
    // If beautify mode is active, reapply beautify after deleting a node
    if (beautifyMode) {
      applyBeautify(updatedNodes, updatedEdges);
    }
    
    // Update available layers
    updateAvailableLayers();
  };

  // Handle template saving
  const handleSaveTemplate = (templateData) => {
    if (viewOnlyMode) return;
    
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
    
    // If beautify mode is active, reapply beautify
    if (beautifyMode) {
      applyBeautify(nodes, edges);
    }
  };
  
  // Handle template editing
  const handleEditTemplate = (templateId) => {
    if (viewOnlyMode) return;
    
    const template = customTemplates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(template);
      setTemplateOpen(true);
      setDetailsOpen(false);
    }
  };

  // Handle opening the template panel
  const handleOpenTemplatePanel = () => {
    if (viewOnlyMode) return;
    
    setEditingTemplate(null);
    setDetailsOpen(false);
    setTemplateOpen(true);
  };

  // Toggle code panel
  const toggleCodePanel = () => {
    if (viewOnlyMode) return;
    
    // If this is a custom script node, don't allow closing the code panel
    if (isCustomScriptNode && !codeOpen) {
      setCodeOpen(true);
      return;
    }
    
    setCodeOpen(!codeOpen);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // If we're in view-only mode and opening the sidebar, exit view-only mode
    if (viewOnlyMode && !sidebarOpen) {
      toggleViewOnlyMode();
    }
  };
  
  // Toggle marketplace panel
  const toggleMarketplaceSidebar = () => {
    if (viewOnlyMode) return;
    
    // If marketplace panel is being opened, close blocks panel
    if (!MarketplaceSidebarOpen) {
      setSidebarOpen(false);
    } else {
      // If we're closing the marketplace panel, also close the detail panel
      setSelectedMarketplaceItem(null); // Close marketplace detail panel
    }
    setMarketplaceSidebarOpen(!MarketplaceSidebarOpen);
  };

  // Handle marketplace item selection
  const handleSelectMarketplaceItem = (item) => {
    if (viewOnlyMode) return;
    setSelectedMarketplaceItem(item);
  };
  
  // Close marketplace detail panel
  const closeMarketplaceDetailPanel = () => {
    setSelectedMarketplaceItem(null);
  };

  // Update the handleCloseDetailsPanel function
  const handleCloseDetailsPanel = () => {
    setDetailsOpen(false);
    
    // Only close code panel if it's not a custom script node
    if (codeOpen && !isCustomScriptNode) {
      setCodeOpen(false);
    }
  };
  
  // Update the handleCloseCodePanel function
  const handleCloseCodePanel = () => {
    // For custom script nodes, closing code panel should also deselect the node
    if (isCustomScriptNode) {
      setSelectedNode(null);
      setCodeOpen(false);
      setIsCustomScriptNode(false);
    } else {
      // For regular nodes, just close the code panel
      setCodeOpen(false);
    }
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    setScale(prevScale => {
      const newScale = Math.min(prevScale + 0.1, 4);
      return newScale;
    });
  };
  
  const handleZoomOut = () => {
    setScale(prevScale => {
      const newScale = Math.max(prevScale - 0.1, 0.8);
      return newScale;
    });
  };
  
  const handleFitView = () => {
    // Reset the view using d3 if the ref exists
    if (zoomBehaviorRef.current && nodes.length > 0) {
      centerFlow();
    } else {
      // Default reset if no nodes
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      
      if (zoomBehaviorRef.current) {
        const svg = d3.select(svgRef.current);
        svg.transition().duration(300).call(
          zoomBehaviorRef.current.transform, 
          d3.zoomIdentity.translate(0, 0).scale(1)
        );
      }
    }
  };

  // Function to toggle view-only mode and beautify mode together
  const toggleViewOnlyMode = () => {
    if (!viewOnlyMode) {
      // Entering view-only mode
      setPreviousState({
        sidebarOpen,
        detailsOpen,
        templateOpen,
        codeOpen,
        MarketplaceSidebarOpen,
        selectedMarketplaceItem: selectedMarketplaceItem !== null,
        positions: nodes.reduce((acc, node) => {
          acc[node.id] = { x: node.x, y: node.y };
          return acc;
        }, {})
      });
      
      // Close sidebar
      // setSidebarOpen(false);
      
      // We don't close details panel anymore, but we do close other panels
      setTemplateOpen(false);
      setCodeOpen(false);
      setMarketplaceSidebarOpen(false);
      setSelectedMarketplaceItem(null);
      
      // Apply beautify if not already applied
      if (!beautifyMode) {
        // Save original positions before beautifying
        saveOriginalPositions();
        setBeautifyMode(true);
        applyBeautify(nodes, edges);
      }
      
      // Center the flow
      centerFlow();
      
      setViewOnlyMode(true);
      
      // Notification
      toast({
        title: "View-only mode enabled",
        description: "Node editing is disabled. Flow is beautifully arranged.",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
    } else {
      // Exiting view-only mode
      if (beautifyMode) {
        // Restore original positions
        restoreOriginalPositions();
        setBeautifyMode(false);
      }
      
      // Restore previous state except for details panel which we handle separately
      setSidebarOpen(previousState.sidebarOpen);
      setTemplateOpen(previousState.templateOpen);
      setCodeOpen(previousState.codeOpen);
      setMarketplaceSidebarOpen(previousState.MarketplaceSidebarOpen);
      
      setViewOnlyMode(false);
      
      // Notification
      toast({
        title: "View-only mode disabled",
        description: "All controls are now active.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  // Toggle hide text labels feature
  const toggleHideTextLabels = () => {
    setHideTextLabels(prev => !prev);
  };
  
  // Save original positions before beautifying
  const saveOriginalPositions = () => {
    const positions = {};
    nodes.forEach(node => {
      positions[node.id] = { x: node.x, y: node.y };
    });
    setOriginalNodePositions(positions);
  };
  
  // Restore original positions when exiting beautify mode
  const restoreOriginalPositions = () => {
    if (Object.keys(originalNodePositions).length === 0) return;
    
    const restoredNodes = nodes.map(node => {
      const originalPos = originalNodePositions[node.id];
      if (originalPos) {
        return { ...node, x: originalPos.x, y: originalPos.y };
      }
      return node;
    });
    
    setNodes(restoredNodes);
    setLayerMap({});
  };
  
  // Apply beautify layout
  const applyBeautify = (currentNodes, currentEdges) => {
    if (!currentNodes.length) return;
    
    const { nodes: beautifiedNodes, layerMap: newLayerMap } = beautifyFlow(currentNodes, currentEdges);
    
    // Update nodes with new positions
    setNodes(beautifiedNodes);
    
    // Store layer map for UI display
    setLayerMap(newLayerMap);
    
    // Center the flow
    setTimeout(centerFlow, 100);
  };
  
  // Center the flow in the viewport
  const centerFlow = () => {
    if (nodes.length === 0) return;
    
    // Calculate the bounding box of all nodes
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.x - 100);
      maxX = Math.max(maxX, node.x + 100);
      minY = Math.min(minY, node.y - 100);
      maxY = Math.max(maxY, node.y + 100);
    });
    
    // Add some padding
    const padding = 100;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;
    
    // Calculate the center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Get SVG dimensions
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;
    
    // Calculate the new translate values to center the flow
    const newTranslateX = svgWidth / 2 - centerX * scale;
    const newTranslateY = svgHeight / 2 - centerY * scale;
    
    // Use d3 for smooth transition
    if (zoomBehaviorRef.current) {
      const svg = d3.select(svgElement);
      svg.transition().duration(500).call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(newTranslateX, newTranslateY).scale(scale)
      );
    } else {
      // Fallback
      setTranslate({
        x: newTranslateX,
        y: newTranslateY
      });
    }
  };
  
  // Handle node click from layer view in pipeline section
  const handleLayerNodeClick = (nodeId) => {
    // Find the node
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Select the node
    handleNodeSelect(nodeId);
    
    // Center on the node
    const svgElement = svgRef.current;
    if (!svgElement || !zoomBehaviorRef.current) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;
    
    // Calculate the new translate values to center on the node
    const newTranslateX = svgWidth / 2 - node.x * scale;
    const newTranslateY = svgHeight / 2 - node.y * scale;
    
    // Use d3 for smooth transition
    const svg = d3.select(svgElement);
    svg.transition().duration(500).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(newTranslateX, newTranslateY).scale(scale)
    );
  };
  
  // Update available layers when nodes change
  const exportFlow = () => {
    exportFlowAsPNG(nodes, edges, selectedNode, colorMode)
      .then(dataUrl => {
        // Create download link
        const link = document.createElement('a');
        link.download = `flow-export-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Export Successful",
          description: "Flow diagram has been exported as a PNG image.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: "Export Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const exportFlowJSON = () => {
    exportFlowAsJSON(nodes, edges)
      .then(({ data, url, filename }) => {
        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        
        toast({
          title: "Export Successful",
          description: "Flow diagram has been exported as JSON.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: "Export Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }

  const importImportFlow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const jsonData = JSON.parse(text);
          await importFlowFromJSON(jsonData, setNodes, setEdges);
        } catch (error) {
          console.error("Import failed:", error);
          alert("Failed to import flow: " + error.message);
        }
      }
    };

    input.click();
  }, []);

  

  
  useEffect(() => {
    updateAvailableLayers();
  }, [nodes]);

  return (
    <Flex h="100%" w="100%" overflow="hidden">
      {sidebarOpen && !MarketplaceSidebarOpen && (
        <BlocksPanel 
          onAddNode={handleAddNode}
          onOpenTemplate={handleOpenTemplatePanel}
          customTemplates={customTemplates}
          onEditTemplate={handleEditTemplate}
          layerMap={layerMap}
          beautifyMode={beautifyMode}
          onNodeClick={handleLayerNodeClick}
          nodeTypes={nodeTypes} // Pass the nodeTypes as a prop
          nodeCategories={nodeCategories} // Pass the new categories prop
        />
      )}

      {MarketplaceSidebarOpen && !viewOnlyMode && (
        <MarketplaceSidebar 
          onClose={toggleMarketplaceSidebar}
          onSelectItem={handleSelectMarketplaceItem}
        />
      )}
      
      {/* Visualize panel is always visible */}
      <VisualizePanel 
        hideTextLabels={hideTextLabels}
        onToggleHideTextLabels={toggleHideTextLabels}
        viewOnlyMode={viewOnlyMode}
        onToggleViewOnlyMode={toggleViewOnlyMode}
        zoomLevel={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onToggleOrientation={() => {}}
        onScreenshot={() => {}}
        onExportFlow={exportFlow}
        onExportFlowJSON={exportFlowJSON}
        onImportFlow={importImportFlow}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <Flex position="relative" flex="1" h="100%" overflow="hidden" ref={flowCanvasRef}>
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
          svgRef={svgRef}
          leftPanelOpen={sidebarOpen}
          leftPanelWidth={320} // Adjusted to match actual sidebar width
          rightPanelOpen={detailsOpen || templateOpen || MarketplaceSidebarOpen}
          rightPanelWidth={detailsOpen ? 384 : (templateOpen ? 384 : 320)} // Adjusted based on which panel is open
          detailsPanelOpen={detailsOpen}
          detailsPanelWidth={384} // Adjusted to match actual details panel width
          hideTextLabels={hideTextLabels}
          viewOnlyMode={viewOnlyMode}
          nodeTypes={nodeTypes} // Pass the nodeTypes prop
          onImportFlow={importImportFlow}
        />
      </Flex>
      
      {/* Add marketplace detail panel */}
      {selectedMarketplaceItem && !viewOnlyMode && (
        <MarketplaceDetailPanel 
          item={selectedMarketplaceItem}
          onClose={closeMarketplaceDetailPanel}
        />
      )}
      
      {/* Updated CodePanel with isCustomScript prop */}
      {codeOpen && (
        <CodePanel 
          node={selectedNode} 
          template={editingTemplate} 
          isTemplate={!!templateOpen}
          onClose={handleCloseCodePanel}
          onSaveCode={handleSaveCode}
          sidebarOpen={sidebarOpen}
          isCustomScript={isCustomScriptNode}
        />
      )}
      
      {/* Details panel with view-only mode handled internally */}
      {detailsOpen && selectedNode && (
        <DetailsPanel 
          selectedNode={selectedNode}
          onClose={handleCloseDetailsPanel}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onToggleCode={toggleCodePanel}
          codeOpen={codeOpen}
          viewOnlyMode={viewOnlyMode}
          availableLayers={availableLayers}
        />
      )}
      
      {templateOpen && !viewOnlyMode && (
        <TemplatePanel 
          template={editingTemplate}
          onClose={() => {
            setTemplateOpen(false);
            setEditingTemplate(null);
            // Also close code panel if it's open
            if (codeOpen) {
              setCodeOpen(false);
            }
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