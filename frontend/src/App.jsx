// src/App.js
import React, { useState } from 'react';
import NavPanel from './components/NavPanel/NavPanel';
import BlocksPanel from './components/BlocksPanel/BlocksPanel';
import CanvasControls from './components/CanvasControls/CanvasControls';
import FlowCanvas from './components/FlowCanvas/FlowCanvas';
import DetailsPanel from './components/DetailsPanel/DetailsPanel';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.scss';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const handleAddNode = (nodeType, position) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      x: position.x,
      y: position.y,
      name: `${nodeType}_${nodes.length + 1}`,
    };
    setNodes([...nodes, newNode]);
    return newNode;
  };

  const handleAddEdge = (sourceId, targetId) => {
    const newEdge = {
      id: `edge-${Date.now()}`,
      source: sourceId,
      target: targetId,
    };
    setEdges([...edges, newEdge]);
  };

  const handleNodeSelect = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <div className={`app kui-theme--${theme}`}>
        <NavPanel toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
        
        {sidebarOpen && (
          <BlocksPanel 
            onAddNode={handleAddNode}
          />
        )}
        
        <CanvasControls />
        
        <FlowCanvas 
          nodes={nodes}
          edges={edges}
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onSelectNode={handleNodeSelect}
          selectedNode={selectedNode}
        />
        
        {detailsOpen && (
          <DetailsPanel 
            selectedNode={selectedNode}
            onClose={() => setDetailsOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;