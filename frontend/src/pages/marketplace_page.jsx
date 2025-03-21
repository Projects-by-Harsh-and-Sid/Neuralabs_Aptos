import React from 'react';
import { Box } from '@chakra-ui/react';
import Marketplace from '../components/marketplace/marketplace';

/**
 * Marketplace Page
 * 
 * This page wraps the Marketplace component and can be used
 * to add page-specific logic, headers, or additional UI elements
 * surrounding the marketplace.
 */
const MarketplacePage = ({ 
  marketplacePanelOpen, 
  toggleMarketplacePanel 
}) => {
  return (
    <Box w="100%" h="100%" overflow="hidden">
      <Marketplace 
        marketplacePanelOpen={marketplacePanelOpen}
        toggleMarketplacePanel={toggleMarketplacePanel}
      />
    </Box>
  );
};

export default MarketplacePage;