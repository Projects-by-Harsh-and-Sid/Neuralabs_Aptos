import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Button, 
  Flex, 
  useColorMode, 
  Tooltip, 
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiLayout, 
  FiSettings, 
  FiSun, 
  FiMoon,
  FiShoppingBag,
  FiMessageSquare, // Added for chat icon
  FiKey // Add this for access management
} from 'react-icons/fi';

import neura_icon_white from '../../../assets/icons/neura-black.svg'; // Adjust the path as necessary
import neura_icon_dark from '../../../assets/icons/neura-white.svg'; // Adjust the path as necessary

const NavPanel = ({ 
  onNavigate,
  currentPath,
  viewOnlyMode = false
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('navbar.body.light', 'navbar.body.dark');
  const borderColor = useColorModeValue('navbar.border.light', 'navbar.border.dark');
  const iconColor = useColorModeValue('navbar.icon.light', 'navbar.icon.dark');
  const hoverBgColor = useColorModeValue('navbar.hover.light', 'navbar.hover.dark');
  const disabledColor = useColorModeValue('gray.500', 'gray.600');
  // const 

  // Add state to track the active button
  const [activeButton, setActiveButton] = useState(null);
  
  // Update active button based on current path
  useEffect(() => {
    if (currentPath === '/dashboard') {
      setActiveButton('home');
    } else if (currentPath === '/flow-builder') {
      setActiveButton('flow-builder');
    } else if (currentPath === '/marketplace') {
      setActiveButton('marketplace');
    } else if (currentPath === '/settings') {
      setActiveButton('settings');
    } else if (currentPath === '/chat') {
      setActiveButton('chat');
    } else {
      setActiveButton(null);
    }
  }, [currentPath]);
  
  // Handle button clicks
  const handleButtonClick = (buttonName, action, route) => {
    // For view-only mode, only allow theme button
    if (viewOnlyMode && buttonName !== 'theme') {
      return;
    }
    
    // Navigate if route is provided
    if (route && onNavigate) {
      onNavigate(route);
    }
    
    // Execute action if provided
    if (action) action();
  };

  const isActive = (buttonName) => activeButton === buttonName;

  const getButtonStyles = (buttonName) => {
    const isButtonActive = isActive(buttonName);
    const isDisabled = viewOnlyMode && buttonName !== 'theme';
    
    return {
      w: "100%",
      h: "56px",
      justifyContent: "center",
      borderRadius: 0,
      bg: isButtonActive ? (colorMode === 'dark' ? hoverBgColor : hoverBgColor) : "transparent", 
      color: isDisabled ? disabledColor : (isButtonActive ? iconColor : iconColor),
      borderLeft: isButtonActive ? "none" : "none",
      borderColor: isButtonActive ? hoverBgColor : "transparent",
      _hover: { 
        bg: isDisabled ? "transparent" : (isButtonActive ? (colorMode === 'dark' ? hoverBgColor : hoverBgColor) : hoverBgColor),
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
        py={15} 
        h="100%" 
        spacing={0}
      >
        <Box as="li" position="relative" w="100%" display="flex" justifyContent="center" py={3} 
        >
          <Flex 
            w="32px" 
            h="32px" 
            bg="gray.500"
            color="white"
            alignItems="center" 
            justifyContent="center"
            fontSize="24px" 
            fontWeight="bold"
            borderRadius="8px"
          >
            {
              colorMode === 'light' ? (
                <img src={neura_icon_white} alt="Neura Icon" />
              ) : (
                <img src={neura_icon_dark} alt="Neura Icon" />
              )
            }
          </Flex>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={"Dashboard"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('home')}
              onClick={() => handleButtonClick('home', null, '/dashboard')}
              aria-label="Dashboard"
              disabled={viewOnlyMode}
            >
              <FiHome size={24} />
            </Button>
          </Tooltip>
        </Box>

        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={"Chat"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('chat')}
              onClick={() => handleButtonClick('chat', null, '/chat')}
              aria-label="Chat Interface"
              disabled={viewOnlyMode}
            >
              <FiMessageSquare size={24} />
            </Button>
          </Tooltip>
        </Box>
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={"Access Management"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('access-management')}
              onClick={() => handleButtonClick('access-management', null, '/access-management')}
              aria-label="Access Management"
              disabled={viewOnlyMode}
            >
              <FiKey size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={"Flow Builder"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('flow-builder')}
              onClick={() => handleButtonClick('flow-builder', null, '/flow-builder')}
              aria-label="Flow Builder"
              disabled={viewOnlyMode}
            >
              <FiLayout size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box as="li" position="relative" w="100%">
          <Tooltip 
            label={"Marketplace"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('marketplace')}
              onClick={() => handleButtonClick('marketplace', null, '/marketplace')}
              aria-label="Marketplace"
              disabled={viewOnlyMode}
            >
              <FiShoppingBag size={24} />
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
            label={"Settings"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button 
              {...getButtonStyles('settings')}
              onClick={() => handleButtonClick('settings', null, '/settings')}
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