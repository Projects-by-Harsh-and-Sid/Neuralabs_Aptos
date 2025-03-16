// src/pages/flow_builder_page.jsx
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
const FlowBuilderPage = () => {
  return (
    <Box w="100vw" h="100vh" overflow="hidden">
      <FlowBuilder />
    </Box>
  );
};

export default FlowBuilderPage;