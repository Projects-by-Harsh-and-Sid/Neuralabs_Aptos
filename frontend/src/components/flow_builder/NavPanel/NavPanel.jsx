// src/components/flow_builder/NavPanel/NavPanel.jsx
import React from 'react';
import { 
  Box, 
  VStack, 
  Button, 
  Flex, 
  Text, 
  useColorMode, 
  Tooltip, 
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiMenu, 
  FiHome, 
  FiLayout, 
  FiSettings, 
  FiSun, 
  FiMoon 
} from 'react-icons/fi';

const NavPanel = ({ toggleSidebar }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      as="nav" 
      position="relative"
      w="80px" 
      h="100%" 
      bg={bgColor} 
      borderRight="1px solid" 
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      zIndex={2}
      boxShadow="sm"
    >
      <VStack 
        as="ul" 
        listStyleType="none" 
        m={0} 
        p={0} 
        h="100%" 
        spacing={0}
      >
        <Box as="li" position="relative" w="100%" display="flex" justifyContent="center" py={3}>
          <Flex 
            w="40px" 
            h="40px" 
            bg="yellow.300"
            color="black"
            alignItems="center" 
            justifyContent="center"
            fontSize="24px" 
            fontWeight="bold"
            borderRadius="8px"
          >
            K
          </Flex>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Toggle Sidebar" placement="right" hasArrow>
            <Button 
              variant="navButton"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <FiMenu size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Home" placement="right" hasArrow>
            <Button 
              variant="navButton" 
              aria-label="Home"
            >
              <FiHome size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Nodes" placement="right" hasArrow>
            <Button 
              variant="navButton" 
              aria-label="Nodes"
            >
              <FiLayout size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%" mt="auto">
          <Tooltip label="Toggle Theme" placement="right" hasArrow>
            <Button 
              variant="navButton" 
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
            >
              {colorMode === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%" mb={3}>
          <Tooltip label="Settings" placement="right" hasArrow>
            <Button 
              variant="navButton" 
              aria-label="Settings"
            >
              <FiSettings size={24} />
            </Button>
          </Tooltip>
        </Box>
      </VStack>
    </Box>
  );
};

export default NavPanel;