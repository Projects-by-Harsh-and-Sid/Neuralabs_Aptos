// src/components/flow_builder/VisualizePanel/VisualizePanel.jsx
import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  VStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBarChart2, FiType, FiEye } from 'react-icons/fi';

const VisualizePanel = ({ hideTextLabels, onToggleHideTextLabels }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box
      w="80px"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="16px 0"
    >
      <Heading as="h3" size="xs" mb={6} color={textColor}>Visualize</Heading>
      
      <VStack spacing={4} align="center">
        <Button
          w="60px"
          h="60px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          variant="outline"
          borderRadius="md"
          p={2}
        >
          <Box as={FiBarChart2} fontSize="24px" mb={1} color={iconColor} />
          <Text fontSize="xs" textAlign="center" color={textColor}>
            Charts
          </Text>
        </Button>
        
        {/* Toggle for Hide Text Labels */}
        <Box
          w="60px"
          bg={cardBg}
          borderRadius="md"
          p={2}
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={1}>
            <Box as={FiType} fontSize="18px" color={iconColor} />
            <Text fontSize="10px" textAlign="center" color={textColor} mb={1}>
              Hide Text
            </Text>
            <Switch 
              size="sm" 
              isChecked={hideTextLabels}
              onChange={onToggleHideTextLabels}
              colorScheme="blue"
            />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default VisualizePanel;