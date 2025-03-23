// src/components/chat_interface/ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Textarea,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tooltip,
  Divider,
  Center,
  VStack,
} from "@chakra-ui/react";
import {
  FiSend,
  FiChevronDown,
  FiPaperclip,
  FiArrowUp,
  FiCode,
  FiImage,
  FiSearch,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";

// Import the separate ThinkingUI component
import ThinkingUI from "./ThinkingUI/ThinkingUI";

// Import colors
import useUiColors from "../../utils/uiColors";
import colors from "../../color";
import { useColorModeValue } from "@chakra-ui/react";
// Sample AI models/agents
const AI_MODELS = [
  { id: "grok-3", name: "Grok 3" },
  { id: "grok-2", name: "Grok 2" },
  { id: "creative", name: "Creative Writer" },
  { id: "coder", name: "Code Assistant" },
  { id: "analyst", name: "Data Analyst" },
];

// const TOOLS = [
//   { id: 'jfk-files', name: 'JFK Files', icon: FiSearch },
//   { id: 'research', name: 'Research', icon: FiSearch },
//   { id: 'create-images', name: 'Create Images', icon: FiImage },
//   { id: 'how-to', name: 'How to', icon: FiCode },
//   { id: 'analyze', name: 'Analyze', icon: FiSearch },
//   { id: 'code', name: 'Code', icon: FiCode }
// ];

const Message = ({ message }) => {
  const isUser = message.role === "user";
//   const colors = useUiColors();

  const userMessageBg = useColorModeValue(colors.chat.userMessageBg.light, colors.chat.userMessageBg.dark);
  const assistantMessageBg = useColorModeValue(colors.chat.assistantMessageBg.light, colors.chat.assistantMessageBg.dark);
  const textColor = useColorModeValue(colors.chat.textPrimary.light, colors.chat.textPrimary.dark);
  const iconColor = useColorModeValue(colors.chat.iconColor.light, colors.chat.iconColor.dark);

  return (
    <Flex w="100%" maxW="900px" mx="auto" direction="column" mb={8}>
      <Flex justify={isUser ? "flex-end" : "flex-start"}>
        <Box
          maxW={isUser ? "300px" : "70%"}
          p={3}
          borderRadius="lg"
          bg={isUser ? userMessageBg : assistantMessageBg}
          color={textColor}
        >
          <Text>{message.content}</Text>
        </Box>
      </Flex>

      {!isUser && (
        <HStack mt={2} spacing={2}>
          <IconButton
            icon={<FiThumbsUp />}
            aria-label="Thumbs up"
            size="sm"
            variant="ghost"
            color={iconColor}
            _hover={{ color: textColor }}
          />
          <IconButton
            icon={<FiThumbsDown />}
            aria-label="Thumbs down"
            size="sm"
            variant="ghost"
            color={iconColor}
            _hover={{ color: textColor }}
          />
          <IconButton
            icon={<FiCode />}
            aria-label="Copy code"
            size="sm"
            variant="ghost"
            color=  {iconColor}
            _hover={{ color: textColor }}
          />
          <IconButton
            icon={<FiPaperclip />}
            aria-label="Save"
            size="sm"
            variant="ghost"
            color=  {iconColor}
            _hover={{ color: textColor }}
          />
        </HStack>
      )}
    </Flex>
  );
};

const ChatInterface = ({
  messages,
  onSendMessage,
  isLanding = false,
  thinkingState = { isThinking: false },
  onToggleColorMode,
}) => {
  const [input, setInput] = useState("");
  const [mentionActive, setMentionActive] = useState(false);
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [toolSelectionMode, setToolSelectionMode] = useState("deepSearch");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [aiagentSelected, setaiagentSelected] = useState(false);


  // Get color variables
//   const colors = useUiColors();

  const bgPrimary = useColorModeValue(colors.chat.bgPrimary.light, colors.chat.bgPrimary.dark);
  const bgSecondary = useColorModeValue(colors.chat.bgSecondary.light, colors.chat.bgSecondary.dark);
  const bgInput = useColorModeValue(colors.chat.bgInput.light, colors.chat.bgInput.dark);
  const bgHover = useColorModeValue(colors.chat.bgHover.light, colors.chat.bgHover.dark);
  const textPrimary = useColorModeValue(colors.chat.textPrimary.light, colors.chat.textPrimary.dark);
  const textSecondary = useColorModeValue(colors.chat.textSecondary.light, colors.chat.textSecondary.dark);
  const borderColor = useColorModeValue(colors.chat.borderColor.light, colors.chat.borderColor.dark);
  const iconColor = useColorModeValue(colors.chat.iconColor.light, colors.chat.iconColor.dark);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    // If the input is empty, reset the mentionSelected flag
    if (value.trim() === "") {
        setaiagentSelected(false);
    }
  
    // Only check for @ mentions if we haven't already selected a mention for this message
    if (value.includes("@") && !aiagentSelected) {
      console.log("@ detected in input and no mention previously selected");
      
      const atPosition = value.lastIndexOf("@");
      const textAfterAt = value.substring(atPosition + 1);
      
      console.log("Text after @:", textAfterAt);
      
      // Activate dropdown when @ is typed and no model has been selected yet
      setMentionActive(true);
      
      if (textAfterAt.trim() !== "") {
        const filtered = AI_MODELS.filter((model) =>
          model.name.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        console.log("Filtered models:", filtered);
        setFilteredModels(filtered);
      } else {
        console.log("Showing all models");
        setFilteredModels(AI_MODELS);
      }
    } else {
      setMentionActive(false);
    }
  };




const handleSendMessage = () => {
    if (input.trim() === "") return;
  
    // Check if this message has an @mention
    const hasAtMention = input.includes("@");
    let modelId = selectedModel.id;
    let cleanMessage = input;
    let useThinkMode = toolSelectionMode === "think";
  
    // If the message has @mention, extract the model name and remove it from message
    if (hasAtMention) {
      // First just extract everything after the @ symbol
      const atPosition = input.indexOf("@");
      const textAfterAt = input.substring(atPosition + 1);
      
      // Check each model name to see if it appears at the start of the text after @
      let matchedModel = null;
      let matchedModelName = "";
      
      // Sort models by name length (descending) to match longer names first
      // This prevents "Grok" matching before "Grok 3"
      const sortedModels = [...AI_MODELS].sort(
        (a, b) => b.name.length - a.name.length
      );
      
      for (const model of sortedModels) {
        if (textAfterAt.toLowerCase().startsWith(model.name.toLowerCase())) {
          matchedModel = model;
          matchedModelName = model.name;
          break;
        }
      }
      
      if (matchedModel) {
        modelId = matchedModel.id;
        
        // Get everything before the @ and everything after the model name
        const beforeMention = input.substring(0, atPosition);
        const afterModelName = textAfterAt.substring(matchedModelName.length);
        
        // Create clean message by combining before @ and after model name
        cleanMessage = beforeMention + afterModelName;
        
        // Always enable think mode when an agent is mentioned with @
        useThinkMode = true;
      }
    }
    
    // Debug logs to verify the extraction
    console.log("Original input:", input);
    console.log("Clean message:", cleanMessage);
    console.log("Selected model:", modelId);
    console.log("Using Think mode:", useThinkMode);
    
    // Send the clean message with the appropriate model and think mode flag
    onSendMessage(cleanMessage.trim(), modelId, useThinkMode);
    setInput("");
    setMentionActive(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMentionSelect = (model) => {
    // Replace the @mention text with the selected model
    const beforeMention = input.split("@")[0];
    const afterMention =
      input.split("@").length > 1
        ? input.split("@")[1].split(" ").slice(1).join(" ")
        : "";
    setInput(`${beforeMention}@${model.name} ${afterMention}`);
    setMentionActive(false);
    
    // Set the flag to indicate a mention has been selected for this message
    setaiagentSelected(true);
    
    inputRef.current?.focus();
  };
  

  const handleToolSelect = (tool) => {
    // In a real app, this would activate the selected tool
    console.log(`Selected tool: ${tool}`);
  };

  return (
    <Flex
      direction="column"
      h={messages.length > 0 ? "100%" : "auto"} // Dynamic height
      bg={bgPrimary}
      color={textPrimary}
      transition="height 0.3s ease" // Smooth transition for height change
    >
      {isLanding ? (
        <Flex
          flex="1"
          direction="column"
          justify="center"
          align="center"
          px={4}
        >
          <Text fontSize="2xl" fontWeight="medium">
            Good afternoon, User.
          </Text>
          <Text fontSize="xl" color={textSecondary}>
            How can I help you today?
          </Text>
        </Flex>
      ) : (
        <Box flex="1" overflowY="auto" px={6} py={10}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {/* Use the imported ThinkingUI component */}
          {thinkingState.isThinking && (
            <ThinkingUI thinkingState={thinkingState} />
          )}

          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* Tools section */}
      {/* {isLanding && (
        <Center mb={5}>
          <HStack spacing={4} overflowX="auto" py={2} px={2}>
            {TOOLS.map((tool) => (
              <Button
                key={tool.id}
                leftIcon={<tool.icon />}
                size="md"
                variant="ghost"
                color={colors.textSecondary}
                _hover={{ bg: colors.bgHover }}
                onClick={() => handleToolSelect(tool.id)}
                borderRadius="md"
                minW="auto"
              >
                {tool.name}
              </Button>
            ))}
          </HStack>
        </Center>
      )} */}

      {/* Footer with input */}
      <Box p={5} pb={10} > {/* Add position relative here */}
        <Flex
          direction="column"
          borderRadius="lg"
          bg={bgInput}
          border="1px solid"
          borderColor={borderColor}
          p={2}
          maxW={isLanding ? "600px" : "900px"}
          mx="auto"
          boxShadow="sm"
        //   position="relative" // Add position relative here without disturbing layout
        >
          <Textarea
            placeholder={
              isLanding ? "What do you want to know?" : "How can Grok help?"
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            size="md"
            bg="transparent"
            border="none"
            _focus={{ border: "none", boxShadow: "none" }}
            resize="none"
            minH="40px"
            maxH="200px"
            overflow="auto"
            ref={inputRef}
          />

          {mentionActive && (
            <Box
              position="absolute"
              // Position based on chat state: below input for new chat, above input for existing chat
              top={isLanding ? "58%" : "auto"}
              bottom={isLanding ? "auto" : "16%"}
            //   left="50%"
            //   transform="translateX(-40%)"
              width="50%"
              maxW="300px"
              bg={bgSecondary}
              boxShadow="md"
              borderRadius="md"
              mt={isLanding ? 2 : 0} // Margin top when below
              mb={isLanding ? 0 : 2} // Margin bottom when above
              zIndex={10}
              border="1px solid"
              borderColor={borderColor}
              px={2}
            >
              <VStack align="stretch"
               p={2} 
               maxH="200px" overflow="auto">
                {/* <Text
                  fontWeight="bold"
                  p={2}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  Select Agent
                </Text> */}
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <Flex
                      key={model.id}
                      px={2}
                      py={0.5}
                      _hover={{ bg: bgHover }}
                      cursor="pointer"
                      onClick={() => handleMentionSelect(model)}
                      borderRadius="md"
                    >
                      <Text>{model.name}</Text>
                    </Flex>
                  ))
                ) : (
                  <Text 
                  p={2}
                  >No models found</Text>
                )}
              </VStack>
            </Box>
          )}

          <Divider my={2} borderColor={borderColor} />

          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <IconButton
                icon={<FiPaperclip />}
                aria-label="Attach file"
                variant="ghost"
                size="sm"
                color={iconColor}
              />

            <Menu placement={isLanding ? "bottom" : "top"} gutter={4}>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="sm"
                  variant="ghost"
                  color={iconColor}
                >
                  <Flex align="center">
                    <Box
                      mr={1}
                      as={
                        toolSelectionMode === "deepSearch" ? FiSearch : FiCode
                      }
                    />
                    {toolSelectionMode === "deepSearch"
                      ? "DeepSearch"
                      : "Think"}
                  </Flex>
                </MenuButton>
                <MenuList
                  bg={bgSecondary}
                  borderColor={borderColor}
                  p={0}
                  marginTop={isLanding ? "10px" : "0"}
                  borderRadius={"md"}
                //   position={"absolute"}
                //   left={isLanding ? "20%" : "0"}
                //   width="10px"
                >
                  <MenuItem
                    icon={<FiSearch />}
                    onClick={() => setToolSelectionMode("deepSearch")}
                    _hover={{ bg: bgHover }}
                    bg={bgSecondary}
                    
                  >
                    DeepSearch
                  </MenuItem>
                  <MenuItem
                    icon={<FiCode />}
                    onClick={() => setToolSelectionMode("think")}
                    _hover={{ bg: bgHover }}
                    bg={bgSecondary}
                  >
                    Think
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            <HStack>
            <Menu placement={isLanding ? "bottom-end" : "top-end"} gutter={4}>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="sm"
                  variant="ghost"
                  color={iconColor}
                >
                  {selectedModel.name}
                </MenuButton>
                <MenuList
                  bg={bgSecondary}
                  borderColor={borderColor}
                  p={0}
                  marginTop={isLanding ? "10px" : "0"} 
                >
                  {AI_MODELS.map((model) => (
                    <MenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      _hover={{ bg: bgHover }}
                    bg={bgSecondary}

                    >
                      {model.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Tooltip label="Send message">
                <IconButton
                  icon={<FiArrowUp />}
                  aria-label="Send message"
                  colorScheme="blue"
                  size="sm"
                  isRound
                  isDisabled={input.trim() === ""}
                  onClick={handleSendMessage}
                />
              </Tooltip>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ChatInterface;
