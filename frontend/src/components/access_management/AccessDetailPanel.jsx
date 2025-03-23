// src/components/access_management/AccessDetailPanel.jsx
import React from 'react';
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

const AccessDetailPanel = ({ flowDetails, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const levelColor = useColorModeValue('pink.500', 'pink.300');
  
  if (!flowDetails) {
    return null;
  }
  
  return (
    <Box
      w="100%"
      h="100%"
      bg={bgColor}
      overflow="auto"
      position="relative"
    >
      <Flex 
        justify="space-between" 
        align="center" 
        p={4} 
        borderBottom="1px solid" 
        borderColor={borderColor}
      >
        <HStack>
          <Box
            bg="black"
            color="white"
            w="40px"
            h="40px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
            fontWeight="bold"
            mr={3}
          >
            A
          </Box>
          <Heading as="h2" size="lg" color={textColor}>
            {flowDetails.name}
          </Heading>
        </HStack>
        
        <IconButton
          icon={<FiX />}
          variant="ghost"
          onClick={onClose}
          aria-label="Close panel"
        />
      </Flex>
      
      <Box p={4}>
        <VStack align="start" spacing={4} mb={6}>
          <Flex width="100%" justify="space-between">
            <Text color={mutedTextColor}>By {flowDetails.author || flowDetails.owner}</Text>
            <HStack>
              <Text color="yellow.400">★</Text>
              <Text fontWeight="bold">{flowDetails.rating}</Text>
              <Text color={mutedTextColor}>|</Text>
              <Text>{flowDetails.downloads || flowDetails.usersWithAccess} downloads</Text>
            </HStack>
          </Flex>
          
          <HStack spacing={2}>
            {flowDetails.tags && flowDetails.tags.map((tag, index) => (
              <Badge key={index} colorScheme="blue" px={2} py={1} borderRadius="full">
                {tag}
              </Badge>
            ))}
          </HStack>
        </VStack>
        
        <VStack align="start" spacing={4} mb={6}>
          <Heading as="h3" size="md" color={textColor}>
            About
          </Heading>
          
          <Text color={mutedTextColor}>
            {flowDetails.longDescription || flowDetails.description}
          </Text>
        </VStack>

        <VStack align="start" spacing={4} mb={6}>
          <HStack spacing={6} width="100%">
            <Box>
              <Text color={mutedTextColor} fontSize="sm">Creation Date</Text>
              <Text fontWeight="medium">{flowDetails.creationDate || "2025-02-10"}</Text>
            </Box>
            <Box>
              <Text color={mutedTextColor} fontSize="sm">Owner</Text>
              <Text fontWeight="medium">{flowDetails.owner || "John Doe"}</Text>
            </Box>
          </HStack>
          
          <HStack spacing={6} width="100%">
            <Box>
              <Text color={mutedTextColor} fontSize="sm">Co-Owner</Text>
              <Text fontWeight="medium">{flowDetails.coOwner}</Text>
            </Box>
            <Box>
              <Text color={mutedTextColor} fontSize="sm">Access Level</Text>
              <Text fontWeight="medium">{flowDetails.accessLevel}</Text>
            </Box>
          </HStack>
          
          <HStack spacing={6} width="100%">
            <Box>
              <Text color={mutedTextColor} fontSize="sm">Number of Users</Text>
              <Text fontWeight="medium">{flowDetails.usersWithAccess}</Text>
            </Box>
          </HStack>
        </VStack>
        
        <Divider my={6} />
        
        <Flex justify="space-between" mb={4}>
          <Heading as="h3" size="md" color={textColor}>
            Address
          </Heading>
          
          <Heading as="h3" size="md" color={textColor}>
            Access Level
          </Heading>
        </Flex>
        
        {flowDetails.addresses && flowDetails.addresses.map((item, index) => (
          <Flex 
            key={index}
            justify="space-between" 
            align="center" 
            p={3}
            borderRadius="md"
            bg={hoverBgColor}
            mb={2}
          >
            <Text fontFamily="mono">{item.address}</Text>
            <Badge color={levelColor} fontSize="md">Level {item.level}</Badge>
          </Flex>
        ))}
        
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="blue" 
          variant="outline" 
          w="100%" 
          mt={4}
        >
          Add New Address
        </Button>
      </Box>
    </Box>
  );
};

export default AccessDetailPanel;