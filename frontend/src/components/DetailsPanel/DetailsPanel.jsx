// src/components/DetailsPanel/DetailsPanel.js
import React, { useState } from 'react';
import './DetailsPanel.scss';

const DetailsPanel = ({ selectedNode, onClose }) => {
  const [activeTab, setActiveTab] = useState('properties');
  
  if (!selectedNode) {
    return (
      <div className="details-panel details-panel--empty">
        <div className="details-panel__header">
          <h2 className="details-panel__title">Details</h2>
          <button className="details-panel__close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.6569 16.9706 22 12 22C7.02944 22 3 20.6569 3 19V5M21 12C21 13.6569 16.9706 15 12 15C7.02944 15 3 13.6569 3 12" stroke="#00bcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'task':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="#31e27b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'parameters':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H8Z" stroke="#a000bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#a000bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12H17.5M16 16H17.5M16 8H17.5M8.8 19H15.2C16.8802 19 17.7202 19 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C20 16.7202 20 15.8802 20 14.2V9.8C20 8.11984 20 7.27976 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C17.7202 5 16.8802 5 15.2 5H8.8C7.11984 5 6.27976 5 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4 7.27976 4 8.11984 4 9.8V14.2C4 15.8802 4 16.7202 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C6.27976 19 7.11984 19 8.8 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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