// src/pages/access_management_page.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import AccessPage from '../components/access_management/AccessPage';

/**
 * Access Management Page
 * 
 * This page wraps the AccessPage component and handles routing.
 */
const AccessManagementPage = () => {
  return (
    <Box w="100%" h="100%" overflow="hidden">
      <AccessPage />
    </Box>
  );
};

export default AccessManagementPage;