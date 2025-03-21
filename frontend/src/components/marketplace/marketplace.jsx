import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import MarketplacePanel from './MarketplacePanel/MarketplacePanel';
import MarketplaceDetailPanel from './MarketplacePanel/MarketplaceDetailPanel';

const Marketplace = ({ marketplacePanelOpen, toggleMarketplacePanel }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle selecting an item from the marketplace
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  // Close detail panel
  const handleCloseDetailPanel = () => {
    setSelectedItem(null);
  };

  return (
    <Flex w="100%" h="100%" overflow="hidden" position="relative">
      {/* Marketplace panel is always visible in the marketplace page */}
      <MarketplacePanel 
        onClose={toggleMarketplacePanel}
        onSelectItem={handleSelectItem}
      />
      
      {/* Right side - black background when no item is selected */}
      <Box 
        flex="1" 
        bg="black" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        {/* Show detailed panel when an item is selected */}
        {selectedItem && (
          <MarketplaceDetailPanel 
            item={selectedItem}
            onClose={handleCloseDetailPanel}
          />
        )}
      </Box>
    </Flex>
  );
};

export default Marketplace;