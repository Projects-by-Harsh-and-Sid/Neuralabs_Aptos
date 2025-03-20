import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavPanel from '../common_components/NavPanel/NavelPanel';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigate to different sections of the app
  const handleNavigation = (route) => {
    if (route !== location.pathname) {
      navigate(route);
    }
  };

  return (
    <Flex className="app" h="100vh" w="100vw" overflow="hidden">
      {/* Navigation Panel - common for all routes */}
      <NavPanel 
        onNavigate={handleNavigation}
        currentPath={location.pathname}
      />
      
      {/* Main Content Area */}
      <Flex flex="1" overflow="hidden" position="relative">
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;