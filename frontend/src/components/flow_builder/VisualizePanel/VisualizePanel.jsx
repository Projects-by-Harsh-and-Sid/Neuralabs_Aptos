// src/components/flow_builder/VisualizePanel/VisualizePanel.jsx
import React, { useState } from "react";
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
  FiType,
  FiEye,
  FiMaximize2,
  FiZoomIn,
  FiZoomOut,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ExportModal from "./ExportModal"; // Import the new modal

const VisualizePanel = ({
  hideTextLabels,
  onToggleHideTextLabels,
  viewOnlyMode,
  onToggleViewOnlyMode,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleOrientation,
  onScreenshot,
  onExportFlow,
  onExportFlowJSON,
  onImportFlow,
  toggleSidebar,
  sidebarOpen,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const bgColor = useColorModeValue("vizpanel.body.light", "vizpanel.body.dark");
  const borderColor = useColorModeValue("vizpanel.border.light", "vizpanel.border.dark");
  const iconColor = useColorModeValue("vizpanel.icon.light", "vizpanel.icon.dark");
  const hoverBgColor = useColorModeValue("vizpanel.hover.light", "vizpanel.hover.dark");
  const activeBgColor = useColorModeValue("gray.200", "gray.600");
  const activeColor = useColorModeValue("blue.600", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const getButtonStyle = (isActive = false) => ({
    w: "100%",
    h: "56px",
    justifyContent: "center",
    borderRadius: 0,
    bg: isActive ? hoverBgColor : "transparent",
    color: isActive ? activeColor : iconColor,
    _hover: { bg: hoverBgColor },
  });

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  return (
    <Box
      w="56px"
      h="100%"
      bg={bgColor}
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="0"
      zIndex={2}
    >
      <VStack spacing={0} align="center" w="100%" h="100%" justifyContent="space-between">
        {/* Top Controls Group */}
        <VStack spacing={0} align="center" w="100%">
          {/* Toggle Sidebar Button */}
          <Box w="100%">
            <Tooltip
              label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"}
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle()}
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"}
              >
                {sidebarOpen ? (
                  <Flex alignItems="center" justifyContent="center">
                    <Box as={FaAngleDoubleLeft} size="24px" ml="-7px" />
                  </Flex>
                ) : (
                  <Flex alignItems="center" justifyContent="center">
                    <Box as={FaAngleDoubleRight} size="24px" ml="-7px" />
                  </Flex>
                )}
              </Button>
            </Tooltip>
          </Box>

          {/* View Only Mode Button */}
          <Box w="100%">
            <Tooltip
              label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"}
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle(viewOnlyMode)}
                onClick={onToggleViewOnlyMode}
                aria-label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"}
              >
                <FiEye size={24} />
              </Button>
            </Tooltip>
          </Box>

          {/* Hide Text Labels Button */}
          <Box w="100%">
            <Tooltip
              label={hideTextLabels ? "Show Labels" : "Hide Labels"}
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle(hideTextLabels)}
                onClick={onToggleHideTextLabels}
                aria-label={hideTextLabels ? "Show Labels" : "Hide Labels"}
              >
                <FiType size={24} />
              </Button>
            </Tooltip>
          </Box>

          {/* Add Import Button */}
          <Box w="100%">
            <Tooltip label="Import Flow" placement="right" bg={useColorModeValue("gray.900", "gray.900")} hasArrow>
              <Button {...getButtonStyle()} onClick={onImportFlow} aria-label="Import Flow">
                <FiUpload size={24} />
              </Button>
            </Tooltip>
          </Box>

          {/* Export Button */}
          <Box w="100%">
            <Tooltip
              label="Export Flow"
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle()}
                onClick={handleExportClick}
                aria-label="Export Flow"
              >
                <FiDownload size={24} />
              </Button>
            </Tooltip>
          </Box>
        </VStack>

        {/* Bottom Controls Group */}
        <VStack spacing={0} align="center" w="100%" mb={2}>
          {/* Zoom Controls */}
          <Box w="100%" textAlign="center">
            <Text fontSize="sm" color={textColor} py={2}>
              {Math.round(zoomLevel * 100)}%
            </Text>
          </Box>

          <Box w="100%">
            <Tooltip
              label="Zoom In"
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle()}
                onClick={onZoomIn}
                aria-label="Zoom In"
              >
                <Box fontSize="35px" fontWeight="bold">+</Box>
              </Button>
            </Tooltip>
          </Box>

          <Box w="100%">
            <Tooltip
              label="Zoom Out"
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle()}
                onClick={onZoomOut}
                aria-label="Zoom Out"
              >
                <Box fontSize="35px" fontWeight="bold">−</Box>
              </Button>
            </Tooltip>
          </Box>

          <Box w="100%">
            <Tooltip
              label="Fit to View"
              placement="right"
              bg={useColorModeValue("gray.900", "gray.900")}
              hasArrow
            >
              <Button
                {...getButtonStyle()}
                onClick={onFitView}
                aria-label="Fit to View"
              >
                <FiMaximize2 size={24} />
              </Button>
            </Tooltip>
          </Box>
        </VStack>
      </VStack>

      {/* Updated Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportFlow={onExportFlow}
        onExportFlowJSON={onExportFlowJSON}
      />
    </Box>
  );
};

export default VisualizePanel;