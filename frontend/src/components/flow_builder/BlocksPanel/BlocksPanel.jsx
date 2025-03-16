import React, { useState } from 'react';
import './BlocksPanel.scss';

// Import SVG files
import dataIcon from '../../../assets/icons/data-icon.svg';
import taskIcon from '../../../assets/icons/task-icon.svg';
import parametersIcon from '../../../assets/icons/parameters-icon.svg';
import closeIcon from '../../../assets/icons/close-icon.svg';

// Define color variables
const variables = {
  "$blue-300": "#00bcff",
  "$green-300": "#31e27b",
  "$purple-300": "#a000bc",
};

// Node types and their templates
const NODE_TYPES = {
  data: {
    name: 'Data',
    icon: dataIcon,
    color: variables.$blue-300,
  },
  task: {
    name: 'Task',
    icon: taskIcon,
    color: variables.$green-300,
  },
  parameters: {
    name: 'Parameters',
    icon: parametersIcon,
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
            <img src={closeIcon} alt="Clear search" />
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
                    <img src={nodeType.icon} alt={nodeType.name} />
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