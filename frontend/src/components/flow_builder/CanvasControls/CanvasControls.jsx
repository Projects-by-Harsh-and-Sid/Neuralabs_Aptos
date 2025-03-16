// src/components/flow_builder/CanvasControls/CanvasControls.jsx
import React from 'react';
import { 
  Box, 
  VStack, 
  IconButton, 
  Text, 
  Divider, 
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiZoomIn, 
  FiZoomOut, 
  FiMaximize2, 
  FiRotateCcw,
  FiCamera 
} from 'react-icons/fi';

const CanvasControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onFitView, 
  onToggleOrientation, 
  onScreenshot,
  zoomLevel 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      position="absolute"
      right="2"
      bottom="4"
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
      p={2}
    >
      <VStack spacing={2} align="center">
        <Text textAlign="center" mb={1} fontWeight="medium" fontSize="sm">
          {Math.round(zoomLevel * 100)}%
        </Text>
        
        <VStack spacing={2}>
          <Tooltip label="Zoom In" placement="left" hasArrow>
            <IconButton
              icon={<FiZoomIn />}
              aria-label="Zoom In"
              onClick={onZoomIn}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          
          <Tooltip label="Zoom Out" placement="left" hasArrow>
            <IconButton
              icon={<FiZoomOut />}
              aria-label="Zoom Out"
              onClick={onZoomOut}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          
          <Tooltip label="Fit to View" placement="left" hasArrow>
            <IconButton
              icon={<FiMaximize2 />}
              aria-label="Fit to View"
              onClick={onFitView}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </VStack>
        
        <Divider />
        
        <VStack spacing={2}>
          <Tooltip label="Toggle Orientation" placement="left" hasArrow>
            <IconButton
              icon={<FiRotateCcw />}
              aria-label="Toggle Orientation"
              onClick={onToggleOrientation}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          
          <Tooltip label="Screenshot" placement="left" hasArrow>
            <IconButton
              icon={<FiCamera />}
              aria-label="Screenshot"
              onClick={onScreenshot}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </VStack>
      </VStack>
    </Box>
  );
};

export default CanvasControls;