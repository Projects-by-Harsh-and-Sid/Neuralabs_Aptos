import React from 'react';
import { Box, Heading, Text, VStack, Button, Image, useColorModeValue, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import homepageBackground from '../assets/homepage.png';
import homepageCode from '../assets/homepage-code.png';

const HomePage = () => {
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box 
      p={10} 
      h="100%" 
      w="100%" 
      position="relative"
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundImage: `url(${homepageBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.6,
        zIndex: -2,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: -1,
      }}
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        background="radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.8) 100%)"
        zIndex="-2"
        pointerEvents="none"
      />

      <VStack 
        spacing={8} 
        maxW="1000px"
        textAlign="center"
        p={10}
        borderRadius="xl"
        boxShadow="xl"
      >
        <Heading as="h1" size="2xl" color={textColor}>Welcome to Neuralabs</Heading>
        <Text fontSize="xl" color={textColor}>
          Build and manage your workflows, explore marketplace resources, and collaborate with your team through our integrated platform.
        </Text>
        
        <Flex gap={4} justifyContent="center" wrap="wrap">
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={() => navigate('/flow-builder')}
            bgColor="white"
          >
            <Text color="black">Start Building</Text>
          </Button>
          <Button 
            colorScheme="teal" 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/marketplace')}
          >
            Explore Marketplace
          </Button>
        </Flex>
        
        {/* Image with glow effect behind */}
        <Box 
          position="relative" 
          width="100%" 
          mt={4}
        >
          {/* Glow effect container behind the image */}
          {/* <Box
            position="absolute"
            top="-10px" // Extend slightly above the image
            bottom="-10px" // Extend slightly below the image
            left="10"
            right="10"
            background="rgba(255, 255, 255, 0.1)" // Subtle white base for glow
            boxShadow="0 0 40px 20px rgba(255, 255, 255, 0.3)" // Glow effect with spread
            filter="blur(10px)" // Soften the glow
            zIndex="1" // Behind the image
            pointerEvents="none"
          /> */}

            <Box
            position="absolute"
            top="-10px" // Extend slightly above the image
            bottom="-10px" // Extend slightly below the image
            left="10"
            right="10"
            // background="radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 80%)" // Radial glow that fades out
            // boxShadow="0 0 30px 10px rgba(255, 255, 255, 0.2)" // Reduced glow effect for subtlety
            boxShadow="0 0 400px 3px rgba(255, 255, 255, 0.3)" // Reduced glow effect for subtlety

            filter="blur(15px)" // Slightly increased blur for softer edges
            zIndex="1" // Behind the image
            pointerEvents="none"
          />

          {/* Image container */}
          <Box 
            position="relative"
            borderRadius="md" 
            overflow="hidden"
            boxShadow="lg"
            zIndex="2" // Above the glow
          >
            <Image 
              src={homepageCode} 
              alt="Code visualization" 
              width="100%" 
              objectFit="contain"
              filter="brightness(0.6)"
            />

            {/* Existing vignette effect */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              boxShadow="inset 0 0 50px 10px rgba(0,0,0,0.6)"
              zIndex="3"
              pointerEvents="none"
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default HomePage;