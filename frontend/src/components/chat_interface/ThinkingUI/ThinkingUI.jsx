// src/components/chat_interface/ThinkingUI/ThinkingUI.jsx
import React, { useEffect, useState } from 'react';
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
import thinkresponse from '../../../utils/thinkresponse.json';

const ThinkingUI = ({ thinkingState, query = "", shouldPersist = true }) => {
  const { isThinking, steps, currentStep, searchResults, timeElapsed } = thinkingState;
  const [responseData, setResponseData] = useState(null);

  // Define color variables
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "#1E1E1E");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.600", "gray.400");
  const sourceBgColor = useColorModeValue("gray.50", "gray.800");
  const checkmarkBgColor = useColorModeValue("black", "black");
  const spinnerBgColor = useColorModeValue("gray.200", "gray.700");
  const spinnerColor = useColorModeValue("gray.500", "gray.300");
  const linkColor = useColorModeValue("blue.500", "blue.300");

  const [wasThinking, setWasThinking] = useState(false);

  useEffect(() => {
    if (isThinking) {
      setWasThinking(true);
    }
  }, [isThinking]);

  // Process the JSON data to find matching response
  useEffect(() => {
    console.log("ThinkingUI - Processing JSON data for query:", query);
    if (!query) return;
    
    // Look for a matching response from the thinkresponse.json
    const lowerQuery = query.toLowerCase();
    let matchedResponse = null;
    console.log("lowerQuery:", lowerQuery);
    // First try to find keyword matches
    for (const response of thinkresponse.responses) {
      if (response.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
        matchedResponse = response;
        break;
      }
    }
    
    // If no match found, use the default response (the one with empty keywords array)
    if (!matchedResponse) {
      matchedResponse = thinkresponse.responses.find(r => r.keywords.length === 0) || {
        response: "I'm thinking about how to respond to your query."
      };
    }
    
    // Replace placeholders in the response text
    let responseText = matchedResponse.response;
    responseText = responseText.replace("{{query}}", query);
    responseText = responseText.replace("{{modelId}}", "Claude 3.7 Sonnet");
    
    setResponseData({
      ...matchedResponse,
      response: responseText
    });
  }, [query]);
  
  if (!isThinking && !wasThinking) return null;

  // Optional additional check for shouldPersist prop
  if (!isThinking && !shouldPersist) return null;
  
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
                  width="24px"
                  height="24px"
                  display="flex"
                  bg={step.completed ? checkmarkBgColor : spinnerBgColor}
                  p={1}
                  mr={3}
                  alignItems="center"
                  justifyContent="center"
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
        
        {/* Right column with thinking details - Now using data from JSON */}
        <Box flex="1" p={4} color={textColor}>
          {/* <Text fontSize="lg" fontWeight="medium" mb={4}>
            {currentStep?.name || "Thinking"}
          </Text> */}
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            {(!isThinking && wasThinking) ? "Analysis Complete" : (currentStep?.name || "Thinking")}
          </Text>
          {/* Show step-specific content based on current step */}

          {(!isThinking && wasThinking) ? (
            <VStack align="start" spacing={4}>
              <Text>Analysis completed for: "{query}"</Text>
              {responseData && (
                <Box 
                  bg={sourceBgColor} 
                  p={3} 
                  borderRadius="md" 
                  w="100%"
                >
                  <Text fontSize="sm">{responseData.response}</Text>
                </Box>
              )}
            </VStack>
          ) : (
            <>
          {currentStep?.name === "Clarifying the request" && (
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontSize="md" mb={2}>• Analyzing your query: "{query}"</Text>
                <Text fontSize="md">• Identifying key information needed to provide an accurate answer</Text>
              </Box>
            </VStack>
          )}
          
          {currentStep?.name === "Searching" && (
            <VStack align="start" spacing={3}>
              <Flex align="center">
                <SearchIcon mr={2} />
                <Text fontWeight="medium">Searching for information related to: "{query}"</Text>
              </Flex>
              <Text>{searchResults?.length || 0} results found</Text>
              
              {searchResults && searchResults.map((result, idx) => (
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
              
              {searchResults && searchResults.length > 5 && (
                <Text color={linkColor} cursor="pointer">
                  See more ({searchResults.length - 5})
                </Text>
              )}
            </VStack>
          )}
          
          {currentStep?.name === "Analyzing results" && (
            <VStack align="start" spacing={4}>
              <Text>Analyzing information to provide you with an accurate response...</Text>
              {responseData && (
                <Box 
                  bg={sourceBgColor} 
                  p={3} 
                  borderRadius="md" 
                  w="100%"
                >
                  <Text fontSize="sm">{responseData.response}</Text>
                </Box>
              )}
            </VStack>
          )}
          </>

          )}
        </Box>
      </Flex>
    </Box> 
  );
};

export default ThinkingUI;