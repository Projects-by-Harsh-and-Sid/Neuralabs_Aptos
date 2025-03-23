
import React from 'react';
import { 
  Box, 
  VStack, 
  Button, 
  Text, 
  Flex, 
  IconButton, 
  Divider,
  useColorModeValue,
  Input,
  Tooltip
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiCheck, 
  FiX, 
  FiMessageCircle,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical
} from 'react-icons/fi';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const ChatHistoryPanel = ({ 
  isOpen, 
  chats = [], 
  selectedChatId, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat, 
  onEditChatTitle,
  onToggleSidebar,
  editingChatId,
  setEditingChatId,
  newTitle,
  setNewTitle
}) => {
  // Colors that adapt to light/dark mode
  const bgColor = useColorModeValue("gray.50", "#1a1a1a");
  const borderColor = useColorModeValue("gray.200", "#333");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const selectedBgColor = useColorModeValue("blue.50", "#333");
  const hoverBgColor = useColorModeValue("gray.100", "#282828");
  const buttonBgColor = useColorModeValue("white", "#333");
  const buttonHoverBgColor = useColorModeValue("gray.100", "#444");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  
  const handleEditClick = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setNewTitle(currentTitle);
  };
  
  const handleSaveEdit = (chatId) => {
    if (newTitle.trim()) {
      onEditChatTitle(chatId, newTitle);
    }
    setEditingChatId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingChatId(null);
  };

  // Collapsed sidebar view
  if (!isOpen) {
    return (
      <Box
        w="56px"
        h="100%"
        bg={bgColor}
        borderRight="1px solid"
        borderColor={borderColor}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        position="relative"
      >
        <VStack spacing={0} py={4}>
          {/* Logo / App icon */}
          <Box w="40px" h="40px" display="flex" justifyContent="center" alignItems="center" mb={4}>
            <Flex 
              w="30px" 
              h="30px" 
              borderRadius="full" 
              bg="gray.700"
              alignItems="center" 
              justifyContent="center"
            >
              <Text fontSize="sm" fontWeight="bold" color={textColor}>N</Text>
            </Flex>
          </Box>
          
          {/* Expand sidebar button */}
          <Tooltip label="Expand sidebar" placement="right">
            <IconButton
              icon={<FaAngleDoubleRight size="16px" />}
              aria-label="Expand sidebar"
              variant="ghost"
              color={iconColor}
              _hover={{ color: textColor, bg: hoverBgColor }}
              onClick={onToggleSidebar}
              mb={4}
            />
          </Tooltip>
          
          {/* New chat button */}
          <Tooltip label="New chat" placement="right">
            <IconButton
              icon={<FiPlus />}
              aria-label="New chat"
              variant="ghost"
              color={iconColor}
              _hover={{ color: textColor, bg: hoverBgColor }}
              onClick={onNewChat}
            />
          </Tooltip>
        </VStack>
      </Box>
    );
  }

  // Expanded sidebar view
  return (
    <Box
      w="280px"
      h="100%"
      borderRight="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      transition="width 0.3s ease"
      overflow="hidden"
      position="relative"
    >
      <Flex direction="column" h="100%">
        <Flex p={4} borderBottom="1px solid" borderColor={borderColor} align="center" justify="space-between">
          <Text fontWeight="bold" color={textColor}>Neural Chat</Text>
          <IconButton
            icon={<FaAngleDoubleLeft size="16px" />}
            aria-label="Collapse sidebar"
            variant="ghost"
            size="sm"
            color={iconColor}
            _hover={{ color: textColor }}
            onClick={onToggleSidebar}
          />
        </Flex>
        
        <Box p={3}>
          <Button 
            leftIcon={<FiPlus />} 
            onClick={onNewChat} 
            width="100%" 
            bg={buttonBgColor}
            color={textColor}
            _hover={{ bg: buttonHoverBgColor }}
            boxShadow="sm"
            borderRadius="md"
          >
            New Chat
          </Button>
        </Box>
        
        <Box px={3} py={2}>
          <Text fontSize="xs" fontWeight="medium" color={mutedTextColor} textTransform="uppercase">
            Recent chats
          </Text>
        </Box>
        
        <VStack spacing={0} align="stretch" flex="1" overflowY="auto">
          {chats.map(chat => (
            <Box 
              key={chat.id} 
              role="group"
              borderRadius="md"
              mx={2}
              mb={1}
            >
              {editingChatId === chat.id ? (
                <Flex p={2} align="center">
                  <Input 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    size="sm"
                    autoFocus
                    color={textColor}
                    bg={buttonBgColor}
                    border="none"
                    _focus={{ boxShadow: "none" }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(chat.id);
                      }
                    }}
                  />
                  <IconButton
                    icon={<FiCheck />}
                    aria-label="Save"
                    variant="ghost"
                    size="sm"
                    ml={1}
                    onClick={() => handleSaveEdit(chat.id)}
                  />
                  <IconButton
                    icon={<FiX />}
                    aria-label="Cancel"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  />
                </Flex>
              ) : (
                <Flex
                  p={2}
                  bg={selectedChatId === chat.id ? selectedBgColor : "transparent"}
                  _hover={{ bg: selectedChatId === chat.id ? selectedBgColor : hoverBgColor }}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => onChatSelect(chat.id)}
                  justify="space-between"
                  align="center"
                >
                  <Flex align="center">
                    <Box as={FiMessageCircle} mr={2} color={iconColor} />
                    <Text color={textColor} fontSize="sm" isTruncated>{chat.title}</Text>
                  </Flex>
                  <Flex 
                    visibility="hidden" 
                    _groupHover={{ visibility: "visible" }}
                  >
                    <IconButton
                      icon={<FiMoreVertical />}
                      aria-label="More options"
                      variant="ghost"
                      size="xs"
                      color={iconColor}
                      onClick={(e) => {
                        e.stopPropagation();
                        // In a real app, this would open a dropdown with edit/delete options
                        handleEditClick(chat.id, chat.title);
                      }}
                    />
                  </Flex>
                </Flex>
              )}
            </Box>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default ChatHistoryPanel;