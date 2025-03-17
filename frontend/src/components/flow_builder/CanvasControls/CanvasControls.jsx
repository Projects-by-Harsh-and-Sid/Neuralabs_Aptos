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
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const buttonBgHover = useColorModeValue('gray.100', 'gray.600');
  
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
        <Text textAlign="center" mb={1} fontWeight="medium" fontSize="sm" color={textColor}>
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
              _hover={{ bg: buttonBgHover }}
            />
          </Tooltip>
          
          <Tooltip label="Zoom Out" placement="left" hasArrow>
            <IconButton
              icon={<FiZoomOut />}
              aria-label="Zoom Out"
              onClick={onZoomOut}
              variant="ghost"
              size="sm"
              _hover={{ bg: buttonBgHover }}
            />
          </Tooltip>
          
          <Tooltip label="Fit to View" placement="left" hasArrow>
            <IconButton
              icon={<FiMaximize2 />}
              aria-label="Fit to View"
              onClick={onFitView}
              variant="ghost"
              size="sm"
              _hover={{ bg: buttonBgHover }}
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
              _hover={{ bg: buttonBgHover }}
            />
          </Tooltip>
          
          <Tooltip label="Screenshot" placement="left" hasArrow>
            <IconButton
              icon={<FiCamera />}
              aria-label="Screenshot"
              onClick={onScreenshot}
              variant="ghost"
              size="sm"
              _hover={{ bg: buttonBgHover }}
            />
          </Tooltip>
        </VStack>
      </VStack>
    </Box>
  );
};

export default CanvasControls;