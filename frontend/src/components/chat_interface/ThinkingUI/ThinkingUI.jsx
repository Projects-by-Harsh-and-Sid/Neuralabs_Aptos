
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  List,
  ListItem,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiCheck, FiList } from "react-icons/fi";
import { motion } from "framer-motion";
import thinkresponse from "../../../utils/thinkresponse.json";
import thinkingStepTemplates from "../../../utils/thinkingStepTemplates.json";


const ThinkingUI = ({ thinkingState, query = "", shouldPersist = true }) => {
  const { isThinking, steps, currentStep, searchResults, timeElapsed, onTypingComplete } = thinkingState;

  const [responseData, setResponseData] = useState(null);
  const [wasThinking, setWasThinking] = useState(false);
  const scrollableRef = useRef(null);

  // Typing effect states
  const [previousStep, setPreviousStep] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textToType = useRef("");
  const typingSpeed = 30; // milliseconds per character

  // Color variables
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "#1E1E1E");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryColor = useColorModeValue("gray.600", "gray.400");
  const sourceBgColor = useColorModeValue("gray.50", "gray.800");
  const checkmarkBgColor = useColorModeValue("black", "black");
  const spinnerBgColor = useColorModeValue("gray.200", "gray.700");
  const spinnerColor = useColorModeValue("gray.500", "gray.300");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const scrollbarColor = useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)');
  const scrollbarTrackColor = useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)');

  useEffect(() => {
    if (isThinking) {
      setWasThinking(true);
    }
  }, [isThinking]);

  // useEffect(() => {
  //   if (currentStep && currentStep !== previousStep) {
  //     console.log("Current step changed to:", currentStep.name);
  //     setPreviousStep(currentStep);

  //     if (currentStep.name === "Thinking") {
  //       textToType.current = `• Analyzing your query: "${query}"\n
  //     • Breaking down the core components of your request\n
  //     • Identifying key information needed to provide an accurate answer\n
  //     • Determining relevant context and potential ambiguities\n
  //     • Preparing to search for the most up-to-date information\n
  //     • Establishing parameters for comprehensive analysis\n
  //     • Identifying potential knowledge domains relevant to your query\n
  //     • Considering multiple interpretations to ensure accuracy\n
  //     • Planning approach for information synthesis and response generation`;
  //     }

  //     else if (currentStep.name === "Clarifying the request") {
  //       textToType.current = `• Analyzing your query: "${query}"\n
  //     • Breaking down the core components of your request\n
  //     • Identifying key information needed to provide an accurate answer\n
  //     • Determining relevant context and potential ambiguities\n
  //     • Preparing to search for the most up-to-date information\n
  //     • Establishing parameters for comprehensive analysis\n
  //     • Identifying potential knowledge domains relevant to your query\n
  //     • Considering multiple interpretations to ensure accuracy\n
  //     • Planning approach for information synthesis and response generation`;
  //     } else if (currentStep.name === "Searching") {
  //       textToType.current = `Searching for information related to: "${query}"\n
  //     • Accessing specialized knowledge databases\n
  //     • Retrieving recent developments and publications\n
  //     • Cross-referencing multiple authoritative sources\n
  //     • Evaluating source credibility and information relevance\n
  //     • Identifying consensus views and notable exceptions\n
  //     • Collecting technical specifications and supporting data\n
  //     • Gathering contextual information to enhance understanding\n
  //     • Prioritizing sources based on recency and authority`;
  //     } else if (currentStep.name === "Analyzing results") {
  //       textToType.current = `Analyzing gathered information to provide a comprehensive response...\n
  //     • Synthesizing data from multiple sources\n
  //     • Resolving potential contradictions between sources\n
  //     • Organizing information in a logical structure\n
  //     • Prioritizing the most relevant facts for your query\n
  //     • Identifying key insights and practical applications\n
  //     • Formulating explanations at appropriate technical depth\n
  //     • Preparing examples to illustrate complex concepts\n
  //     • Generating analogies to enhance understanding\n
  //     • Checking for completeness and accuracy\n
  //     • Finalizing response with the most valuable information`;
  //     }

  //     setTypedText("");
  //     setIsTyping(true);
  //   }
  // }, [currentStep, previousStep, query]);
  useEffect(() => {
    if (currentStep && currentStep !== previousStep) {
      console.log("Current step changed to:", currentStep.name);
      setPreviousStep(currentStep);

      // Get the step template from the JSON file
      const stepTemplate = thinkingStepTemplates.steps[currentStep.name];
      
      if (stepTemplate) {
        // Replace any placeholders in the template
        let templateText = stepTemplate.text;
        templateText = templateText.replace(/\{\{query\}\}/g, query);
        
        textToType.current = templateText;
      } else {
        // Fallback if step name not found in templates
        textToType.current = `Processing ${currentStep.name} for: "${query}"`;
      }

      setTypedText("");
      setIsTyping(true);
    }
  }, [currentStep, previousStep, query]);


  useEffect(() => {
    if (scrollableRef.current && isTyping) {
      const scrollElement = scrollableRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [typedText, isTyping]);

  useEffect(() => {
    if (!isTyping) return;

    let i = 0;
    const text = textToType.current;
    console.log("Starting typing effect for text:", text);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        console.log("Typing complete for step:", currentStep?.name);
        if (onTypingComplete) {
          console.log("Calling onTypingComplete");
          onTypingComplete();
        }
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [isTyping, onTypingComplete, currentStep]);

  useEffect(() => {
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    let matchedResponse = null;

    for (const response of thinkresponse.responses) {
      if (
        response.keywords.some((keyword) =>
          lowerQuery.includes(keyword.toLowerCase())
        )
      ) {
        matchedResponse = response;
        break;
      }
    }

    if (!matchedResponse) {
      matchedResponse = thinkresponse.responses.find(
        (r) => r.keywords.length === 0
      ) || {
        response: "I'm thinking about how to respond to your query.",
      };
    }

    let responseText = matchedResponse.response;
    responseText = responseText.replace("{{query}}", query);
    responseText = responseText.replace("{{modelId}}", "Claude 3.7 Sonnet");

    setResponseData({
      ...matchedResponse,
      response: responseText,
    });
  }, [query]);

  if (!isThinking && !wasThinking) return null;
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
        <Box w="250px" p={4} borderRight="1px solid" borderColor={borderColor}>
          <Flex align="center" mb={4}>
            <SearchIcon mr={2} />
            <Text fontWeight="medium" color={textColor}>
              {steps.length > 0 && steps[steps.length - 1].completed
                ? "Completed"
                : "Thinking"}
            </Text>
            <Text fontSize="sm" color={secondaryColor} ml={2}>
              {timeElapsed}s
            </Text>
          </Flex>

          <List spacing={3}>
            {steps.map((step, index) => {
              const allPreviousCompleted = steps
                .slice(0, index)
                .every((prevStep) => prevStep.completed);

              const shouldShow =
                allPreviousCompleted ||
                (currentStep && currentStep.name === step.name);

              if (!shouldShow) return null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem display="flex" alignItems="center">
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
                </motion.div>
              );
            })}
          </List>
        </Box>

        <Box 
          flex="1" 
          p={4} 
          color={textColor}
          position="relative"
          display="flex"
          flexDirection="column"
        >
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            {!isThinking && wasThinking
              ? "Analysis Complete"
              : currentStep?.name || "Thinking"}
          </Text>

          <Box
            overflow="auto"
            maxHeight="400px"
            position="relative"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                width: '10px',
                background: scrollbarColor,
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollbarTrackColor,
                borderRadius: '24px',
              },
            }}
            ref={scrollableRef}
          >
            {!isThinking && wasThinking ? (
              <VStack align="start" spacing={4} w="100%">
                <Text>Analysis completed for: "{query}"</Text>
                {responseData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: "100%" }}
                  >
                    <Box bg={sourceBgColor} p={3} borderRadius="md" w="100%">
                      <Text fontSize="sm">{responseData.response}</Text>
                    </Box>
                  </motion.div>
                )}
              </VStack>
            ) : (
              <>
                {currentStep?.name === "Thinking" && (
                  <VStack align="start" spacing={4}>
                    <Box>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Text fontSize="md" whiteSpace="pre-line">
                          {typedText}
                        </Text>
                      </motion.div>
                    </Box>
                  </VStack>
                )}

                {currentStep?.name === "Clarifying the request" && (
                  <VStack align="start" spacing={4}>
                    <Box>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Text fontSize="md" whiteSpace="pre-line">
                          {typedText}
                        </Text>
                      </motion.div>
                    </Box>
                  </VStack>
                )}

                {currentStep?.name === "Searching" && (
                  <VStack align="start" spacing={3}>
                    <Flex align="center">
                      <SearchIcon mr={2} />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Text fontWeight="medium">{typedText}</Text>
                      </motion.div>
                    </Flex>

                    {!isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Text>{searchResults?.length || 0} results found</Text>
                      </motion.div>
                    )}

                    {!isTyping &&
                      searchResults &&
                      searchResults.map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                          style={{ width: "100%" }}
                        >
                          <Box w="100%" py={2}>
                            <Flex align="center">
                              <Box
                                as="span"
                                mr={2}
                                fontSize="sm"
                                p={1}
                                borderRadius="md"
                                bg={sourceBgColor}
                              >
                                {result.icon}
                              </Box>
                              <Text fontWeight="medium">{result.title}</Text>
                            </Flex>
                            <Text fontSize="sm" color={secondaryColor} ml={8}>
                              {result.url}
                            </Text>
                          </Box>
                        </motion.div>
                      ))}

                    {!isTyping && searchResults && searchResults.length > 5 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <Text color={linkColor} cursor="pointer">
                          See more ({searchResults.length - 5})
                        </Text>
                      </motion.div>
                    )}
                  </VStack>
                )}

                {currentStep?.name === "Analyzing results" && (
                  <VStack align="start" spacing={4}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Text>{typedText}</Text>
                    </motion.div>

                    {!isTyping && responseData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Box bg={sourceBgColor} p={3} borderRadius="md" w="100%">
                          <Text fontSize="sm">{responseData.response}</Text>
                        </Box>
                      </motion.div>
                    )}
                  </VStack>
                )}
              </>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ThinkingUI;