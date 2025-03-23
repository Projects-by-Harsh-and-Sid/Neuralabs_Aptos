// src/components/chat_interface/ThinkingUI/ThinkingUI.jsx
import React from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  Text, 
  List, 
  ListItem, 
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { 
  SearchIcon 
} from '@chakra-ui/icons';
import { 
  FiCheck, 
  FiList 
} from 'react-icons/fi';

const ThinkingUI = ({ thinkingState }) => {
  const { isThinking, steps, currentStep, searchResults, timeElapsed } = thinkingState;
  
  // Define color variables
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "#1E1E1E");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.600", "gray.400");
  const sourceBgColor = useColorModeValue("gray.50", "gray.800");
  const checkmarkBgColor = useColorModeValue("green.500", "green.400");
  const spinnerBgColor = useColorModeValue("gray.200", "gray.700");
  const spinnerColor = useColorModeValue("gray.500", "gray.300");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  
  if (!isThinking) return null;
  
  return (
    <Box 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="md" 
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      maxW="900px"
      mx="auto"
      mb={8}
    >
      <Flex>
        {/* Left column with step indicators */}
        <Box 
          w="250px" 
          p={4} 
          borderRight="1px solid" 
          borderColor={borderColor}
        >
          <Flex align="center" mb={4}>
            <SearchIcon mr={2} />
            <Text fontWeight="medium" color={textColor}>
              {steps.length > 0 && steps[steps.length-1].completed ? 'Completed' : 'Thinking'}
            </Text>
            <Text fontSize="sm" color={secondaryColor} ml={2}>
              {timeElapsed}s
            </Text>
          </Flex>
          
          <List spacing={3}>
            {steps.map((step, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <Box 
                  borderRadius="full" 
                  bg={step.completed ? checkmarkBgColor : spinnerBgColor}
                  p={1}
                  mr={3}
                >
                  {step.completed ? (
                    <FiCheck color="white" size={14} />
                  ) : (
                    <Spinner size="xs" color={spinnerColor} />
                  )}
                </Box>
                <Text color={textColor}>{step.name}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Right column with thinking details */}
        <Box flex="1" p={4} color={textColor}>
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            {currentStep?.name || "Thinking"}
          </Text>
          
          {/* Show step-specific content */}
          {currentStep?.name === "Clarifying the request" && (
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontSize="md" mb={2}>• The request is about finding out "who is the president of us." I'm thinking "us" probably means the United States here, given it's a standard abbreviation.</Text>
                <Text fontSize="md">• Now, the question is clear: "Who is the president of the United States?" Let's check the current date, March 22, 2025</Text>
              </Box>
            </VStack>
          )}
          
          {currentStep?.name === "Searching" && (
            <VStack align="start" spacing={3}>
              <Flex align="center">
                <SearchIcon mr={2} />
                <Text fontWeight="medium">Searching for "who is the president of the United States on March 22, 2025"</Text>
              </Flex>
              <Text>10 results found</Text>
              
              {searchResults.map((result, idx) => (
                <Box key={idx} w="100%" py={2}>
                  <Flex align="center">
                    <Box as="span" mr={2} fontSize="sm" p={1} borderRadius="md" bg={sourceBgColor}>
                      {result.icon}
                    </Box>
                    <Text fontWeight="medium">{result.title}</Text>
                  </Flex>
                  <Text fontSize="sm" color={secondaryColor} ml={8}>{result.url}</Text>
                </Box>
              ))}
              
              {searchResults.length > 5 && (
                <Text color={linkColor} cursor="pointer">
                  See more ({searchResults.length - 5})
                </Text>
              )}
            </VStack>
          )}
          
          {currentStep?.name === "Analyzing results" && (
            <VStack align="start" spacing={4}>
              <Text>Analyzing information from multiple sources to determine the current president...</Text>
              <Box 
                bg={sourceBgColor} 
                p={3} 
                borderRadius="md" 
                w="100%"
              >
                <Text fontSize="sm">Based on multiple sources including official government websites and news articles, Donald Trump is the current president of the United States as of March 22, 2025. He was inaugurated on January 20, 2025 after winning the 2024 presidential election.</Text>
              </Box>
            </VStack>
          )}
        </Box>
      </Flex>
      
      {/* Footer with sources count */}
      <Flex 
        p={3} 
        borderTop="1px solid" 
        borderColor={borderColor}
        bg={sourceBgColor}
        align="center"
      >
        <Flex align="center" justify="center" p={1} borderRadius="md" mr={2}>
          <FiList size={14} />
          <Text ml={1} fontWeight="medium" fontSize="sm">12 web pages</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ThinkingUI;