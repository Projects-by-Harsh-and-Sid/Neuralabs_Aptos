// src/pages/home_page.jsx
import React from 'react';
import { Box, Heading, Text, VStack, Button, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box p={10} h="100%" w="100%" bg={bgColor} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={8} maxW="800px" textAlign="center">
        <Heading as="h1" size="2xl" color={textColor}>Welcome to Neuralabs</Heading>
        <Text fontSize="xl" color={textColor}>
          Build and manage your workflows, explore marketplace resources, and collaborate with your team through our integrated platform.
        </Text>
        <Box pt={8} display="flex" gap={4}>
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={() => navigate('/flow-builder')}
          >
            Flow Builder
          </Button>
          <Button 
            colorScheme="teal" 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/marketplace')}
          >
            Explore Marketplace
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default HomePage;