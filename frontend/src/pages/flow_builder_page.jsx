import React from 'react';
import FlowBuilder from '../components/flow_builder/flow_builder';
// import './flow_builder_page.scss'; // Optional: create a SCSS file for this page

/**
 * Flow Builder Page
 * 
 * This page wraps the FlowBuilder component and can be used
 * to add page-specific logic, headers, or additional UI elements
 * surrounding the flow builder.
 */
const FlowBuilderPage = () => {
  return (
      <div className="flow-builder-page">
        <FlowBuilder />
      </div>
  );
};

export default FlowBuilderPage;