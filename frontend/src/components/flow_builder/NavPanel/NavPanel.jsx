// Updated NavPanel.jsx with marketplace button
// Modify your NavPanel component to track active button
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
  FiShoppingBag // Added for marketplace icon
} from 'react-icons/fi';
const NavPanel = ({ 
  toggleSidebar, 
  toggleVisualizePanel, 
  toggleMarketplacePanel,
  sidebarOpen,
  visualizePanelOpen,
  marketplacePanelOpen
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.800', 'black');
  const borderColor = useColorModeValue('gray.700', 'gray.800');
  const iconColor = useColorModeValue('white', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.700', 'gray.900');

  // Add state to track the active button
  const [activeButton, setActiveButton] = useState(null);
  
  // Add this helper function to determine if a button is active
  const isActive = (buttonName) => activeButton === buttonName;
  
  // Update when props change
  useEffect(() => {
    if (sidebarOpen) setActiveButton('sidebar');
    // else if (visualizePanelOpen) setActiveButton('visualize');
    else if (marketplacePanelOpen) setActiveButton('marketplace');
    else setActiveButton(null);
  }, [sidebarOpen, visualizePanelOpen, marketplacePanelOpen]);
  
  // Handle button clicks
  const handleButtonClick = (buttonName, action) => {
    // Just execute the action, the effect will handle the active state
    if (action) action();
  };

  const getButtonStyles = (buttonName) => {
    const isButtonActive = isActive(buttonName);
    
    return {
      w: "100%",
      h: "56px",
      justifyContent: "center",
      borderRadius: 0,
      bg: isButtonActive ? (colorMode === 'dark' ? 'blue.800' : 'blue.700') : "transparent",
      color: isButtonActive ? 'white' : iconColor,
      borderLeft: isButtonActive ? "4px solid" : "none",
      borderColor: isButtonActive ? "blue.400" : "transparent",
      _hover: { bg: isButtonActive ? (colorMode === 'dark' ? 'blue.800' : 'blue.700') : hoverBgColor }
    };
  };

    // Handle button clicks with setting active state
    // const handleButtonClick = (buttonName, action) => {
    //   setActiveButton(buttonName);
    //   if (action) action();
    // };
    

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
            <Tooltip label="Toggle Sidebar" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('sidebar')}
                onClick={() => handleButtonClick('sidebar', toggleSidebar)}
                aria-label="Toggle Sidebar"
              >
                <FiMenu size={24} />
              </Button>
            </Tooltip>
          </Box>
          
          <Box as="li" position="relative" w="100%">
            <Tooltip label="Home" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('home')}
                onClick={() => handleButtonClick('home')}
                aria-label="Home"
              >
                <FiHome size={24} />
              </Button>
            </Tooltip>
          </Box>
          
          {/* <Box as="li" position="relative" w="100%">
            <Tooltip label="Nodes" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('nodes')}
                onClick={() => handleButtonClick('nodes')}
                aria-label="Nodes"
              >
                <FiLayout size={24} />
              </Button>
            </Tooltip>
          </Box> */}
          
          {/* New Marketplace button */}
          <Box as="li" position="relative" w="100%">
            <Tooltip label="Marketplace" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('marketplace')}
                onClick={() => handleButtonClick('marketplace', toggleMarketplacePanel)}
                aria-label="Marketplace"
              >
                <FiShoppingBag size={24} />
              </Button>
            </Tooltip>
          </Box>
          
          <Box as="li" position="relative" w="100%">
            <Tooltip label="Visualize" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('visualize')}
                onClick={toggleVisualizePanel}
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
                onClick={() => {
                  toggleColorMode();
                  // Don't set this as active since it's a utility action
                }}
                aria-label="Toggle Theme"
              >
                {colorMode === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
              </Button>
            </Tooltip>
          </Box>
          
          <Box as="li" position="relative" w="100%" mb={3}>
            <Tooltip label="Settings" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button 
                {...getButtonStyles('settings')}
                onClick={() => handleButtonClick('settings')}
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