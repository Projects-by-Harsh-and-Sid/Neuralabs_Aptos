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
  const colors = useUiColors();

  return (
    <Flex w="100%" maxW="900px" mx="auto" direction="column" mb={8}>
      <Flex justify={isUser ? "flex-end" : "flex-start"}>
        <Box
          maxW={isUser ? "300px" : "70%"}
          p={3}
          borderRadius="lg"
          bg={isUser ? colors.userMessageBg : colors.assistantMessageBg}
          color={colors.textPrimary}
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
            color={colors.iconColor}
            _hover={{ color: colors.textPrimary }}
          />
          <IconButton
            icon={<FiThumbsDown />}
            aria-label="Thumbs down"
            size="sm"
            variant="ghost"
            color={colors.iconColor}
            _hover={{ color: colors.textPrimary }}
          />
          <IconButton
            icon={<FiCode />}
            aria-label="Copy code"
            size="sm"
            variant="ghost"
            color={colors.iconColor}
            _hover={{ color: colors.textPrimary }}
          />
          <IconButton
            icon={<FiPaperclip />}
            aria-label="Save"
            size="sm"
            variant="ghost"
            color={colors.iconColor}
            _hover={{ color: colors.textPrimary }}
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

  // Get color variables
  const colors = useUiColors();

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Check for @mention
    if (value.includes("@")) {
      const mentionParts = value.split("@");
      const mentionText = mentionParts[mentionParts.length - 1].split(" ")[0];

      if (mentionText !== "") {
        setMentionActive(true);
        setFilteredModels(
          AI_MODELS.filter((model) =>
            model.name.toLowerCase().includes(mentionText.toLowerCase())
          )
        );
      } else {
        setMentionActive(true);
        setFilteredModels(AI_MODELS);
      }
    } else {
      setMentionActive(false);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Check if this message has an @mention to trigger thinking UI
    const hasAtMention = input.includes("@");
    let modelId = selectedModel.id;

    // If the message has @mention, extract the model name
    if (hasAtMention) {
      // Find the mentioned model name
      const mentionParts = input.split("@");
      const mentionText = mentionParts[1].split(" ")[0];

      // Find the matching model
      const mentionedModel = AI_MODELS.find(
        (model) => model.name.toLowerCase() === mentionText.toLowerCase()
      );

      if (mentionedModel) {
        modelId = mentionedModel.id;
      }
    }

    // Send the message with the appropriate model
    onSendMessage(input, modelId, hasAtMention);
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
      bg={colors.bgPrimary}
      color={colors.textPrimary}
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
          <Text fontSize="2xl" fontWeight="medium" mb={2}>
            Good afternoon, User.
          </Text>
          <Text fontSize="xl" color={colors.textSecondary}>
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
      <Box p={5} pb={10}> {/* Add position relative here */}
        <Flex
          direction="column"
          borderRadius="lg"
          bg={colors.bgInput}
          border="1px solid"
          borderColor={colors.borderColor}
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
              top={isLanding ? "100%" : "auto"}
              bottom={isLanding ? "auto" : "100%"}
              left="50%"
              transform="translateX(-50%)"
              width="80%"
              maxW="600px"
              bg={colors.bgSecondary}
              boxShadow="md"
              borderRadius="md"
              mt={isLanding ? 2 : 0} // Margin top when below
              mb={isLanding ? 0 : 2} // Margin bottom when above
              zIndex={10}
              border="1px solid"
              borderColor={colors.borderColor}
            >
              <VStack align="stretch" p={2} maxH="200px" overflow="auto">
                <Text
                  fontWeight="bold"
                  p={2}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  Select AI Model
                </Text>
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <Flex
                      key={model.id}
                      p={2}
                      _hover={{ bg: colors.bgHover }}
                      cursor="pointer"
                      onClick={() => handleMentionSelect(model)}
                      borderRadius="md"
                    >
                      <Text>{model.name}</Text>
                    </Flex>
                  ))
                ) : (
                  <Text p={2}>No models found</Text>
                )}
              </VStack>
            </Box>
          )}

          <Divider my={2} borderColor={colors.borderColor} />

          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <IconButton
                icon={<FiPaperclip />}
                aria-label="Attach file"
                variant="ghost"
                size="sm"
                color={colors.iconColor}
              />

            <Menu placement={isLanding ? "bottom" : "top"} gutter={4}>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="sm"
                  variant="ghost"
                  color={colors.iconColor}
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
                  bg={colors.bgSecondary}
                  borderColor={colors.borderColor}
                >
                  <MenuItem
                    icon={<FiSearch />}
                    onClick={() => setToolSelectionMode("deepSearch")}
                    _hover={{ bg: colors.bgHover }}
                  >
                    DeepSearch
                  </MenuItem>
                  <MenuItem
                    icon={<FiCode />}
                    onClick={() => setToolSelectionMode("think")}
                    _hover={{ bg: colors.bgHover }}
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
                  color={colors.iconColor}
                >
                  {selectedModel.name}
                </MenuButton>
                <MenuList
                  bg={colors.bgSecondary}
                  borderColor={colors.borderColor}
                >
                  {AI_MODELS.map((model) => (
                    <MenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      _hover={{ bg: colors.bgHover }}
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
