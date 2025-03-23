// src/pages/chat_interface_page.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import ChatPage from '../components/chat_interface/ChatPage/ChatPage';

/**
 * Chat Interface Page
 * 
 * This page renders the chat interface with a collapsible sidebar for chat history,
 * model selection, and @mention functionality.
 */
const ChatInterfacePage = () => {
  return (
    <Box w="100%" h="100%" overflow="hidden">
      <ChatPage />
    </Box>
  );
};

export default ChatInterfacePage;