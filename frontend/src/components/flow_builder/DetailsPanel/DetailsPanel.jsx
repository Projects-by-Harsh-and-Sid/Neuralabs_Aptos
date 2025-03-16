import React, { useState } from 'react';
import './DetailsPanel.scss';

// Import SVG icons
import closeIcon from '../../../assets/icons/close-icon.svg';
import dataIcon from '../../../assets/icons/data-icon.svg';
import taskIcon from '../../../assets/icons/task-icon.svg';
import parametersIcon from '../../../assets/icons/parameters-icon.svg';
import previewIcon from '../../../assets/icons/preview-icon.svg';

const DetailsPanel = ({ selectedNode, onClose }) => {
  const [activeTab, setActiveTab] = useState('properties');
  
  if (!selectedNode) {
    return (
      <div className="details-panel details-panel--empty">
        <div className="details-panel__header">
          <h2 className="details-panel__title">Details</h2>
          <button className="details-panel__close" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="details-panel__empty-message">
          Select a node to view and edit its properties
        </div>
      </div>
    );
  }
  
  // Get icon based on node type
  const getNodeIcon = () => {
    switch (selectedNode.type) {
      case 'data':
        return <img src={dataIcon} alt="Data" />;
      case 'task':
        return <img src={taskIcon} alt="Task" />;
      case 'parameters':
        return <img src={parametersIcon} alt="Parameters" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="details-panel">
      <div className="details-panel__header">
        <div className="details-panel__header-content">
          <div className="details-panel__icon">
            {getNodeIcon()}
          </div>
          <h2 className="details-panel__title">{selectedNode.name}</h2>
        </div>
        <button className="details-panel__close" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      
      <div className="details-panel__tabs">
        <button 
          className={`details-panel__tab ${activeTab === 'properties' ? 'details-panel__tab--active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button 
          className={`details-panel__tab ${activeTab === 'code' ? 'details-panel__tab--active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button 
          className={`details-panel__tab ${activeTab === 'preview' ? 'details-panel__tab--active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
      
      <div className="details-panel__content">
        {activeTab === 'properties' && (
          <div className="details-panel__properties">
            <div className="details-panel__property">
              <div className="details-panel__property-label">ID</div>
              <div className="details-panel__property-value">{selectedNode.id}</div>
            </div>
            <div className="details-panel__property">
              <div className="details-panel__property-label">Type</div>
              <div className="details-panel__property-value">{selectedNode.type}</div>
            </div>
            <div className="details-panel__property">
              <div className="details-panel__property-label">Position</div>
              <div className="details-panel__property-value">x: {Math.round(selectedNode.x)}, y: {Math.round(selectedNode.y)}</div>
            </div>
            <div className="details-panel__property">
              <div className="details-panel__property-label">Name</div>
              <input 
                type="text" 
                className="details-panel__property-input" 
                value={selectedNode.name} 
                onChange={(e) => {
                  // Update node name
                  // onUpdateNode(selectedNode.id, { name: e.target.value });
                }} 
              />
            </div>
            
            {selectedNode.type === 'parameters' && (
              <div className="details-panel__section">
                <h3 className="details-panel__section-title">Parameters</h3>
                <div className="details-panel__parameters">
                  <div className="details-panel__parameter">
                    <input type="text" className="details-panel__parameter-key" placeholder="Key" />
                    <input type="text" className="details-panel__parameter-value" placeholder="Value" />
                    <button className="details-panel__parameter-add">+</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="details-panel__section">
              <h3 className="details-panel__section-title">Tags</h3>
              <div className="details-panel__tags">
                <input type="text" className="details-panel__tags-input" placeholder="Add tags..." />
                <div className="details-panel__tags-list">
                  <div className="details-panel__tag">
                    Data
                    <button className="details-panel__tag-remove">×</button>
                  </div>
                  <div className="details-panel__tag">
                    Pipeline
                    <button className="details-panel__tag-remove">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="details-panel__code">
            <pre className="details-panel__code-editor">
              <code>
                {`import pandas as pd

def ${selectedNode.name.toLowerCase()}(data):
    """
    Process the input data.
    
    Args:
        data: Input data to process
        
    Returns:
        Processed data
    """
    # Process data
    result = data.copy()
    
    # Add your processing logic here
    
    return result`}
              </code>
            </pre>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="details-panel__preview">
            <div className="details-panel__preview-placeholder">
              <img src={previewIcon} alt="Preview" />
              <p>No preview available for this node.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="details-panel__footer">
        <button className="details-panel__button details-panel__button--secondary">Delete</button>
        <button className="details-panel__button details-panel__button--primary">Apply Changes</button>
      </div>
    </div>
  );
};

export default DetailsPanel;