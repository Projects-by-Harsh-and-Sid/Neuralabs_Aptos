// src/components/BlocksPanel/BlocksPanel.js
import React, { useState } from 'react';
import './BlocksPanel.scss';

// Make NODE_TYPES available for styling
const variables = {
  "$blue-300": "#00bcff",
  "$green-300": "#31e27b",
  "$purple-300": "#a000bc",
};

// Node types and their templates
const NODE_TYPES = {
  data: {
    name: 'Data',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.6569 16.9706 22 12 22C7.02944 22 3 20.6569 3 19V5M21 12C21 13.6569 16.9706 15 12 15C7.02944 15 3 13.6569 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: variables.$blue-300,
  },
  task: {
    name: 'Task',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: variables.$green-300,
  },
  parameters: {
    name: 'Parameters',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: variables.$purple-300,
  },
};

const BlocksPanel = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('blocks');

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredNodeTypes = Object.entries(NODE_TYPES).filter(([key, nodeType]) => 
    nodeType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blocks-panel">
      <div className="blocks-panel__header">
        <h1 className="blocks-panel__title">Flow Designer</h1>
        <div className="blocks-panel__search">
          <input 
            type="text" 
            placeholder="Search blocks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blocks-panel__search-input"
          />
          <button className="blocks-panel__search-clear" onClick={() => setSearchTerm('')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="blocks-panel__tabs">
        <button 
          className={`blocks-panel__tab ${activeTab === 'blocks' ? 'blocks-panel__tab--active' : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocks
        </button>
        <button 
          className={`blocks-panel__tab ${activeTab === 'pipelines' ? 'blocks-panel__tab--active' : ''}`}
          onClick={() => setActiveTab('pipelines')}
        >
          Pipelines
        </button>
      </div>

      <div className="blocks-panel__content">
        {activeTab === 'blocks' && (
          <div className="blocks-panel__blocks">
            <h2 className="blocks-panel__subtitle">Node Types</h2>
            <div className="blocks-panel__items">
              {filteredNodeTypes.map(([key, nodeType]) => (
                <div 
                  key={key}
                  className="blocks-panel__item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, key)}
                >
                  <div className="blocks-panel__item-icon" style={{ backgroundColor: nodeType.color }}>
                    {nodeType.icon}
                  </div>
                  <span className="blocks-panel__item-name">{nodeType.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipelines' && (
          <div className="blocks-panel__pipelines">
            <h2 className="blocks-panel__subtitle">Pipelines</h2>
            <p className="blocks-panel__message">Create pipelines by connecting nodes on the canvas.</p>
          </div>
        )}
      </div>
    </div>
  );
};



export default BlocksPanel;