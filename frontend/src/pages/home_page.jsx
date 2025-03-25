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

      {/* Apply 90% scaling to the entire content */}
      <VStack 
        spacing={7} // Reduced from 8
        maxW="900px" // Reduced from 1000px
        textAlign="center"
        p={9} // Reduced from 10
        borderRadius="xl"
        boxShadow="xl"
        transform="scale(0.9)"
        transformOrigin="center"
      >
        <Heading as="h1" size="2xl" color={textColor}>Welcome to Neuralabs</Heading>
        <Text fontSize="lg" color={textColor}> {/* Reduced from xl */}
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
          mt={3.6} // Reduced from 4
        >
          <Box
            position="absolute"
            top="-9px" // Reduced from -10px
            bottom="-9px" // Reduced from -10px
            left="9" // Reduced from 10
            right="9" // Reduced from 10
            boxShadow="0 0 360px 2.7px rgba(255, 255, 255, 0.3)" // Reduced from 400px 3px
            filter="blur(13.5px)" // Reduced from 15px
            zIndex="1"
            pointerEvents="none"
          />

          {/* Image container */}
          <Box 
            position="relative"
            borderRadius="md" 
            overflow="hidden"
            boxShadow="lg"
            zIndex="2"
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
              boxShadow="inset 0 0 45px 9px rgba(0,0,0,0.6)" // Reduced from 50px 10px
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