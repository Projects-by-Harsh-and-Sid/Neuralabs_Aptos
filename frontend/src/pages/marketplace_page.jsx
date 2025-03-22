// src/pages/marketplace_page.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import Marketplace from '../components/marketplace/marketplace';

/**
 * Marketplace Page
 * 
 * This page simply renders the Marketplace component which handles its own state
 * and shows both the marketplace panel and main content or detail panel.
 */
const MarketplacePage = () => {
  return (
    <Box w="100%" h="100%" overflow="hidden">
      <Marketplace />
    </Box>
  );
};

export default MarketplacePage;