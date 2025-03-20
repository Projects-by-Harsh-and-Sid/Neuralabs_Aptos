// Updated NavPanel.jsx with view only mode support
import React, { useState, useEffect } from 'react'; 

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
  FiEye,
  FiShoppingBag
} from 'react-icons/fi';

const NavPanel = ({ 
  toggleSidebar, 
  toggleVisualizePanel, 
  toggleMarketplacePanel,
  sidebarOpen,
  visualizePanelOpen,
  marketplacePanelOpen,
  viewOnlyMode = false
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.800', 'black');
  const borderColor = useColorModeValue('gray.700', 'gray.800');
  const iconColor = useColorModeValue('white', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.700', 'gray.900');
  const disabledColor = useColorModeValue('gray.500', 'gray.600');

  // Add state to track the active button
  const [activeButton, setActiveButton] = useState(null);
  
  // Update when props change
  useEffect(() => {
    if (sidebarOpen) setActiveButton('sidebar');
    else if (marketplacePanelOpen) setActiveButton('marketplace');
    else setActiveButton(null);
  }, [sidebarOpen, visualizePanelOpen, marketplacePanelOpen]);
  
  // Handle button clicks
  const handleButtonClick = (buttonName, action) => {
    // For view-only mode, only allow visualize button
    if (viewOnlyMode && buttonName !== 'visualize' && buttonName !== 'theme') {
      return;
    }
    
    // Just execute the action, the effect will handle the active state
    if (action) action();
  };

  const isActive = (buttonName) => activeButton === buttonName;

  const getButtonStyles = (buttonName) => {
    const isButtonActive = isActive(buttonName);
    const isDisabled = viewOnlyMode && buttonName !== 'visualize' && buttonName !== 'theme';
    
    return {
      w: "100%",
      h: "56px",
      justifyContent: "center",
      borderRadius: 0,
      bg: isButtonActive ? (colorMode === 'dark' ? 'blue.800' : 'blue.700') : "transparent",
      color: isDisabled ? disabledColor : (isButtonActive ? 'white' : iconColor),
      borderLeft: isButtonActive ? "4px solid" : "none",
      borderColor: isButtonActive ? "blue.400" : "transparent",
      _hover: { 
        bg: isDisabled ? "transparent" : (isButtonActive ? (colorMode === 'dark' ? 'blue.800' : 'blue.700') : hoverBgColor),
        cursor: isDisabled ? "not-allowed" : "pointer"
      }
    };
  };

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
          <Tooltip 
            label={viewOnlyMode ? "Disabled in view-only mode" : "Toggle Sidebar"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('sidebar')}
              onClick={() => handleButtonClick('sidebar', toggleSidebar)}
              aria-label="Toggle Sidebar"
              disabled={viewOnlyMode}
            >
              <FiMenu size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={viewOnlyMode ? "Disabled in view-only mode" : "Home"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('home')}
              onClick={() => handleButtonClick('home')}
              aria-label="Home"
              disabled={viewOnlyMode}
            >
              <FiHome size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={viewOnlyMode ? "Disabled in view-only mode" : "Marketplace"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('marketplace')}
              onClick={() => handleButtonClick('marketplace', toggleMarketplacePanel)}
              aria-label="Marketplace"
              disabled={viewOnlyMode}
            >
              <FiShoppingBag size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip label="Visualize" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
            <Button 
              {...getButtonStyles('visualize')}
              onClick={() => handleButtonClick('visualize', toggleVisualizePanel)}
              aria-label="Visualize"
            >
              <FiEye size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%" mt="auto">
          <Tooltip label="Toggle Theme" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
            <Button 
              {...getButtonStyles('theme')}
              onClick={() => handleButtonClick('theme', toggleColorMode)}
              aria-label="Toggle Theme"
            >
              {colorMode === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%" mb={3}>
          <Tooltip 
            label={viewOnlyMode ? "Disabled in view-only mode" : "Settings"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('settings')}
              onClick={() => handleButtonClick('settings')}
              aria-label="Settings"
              disabled={viewOnlyMode}
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