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
  FiMoon,
  FiEye
} from 'react-icons/fi';

const NavPanel = ({ toggleSidebar, toggleVisualizePanel }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.800', 'black');
  const borderColor = useColorModeValue('gray.700', 'gray.800');
  const iconColor = useColorModeValue('white', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.700', 'gray.900');
  
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
            bg="gray.500"
            color="white"
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
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
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
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
              aria-label="Home"
            >
              <FiHome size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Nodes" placement="right" hasArrow>
            <Button 
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
              aria-label="Nodes"
            >
              <FiLayout size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Visualize" placement="right" hasArrow>
            <Button 
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
              onClick={toggleVisualizePanel}
              aria-label="Visualize"
            >
              <FiEye size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%" mt="auto">
          <Tooltip label="Toggle Theme" placement="right" hasArrow>
            <Button 
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
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
              w="100%"
              h="56px"
              justifyContent="center"
              borderRadius={0}
              bg="transparent"
              color={iconColor}
              _hover={{ bg: hoverBgColor }}
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