// // src/components/chat_interface/ChatInterface.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Flex,
//   Text,
//   Textarea,
//   IconButton,
//   HStack,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Button,
//   useColorModeValue,
//   Tooltip,
//   Divider,
//   Center
// } from '@chakra-ui/react';
// import { 
//   FiSend, 
//   FiChevronDown, 
//   FiPaperclip, 
//   FiMic, 
//   FiArrowUp,
//   FiCode,
//   FiImage,
//   FiSearch,
//   FiThumbsUp,
//   FiThumbsDown
// } from 'react-icons/fi';

// // Sample AI models/agents
// const AI_MODELS = [
//   { id: 'grok-3', name: 'Grok 3' },
//   { id: 'grok-2', name: 'Grok 2' },
//   { id: 'creative', name: 'Creative Writer' },
//   { id: 'coder', name: 'Code Assistant' },
//   { id: 'analyst', name: 'Data Analyst' }
// ];

// const TOOLS = [
//   { id: 'jfk-files', name: 'JFK Files', icon: FiSearch },
//   { id: 'research', name: 'Research', icon: FiSearch },
//   { id: 'create-images', name: 'Create Images', icon: FiImage },
//   { id: 'how-to', name: 'How to', icon: FiCode },
//   { id: 'analyze', name: 'Analyze', icon: FiSearch },
//   { id: 'code', name: 'Code', icon: FiCode }
// ];

// const Message = ({ message }) => {
//   const isUser = message.role === 'user';
  
//   return (
//     <Flex 
//       w="100%" 
//       maxW="900px" 
//       mx="auto" 
//       direction="column" 
//       mb={8}
//     >
//       <Flex justify={isUser ? 'flex-end' : 'flex-start'}>
//         <Box
//           maxW={isUser ? "300px" : "70%"}
//           p={3}
//           borderRadius="lg"
//           bg={isUser ? "gray.700" : "transparent"}
//           color="white"
//         >
//           <Text>{message.content}</Text>
//         </Box>
//       </Flex>
      
//       {!isUser && (
//         <HStack mt={2} spacing={2}>
//           <IconButton
//             icon={<FiThumbsUp />}
//             aria-label="Thumbs up"
//             size="sm"
//             variant="ghost"
//             color="gray.400"
//             _hover={{ color: "white" }}
//           />
//           <IconButton
//             icon={<FiThumbsDown />}
//             aria-label="Thumbs down"
//             size="sm"
//             variant="ghost"
//             color="gray.400"
//             _hover={{ color: "white" }}
//           />
//           <IconButton
//             icon={<FiCode />}
//             aria-label="Copy code"
//             size="sm"
//             variant="ghost"
//             color="gray.400"
//             _hover={{ color: "white" }}
//           />
//           <IconButton
//             icon={<FiPaperclip />}
//             aria-label="Save"
//             size="sm"
//             variant="ghost"
//             color="gray.400"
//             _hover={{ color: "white" }}
//           />
//         </HStack>
//       )}
//     </Flex>
//   );
// };

// const ChatInterface = ({ messages, onSendMessage, isLanding = false }) => {
//   const [input, setInput] = useState('');
//   const [mentionActive, setMentionActive] = useState(false);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
//   const [toolSelectionMode, setToolSelectionMode] = useState('deepSearch');
//   const [showThink, setShowThink] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
  
//   useEffect(() => {
//     // Scroll to bottom when messages change
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
  
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInput(value);
    
//     // Check for @mention
//     if (value.includes('@')) {
//       const mentionText = value.split('@').pop().split(' ')[0];
//       if (mentionText !== '') {
//         setMentionActive(true);
//         setFilteredModels(
//           AI_MODELS.filter(model => 
//             model.name.toLowerCase().includes(mentionText.toLowerCase())
//           )
//         );
//       } else {
//         setMentionActive(true);
//         setFilteredModels(AI_MODELS);
//       }
//     } else {
//       setMentionActive(false);
//     }
//   };
  
//   const handleSendMessage = () => {
//     if (input.trim() === '') return;
    
//     onSendMessage(input, selectedModel.id);
//     setInput('');
//     setMentionActive(false);
//   };
  
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };
  
//   const handleToolSelect = (tool) => {
//     // In a real app, this would activate the selected tool
//     console.log(`Selected tool: ${tool}`);
//   };
  
//   const toggleThink = () => {
//     setShowThink(!showThink);
//   };
  
