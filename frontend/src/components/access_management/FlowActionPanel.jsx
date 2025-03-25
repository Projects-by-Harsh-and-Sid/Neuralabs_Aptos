// src/components/access_management/FlowActionPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiMessageSquare,
  FiKey,
  FiEdit,
  FiTag,
  FiClock,
  FiUpload,
  FiSettings,
  FiLayout,
  FiLink,
  FiBarChart2,
  FiDownload,
  FiDollarSign,
  FiCreditCard,
  FiGitBranch,
  FiUsers
} from "react-icons/fi";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';

// Import flow icons from JSON
import flowIcons from '../../utils/my-flow-icons.json';

const FlowActionPanel = ({
  toggleSidebar,
  sidebarOpen
}) => {
  const [activeAction, setActiveAction] = useState(null);

  const bgColor = useColorModeValue("white", "#18191b");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const activeBgColor = useColorModeValue("gray.200", "gray.600");
  const activeColor = useColorModeValue("blue.600", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.300");

  // Map icon names to actual icon components
  const iconMapping = {
    FiHome: FiHome,
    FiMessageSquare: FiMessageSquare,
    FiKey: FiKey,
    FiEdit: FiEdit,
    FiTag: FiTag,
    FiClock: FiClock,
    FiUpload: FiUpload,
    FiSettings: FiSettings,
    FiLayout: FiLayout,
    FiLink: FiLink,
    FiBarChart2: FiBarChart2,
    FiDownload: FiDownload,
    FiDollarSign: FiDollarSign,
    FiCreditCard: FiCreditCard,
    FiGitBranch: FiGitBranch,
    FiUsers: FiUsers
  };

  const getButtonStyle = (actionName = null) => ({
    w: "100%",
    h: "56px",
    justifyContent: "center",
    borderRadius: 0,
    bg: actionName === activeAction ? hoverBgColor : "transparent",
    color: actionName === activeAction ? activeColor : iconColor,
    _hover: { bg: hoverBgColor },
  });

  const handleActionClick = (actionName) => {
    setActiveAction(actionName);
    // Add logic to handle the action click
    console.log(`Action clicked: ${actionName}`);
  };

  return (
    <Box
      w="56px"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="0"
      zIndex={2}
    >
      <VStack spacing={0} align="center" w="100%" h="100%" justify="flex-start">
        {/* Toggle Sidebar Button */}
        <Box w="100%">
          <Tooltip
            label={sidebarOpen ? "Close Flow Panel" : "Open Flow Panel"}
            placement="left"
            bg={"gray.900"}
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close Flow Panel" : "Open Flow Panel"}
            >
              {sidebarOpen ? (
                <Flex alignItems="center" justifyContent="center">
                  <Box as={FaAngleDoubleRight} size="24px" ml="-7px"/>
                </Flex>
              ) : (
                <Flex alignItems="center" justifyContent="center">
                  <Box as={FaAngleDoubleLeft} size="24px" ml="-7px"/>
                </Flex>
              )}
            </Button>
          </Tooltip>
        </Box>

        {/* Flow Action Icons */}
        {flowIcons.sidebarOptions.map((option, index) => (
          <Box w="100%" key={index}>
            <Tooltip
              label={option.newName}
              placement="right"
              bg={"gray.900"}
              hasArrow
            >
              <Button
                {...getButtonStyle(option.newName)}
                onClick={() => handleActionClick(option.newName)}
                aria-label={option.newName}
              >
                {iconMapping[option.icon] && (
                  <Box as={iconMapping[option.icon]} size="24px" />
                )}
              </Button>
            </Tooltip>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default FlowActionPanel;