// src/components/access_management/FlowCard.jsx - Fixed version
import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Center, 
  useColorModeValue 
} from '@chakra-ui/react';

const FlowCard = ({ flow, onSelect, isSelected }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconBgColor = useColorModeValue('black', 'black');
  const iconTextColor = useColorModeValue('white', 'white');
  
  // Handle case where flow might be undefined or missing properties
  if (!flow) {
    return null;
  }
  
  return (
    <Box
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      onClick={onSelect}
      cursor="pointer"
      position="relative"
    >
      <Center
        bg={iconBgColor}
        h="120px"
        position="relative"
      >
        <Text fontSize="6xl" fontWeight="bold" color={iconTextColor}>
          {flow.icon || 'A'}
        </Text>
      </Center>
      
      <Box p={4}>
        <Text fontWeight="bold" fontSize="xl" mb={2} color={textColor}>
          {flow.name || 'Unnamed Flow'}
        </Text>
        
        <Text fontSize="sm" color={textColor} minH="60px">
          {flow.description || 'No description available'}
        </Text>
        
        <Flex 
          mt={4} 
          w="100%" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering ? (
            <Flex w="100%" gap={2}>
              <Button 
                size="sm" 
                colorScheme="blue" 
                flex="1"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle access action
                }}
              >
                Access
              </Button>
              <Button 
                size="sm" 
                colorScheme="gray" 
                flex="1"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action
                }}
              >
                Edit
              </Button>
            </Flex>
          ) : (
            <Button 
              w="100%" 
              size="sm" 
              variant="outline"
            >
              {isSelected ? 'View actions' : 'Manage'}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default FlowCard;