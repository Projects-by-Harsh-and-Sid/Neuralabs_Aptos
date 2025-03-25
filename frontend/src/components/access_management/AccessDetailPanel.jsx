// src/components/access_management/AccessDetailPanel.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Heading, 
  IconButton, 
  Divider, 
  VStack, 
  HStack, 
  Badge, 
  Button, 
  useColorModeValue 
} from '@chakra-ui/react';
import { FiX, FiPlus } from 'react-icons/fi';
import FlowActionPanel from './FlowActionPanel';
import FlowDetailComponent from './FlowDetailComponent';
import FlowDescriptionComponent from './FlowDescriptionComponent';

const AccessDetailPanel = ({ flowDetails, onClose }) => {
  const [flowPanelOpen, setFlowPanelOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  if (!flowDetails) {
    return null;
  }

  const toggleFlowPanel = () => {
    setFlowPanelOpen(!flowPanelOpen);
  };
  
  const handleHoverItem = (itemKey) => {
    setHoveredItem(itemKey);
  };
  
  const handleLeaveItem = () => {
    setHoveredItem(null);
  };
  
  return (
    <Flex w="calc(100% - 280px)" h="100%" overflow="hidden">
      {/* Flow Action Panel */}
      <FlowActionPanel 
        toggleSidebar={toggleFlowPanel}
        sidebarOpen={flowPanelOpen}
      />
      
      {/* Flow Detail Component and Description Component */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header with close button */}
        
        {/* Two-column layout for details and description */}
        <Flex flex="1" overflow="auto">
          {/* Flow Detail Component */}
          <Box 
            w="80%" 
            p={6} 
            borderRight="1px solid" 
            borderColor={borderColor}
            overflow="auto"
          >
            <FlowDetailComponent 
              flowDetails={flowDetails} 
              onHoverItem={handleHoverItem}
              onLeaveItem={handleLeaveItem}
            />
          </Box>
          
          {/* Flow Description Component */}
          <Box w="20%" p={6} overflow="auto">
            <FlowDescriptionComponent 
              flowDetails={flowDetails} 
              currentHoveredItem={hoveredItem}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AccessDetailPanel;