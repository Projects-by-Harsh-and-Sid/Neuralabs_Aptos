// src/components/chat_interface/ChatPage/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Flex, useDisclosure, useColorMode } from '@chakra-ui/react';
import ChatHistoryPanel from '../ChatHistoryPanel/ChatHistoryPanel';
import ChatInterface from '../ChatInterface';
import useUiColors from '../../../utils/uiColors';

const ChatPage = () => {
  const colors = useUiColors();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLanding, setIsLanding] = useState(true);
  const [thinkingState, setThinkingState] = useState({
    isThinking: false,
    steps: [],
    currentStep: null,
    searchResults: [],
    timeElapsed: 0
  });
  
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Initialize with sample chats
  useEffect(() => {
    const initialChats = [
      { id: '1', title: 'Welcome to Neural Chat' },
      { id: '2', title: 'Travel Planning' },
      { id: '3', title: 'Code Review Help' },
      { id: '4', title: 'Research on Machine Learning' },
    ];
    setChats(initialChats);
  }, []);
  
  // Sample search results to show in thinking UI
  const sampleSearchResults = [
    { 
      icon: '🇺🇸', 
      title: 'Department Press Briefing - March 6, 2025 - United States...',
      url: 'state.gov'
    },
    { 
      icon: 'W', 
      title: 'List of presidents of the United States - Wikipedia',
      url: 'en.wikipedia.org'
    },
    { 
      icon: '🇺🇸', 
      title: 'President in 2025',
      url: 'whowaspresident.com'
    },
    { 
      icon: 'NY', 
      title: 'Tickets to the 60th Inauguration of the President o...',
      url: 'jeffries.house.gov'
    },
    { 
      icon: '🇺🇸', 
      title: 'Department Press Briefing – March 19, 2025 - United State...',
      url: 'state.gov'
    },
    { 
      icon: 'CNN', 
      title: 'President Trump addresses nation on border security',
      url: 'cnn.com'
    },
    { 
      icon: 'NYT', 
      title: 'First 100 Days: President\'s Economic Plan Faces Challenges',
      url: 'nytimes.com'
    }
  ];
  
  // Simulates the thinking process with steps and timing
  const simulateThinking = (query, modelId) => {
    const steps = [
      { name: "Thinking", completed: false },
      { name: "Clarifying the request", completed: false },
      { name: "Searching", completed: false },
      { name: "Analyzing results", completed: false }
    ];
    
    setThinkingState({
      isThinking: true,
      steps,
      currentStep: steps[0],
      searchResults: [],
      timeElapsed: 0
    });
    
    let timer = 0;
    const timerInterval = setInterval(() => {
      timer += 1;
      setThinkingState(prev => ({
        ...prev,
        timeElapsed: timer
      }));
    }, 1000);
    
    // Step 1: Thinking
    setTimeout(() => {
      setThinkingState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx === 0 ? { ...step, completed: true } : step
        ),
        currentStep: steps[1]
      }));
    }, 2000);
    
    // Step 2: Clarifying the request
    setTimeout(() => {
      setThinkingState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx <= 1 ? { ...step, completed: true } : step
        ),
        currentStep: steps[2]
      }));
    }, 5000);
    
    // Step 3: Searching
    setTimeout(() => {
      setThinkingState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx <= 2 ? { ...step, completed: true } : step
        ),
        searchResults: sampleSearchResults,
        currentStep: steps[3]
      }));
    }, 8000);
    
    // Step 4: Analyzing results
    setTimeout(() => {
      setThinkingState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx <= 3 ? { ...step, completed: true } : step
        )
      }));
      
      // Complete thinking
      setTimeout(() => {
        clearInterval(timerInterval);
        setThinkingState(prev => ({
          ...prev,
          isThinking: false
        }));
        
        // Add AI response
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getResponseBasedOnQuery(query, modelId),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 2000);
    }, 12000);
  };
  
  // Returns appropriate response based on the query
  const getResponseBasedOnQuery = (query, modelId) => {
    if (query.toLowerCase().includes('president') || query.toLowerCase().includes('who is')) {
      return "Based on my analysis of current information, Donald Trump is the President of the United States as of March 2025. He was inaugurated for his second term (non-consecutive) on January 20, 2025, after winning the 2024 presidential election.";
    } else if (query.toLowerCase().includes('weather') || query.toLowerCase().includes('forecast')) {
      return "I don't have access to real-time weather data, but I can help you find weather forecasts for your location using weather services. Would you like me to suggest some reliable weather resources?";
    } else if (query.toLowerCase().includes('code') || query.toLowerCase().includes('program')) {
      return "I'd be happy to help with coding. Could you tell me more about what you're trying to build or what programming language you're working with?";
    } else {
      return `I've analyzed your question about "${query}" and here's my response: This is a simulated AI response using the ${modelId} model. In a real application, this would be generated by the actual AI model with relevant information.`;
    }
  };
  
  const handleNewChat = () => {
    setIsLanding(true);
    setSelectedChatId(null);
    setMessages([]);
  };
  
  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setIsLanding(false);
    
    // Simulate loading messages for the selected chat
    if (chatId === '1') {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Hello! Welcome to Neural Chat. How can I assist you today?', 
          timestamp: new Date() 
        },
      ]);
    } else if (chatId === '2') {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Hello! Where would you like to travel to?', 
          timestamp: new Date(Date.now() - 86400000) 
        },
        { 
          id: '2', 
          role: 'user', 
          content: 'I\'m thinking about going to Japan next spring.', 
          timestamp: new Date(Date.now() - 86300000) 
        },
        { 
          id: '3', 
          role: 'assistant', 
          content: 'Japan in spring is beautiful, especially during cherry blossom season! Would you like some recommendations for places to visit?', 
          timestamp: new Date(Date.now() - 86200000) 
        },
      ]);
    } else if (chatId === '3') {
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Hi there! I\'d be happy to help with code review. What code would you like me to look at?', 
          timestamp: new Date(Date.now() - 172800000) 
        },
        { 
          id: '2', 
          role: 'user', 
          content: 'I\'m having trouble with a React component that\'s not rendering properly.', 
          model: 'coder',
          timestamp: new Date(Date.now() - 172700000) 
        },
        { 
          id: '3', 
          role: 'assistant', 
          content: 'I\'d be happy to help. Could you share the component code?', 
          timestamp: new Date(Date.now() - 172600000) 
        },
      ]);
    } else {
      // For new chats or other chats, start with a welcome message
      setMessages([
        { 
          id: '1', 
          role: 'assistant', 
          content: 'Hello! How can I help you today?', 
          timestamp: new Date() 
        },
      ]);
    }
  };
  
  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setIsLanding(true);
      setSelectedChatId(null);
      setMessages([]);
    }
  };
  
  const handleEditChatTitle = (chatId, title) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ));
    setEditingChatId(null);
  };
  
  const handleSendMessage = (content, modelId, useThinking = false) => {
    // Explicitly check if the message has @mention format
    const hasAtMention = content.includes('@');
    
    // If on landing page, create a new chat
    if (isLanding) {
      const newChatId = Date.now().toString();
      const truncatedTitle = content.length > 30 ? content.substring(0, 27) + '...' : content;
      
      const newChat = {
        id: newChatId,
        title: truncatedTitle,
      };
      
      setChats([newChat, ...chats]);
      setSelectedChatId(newChatId);
      setIsLanding(false);
    }
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content,
      model: modelId,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // The thinking UI should trigger either if:
    // 1. The message has an @mention
    // 2. useThinking is explicitly set to true from component
    if (hasAtMention || useThinking) {
      simulateThinking(content, modelId);
    } else {
      // Standard response without thinking UI
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getResponseBasedOnQuery(content, modelId),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };
  
  return (
    <Flex h="100%" w="100%" overflow="hidden" bg={colors.bgPrimary}>
      <ChatHistoryPanel
        isOpen={isOpen}
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onEditChatTitle={handleEditChatTitle}
        onToggleSidebar={onToggle}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
      />
      
      <Flex flex="1" direction="column" h="100%" position="relative" justifyContent={"center"}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLanding={isLanding}
          thinkingState={thinkingState}
          onToggleColorMode={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default ChatPage;