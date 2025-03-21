import React from 'react';
import { Box } from '@chakra-ui/react';
import FlowBuilder from '../components/flow_builder/flow_builder';

/**
 * Flow Builder Page
 * 
 * This page wraps the FlowBuilder component and can be used
 * to add page-specific logic, headers, or additional UI elements
 * surrounding the flow builder.
 */
const FlowBuilderPage = ({ 
  sidebarOpen, 
  marketplacePanelOpen,
  toggleSidebar,
  toggleMarketplacePanel 
}) => {
  return (
    <Box w="100%" h="100%" overflow="hidden">
      <FlowBuilder 
        sidebarOpen={sidebarOpen} 
        marketplacePanelOpen={marketplacePanelOpen}
        toggleSidebar={toggleSidebar}
        toggleMarketplacePanel={toggleMarketplacePanel}
      />
    </Box>
  );
};

export default FlowBuilderPage;