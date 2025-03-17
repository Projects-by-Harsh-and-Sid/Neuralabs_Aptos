// src/components/flow_builder/VisualizePanel/VisualizePanel.jsx
import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  VStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBarChart2 } from 'react-icons/fi';

const VisualizePanel = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  
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
      </VStack>
    </Box>
  );
};

export default VisualizePanel;