//   return (
//     <Flex 
//       direction="column" 
//       h="100%" 
//       bg="#121212"
//       color="white"
//     >
//       {isLanding ? (
//         <Flex 
//           flex="1" 
//           direction="column" 
//           justify="center" 
//           align="center" 
//           px={4}
//         >
//           <Text fontSize="2xl" fontWeight="medium" mb={2}>
//             Good afternoon, User.
//           </Text>
//           <Text fontSize="xl" color="gray.400" mb={20}>
//             How can I help you today?
//           </Text>
//         </Flex>
//       ) : (
//         <Box flex="1" overflowY="auto" px={6} py={10}>
//           {messages.map(message => (
//             <Message key={message.id} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </Box>
//       )}
      
//       {/* Tools section */}
//       {isLanding && (
//         <Center mb={5}>
//           <HStack spacing={4} overflowX="auto" py={2} px={2}>
//             {TOOLS.map((tool) => (
//               <Button
//                 key={tool.id}
//                 leftIcon={<tool.icon />}
//                 size="md"
//                 variant="ghost"
//                 color="gray.300"
//                 _hover={{ bg: "gray.700" }}
//                 onClick={() => handleToolSelect(tool.id)}
//                 borderRadius="md"
//                 minW="auto"
//               >
//                 {tool.name}
//               </Button>
//             ))}
//           </HStack>
//         </Center>
//       )}
      
//       {/* Footer with input */}
//       <Box p={5} pb={10}>
//         <Flex 
//           direction="column" 
//           borderRadius="lg" 
//           bg="rgba(40, 40, 40, 0.5)" 
//           p={2}
//           maxW="900px" 
//           mx="auto"
//         >
//           <Textarea
//             placeholder={isLanding ? "What do you want to know?" : "How can Grok help?"}
//             value={input}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             size="md"
//             bg="transparent"
//             border="none"
//             _focus={{ border: "none", boxShadow: "none" }}
//             resize="none"
//             minH="40px"
//             maxH="200px"
//             overflow="auto"
//             ref={inputRef}
//           />
          
//           <Divider my={2} borderColor="gray.600" />
          
//           <Flex justify="space-between" align="center">
//             <HStack spacing={2}>
//               <IconButton
//                 icon={<FiPaperclip />}
//                 aria-label="Attach file"
//                 variant="ghost"
//                 size="sm"
//                 color="gray.400"
//               />
              
//               <Menu placement="top">
//                 <MenuButton
//                   as={Button}
//                   rightIcon={<FiChevronDown />}
//                   size="sm"
//                   variant="ghost"
//                   color="gray.400"
//                 >
//                   <Flex align="center">
//                     <Box mr={1} as={toolSelectionMode === 'deepSearch' ? FiSearch : FiCode} />
//                     {toolSelectionMode === 'deepSearch' ? 'DeepSearch' : 'Think'}
//                   </Flex>
//                 </MenuButton>
//                 <MenuList bg="gray.800" borderColor="gray.700">
//                   <MenuItem 
//                     icon={<FiSearch />} 
//                     onClick={() => setToolSelectionMode('deepSearch')}
//                     bg="gray.800"
//                     _hover={{ bg: "gray.700" }}
//                   >
//                     DeepSearch
//                   </MenuItem>
//                   <MenuItem 
//                     icon={<FiCode />} 
//                     onClick={() => setToolSelectionMode('think')}
//                     bg="gray.800"
//                     _hover={{ bg: "gray.700" }}
//                   >
//                     Think
//                   </MenuItem>
//                 </MenuList>
//               </Menu>
//             </HStack>
            
//             <HStack>
//               <Menu placement="top-end">
//                 <MenuButton
//                   as={Button}
//                   rightIcon={<FiChevronDown />}
//                   size="sm"
//                   variant="ghost"
//                   color="gray.400"
//                 >
//                   {selectedModel.name}
//                 </MenuButton>
//                 <MenuList bg="gray.800" borderColor="gray.700">
//                   {AI_MODELS.map(model => (
//                     <MenuItem 
//                       key={model.id} 
//                       onClick={() => setSelectedModel(model)}
//                       bg="gray.800"
//                       _hover={{ bg: "gray.700" }}
//                     >
//                       {model.name}
//                     </MenuItem>
//                   ))}
//                 </MenuList>
//               </Menu>
              
//               <Tooltip label="Send message">
//                 <IconButton
//                   icon={<FiArrowUp />}
//                   aria-label="Send message"
//                   colorScheme="blue"
//                   size="sm"
//                   isRound
//                   isDisabled={input.trim() === ''}
//                   onClick={handleSendMessage}
//                 />
//               </Tooltip>
//             </HStack>
//           </Flex>
//         </Flex>
//       </Box>
//     </Flex>
//   );
// };

// export default ChatInterface;