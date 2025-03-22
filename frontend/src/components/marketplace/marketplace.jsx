// src/components/marketplace/marketplace.jsx
import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import MarketplaceSidebar from './MarketplacePanel/MarketplaceSidebar';
import MarketplaceContent from './MarketplaceContent/MarketplaceContent';
import { marketplaceApi } from '../../utils/api';

const Marketplace = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setLoading(true);
        
        // Get all marketplace items
        const allItemsResponse = await marketplaceApi.getAll();
        
        // Get featured item IDs
        const featuredResponse = await marketplaceApi.getFeatured();
        
        // Get owned item IDs
        const ownedResponse = await marketplaceApi.getOwned();
        
        // Filter the items based on featured and owned IDs
        const allItems = allItemsResponse.data;
        const featuredItems = allItems.filter(item => 
          featuredResponse.data.includes(item.id)
        );
        const ownedItems = allItems.filter(item => 
          ownedResponse.data.includes(item.id)
        );
        
        setFeaturedItems(featuredItems);
        setOwnedItems(ownedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching marketplace data:", err);
        setError("Failed to load marketplace data");
        setLoading(false);
      }
    };
    
    fetchMarketplaceData();
  }, []);
  
  // Handle selecting an item
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };
  
  // Close detail panel
  const handleCloseDetailPanel = () => {
    setSelectedItem(null);
  };
  
  return (
    <Flex w="100%" h="100%" overflow="hidden" position="relative">
      {/* Left side - Marketplace panel */}
      <MarketplaceSidebar 
        onSelectItem={handleSelectItem}
      />
      
      {/* Right side - Main content or detail panel */}
      <MarketplaceContent
        loading={loading}
        error={error}
        featuredItems={featuredItems}
        ownedItems={ownedItems}
        selectedItem={selectedItem}
        handleSelectItem={handleSelectItem}
        handleCloseDetailPanel={handleCloseDetailPanel}
      />
    </Flex>
  );
};

export default Marketplace;