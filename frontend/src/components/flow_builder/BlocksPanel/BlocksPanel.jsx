// import React, { useState } from 'react';
// import { 
//   Box, 
//   Flex, 
//   Heading, 
//   Input, 
//   IconButton, 
//   Text, 
//   Tabs, 
//   TabList, 
//   TabPanels, 
//   Tab, 
//   TabPanel, 
//   SimpleGrid, 
//   Accordion,
//   AccordionItem,
//   AccordionButton,
//   AccordionPanel,
//   AccordionIcon,
//   List,
//   ListItem,
//   Badge,
//   useColorModeValue,
//   Center,
// } from '@chakra-ui/react';
// import { 
//   FiX, 
//   FiActivity, 
//   FiEdit2,
//   FiLayers,
//   FiMaximize2,
//   FiAlertCircle,
//  FiDatabase, FiSliders, FiExternalLink, FiRepeat, FiGitBranch
// } from 'react-icons/fi';

// // Map icon strings to React icons - this allows us to dynamically create icons from string names
// const ICON_MAP = {
//   'database': FiDatabase,
//   'activity': FiActivity,
//   'sliders': FiSliders,
//   'external-link': FiExternalLink,
//   'repeat': FiRepeat,
//   'git-branch': FiGitBranch,
// };

// const BlocksPanel = ({ 
//   onAddNode, 
//   onOpenTemplate, 
//   customTemplates = [], 
//   onEditTemplate,
//   layerMap = {},
//   beautifyMode = false,
//   onNodeClick,
//   nodeTypes = {} // Now passed from the parent component
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');
//   const headingColor = useColorModeValue('gray.800', 'white');
//   const accordionBgColor = useColorModeValue('gray.50', 'gray.600');
//   const layerHeaderBg = useColorModeValue('blue.50', 'blue.900');
//   const layerHeaderColor = useColorModeValue('blue.700', 'blue.300');
//   const iconColor = useColorModeValue('blockpanel.icon.light', 'blockpanel.icon.dark');
//   const itemBgColor = useColorModeValue('blockpanel.itemBg.light', 'blockpanel.itemBg.dark');
//   const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
//   const emptyStateIconColor = useColorModeValue('gray.300', 'gray.600');
//   const errorColor = useColorModeValue('red.500', 'red.300');
  
//   // Define message based on beautify mode
//   const emptyStateMessage = beautifyMode 
//     ? "Your flow has no nodes yet. Add some nodes from the Blocks tab."
//     : "Enable Beautify mode in the Visualize panel to organize your flow into layers.";
  
//   const handleDragStart = (e, nodeType) => {
//     e.dataTransfer.setData('nodeType', nodeType);
//     e.dataTransfer.effectAllowed = 'copy';
//   };

//   // Filter node types based on search term
//   const filteredNodeTypes = Object.entries(nodeTypes || {}).filter(([key, nodeType]) => 
//     nodeType.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   const filteredCustomTemplates = customTemplates.filter(template =>
//     template.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleTemplateClick = (templateId) => {
//     if (onEditTemplate) {
//       onEditTemplate(templateId);
//     }
//   };
  
//   // Get the appropriate icon component for a node type
//   const getIconComponent = (iconName) => {
//     if (typeof iconName === 'function') {
//       return iconName; // Already a component
//     }
//     return ICON_MAP[iconName] || FiActivity; // Default to FiActivity if icon not found
//   };

//   return (
//     <Box
//       w="320px"
//       h="100%"
//       bg={bgColor}
//       borderRight="1px solid"
//       borderColor={borderColor}
//       display="flex"
//       flexDirection="column"
//       overflow="hidden"
//     >
//       <Box p={4} borderColor={borderColor}>
//         <Heading as="h1" size="md" color={headingColor}>Flow Designer</Heading>
//       </Box>

//       <Tabs isFitted flex="1" display="flex" flexDirection="column">
//         <TabList>
//           <Tab>Blocks</Tab>
//           <Tab>Pipelines</Tab>
//         </TabList>
        
//         <TabPanels flex="1" overflowY="auto">
//           <TabPanel p={4} h="100%">
//             <Flex position="relative">
//               <Input
//                 placeholder="Search blocks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 pr="36px"
//                 bg='transparent'
//                 mb={3}
//                 border="none"
//                 _focus={{ 
//                   boxShadow: "none", 
//                   outline: "none",
//                   borderBottom: "1px solid",
//                   borderColor: borderColor
//                 }}
//                 _hover={{ 
//                   borderColor: borderColor 
//                 }}
//                 borderRadius="none"
//                 borderBottom="1px solid"
//                 borderColor={borderColor}
//                 pl={0}
//               />
//               {searchTerm && (
//                 <IconButton
//                   icon={<FiX />}
//                   size="sm"
//                   aria-label="Clear search"
//                   position="absolute"
//                   right="2"
//                   top="50%"
//                   transform="translateY(-50%)"
//                   variant="ghost"
//                   onClick={() => setSearchTerm('')}
//                 />
//               )}
//             </Flex>
            
//             <Flex justify="space-between" align="center" mb={3}>
//               <Heading as="h2" size="sm" color={headingColor}>Elements</Heading>
//             </Flex>
            
//             {Object.keys(nodeTypes).length === 0 ? (
//               <Center py={10} flexDirection="column">
//                 {/* <Box as={FiAlertCircle} color={errorColor} fontSize="24px" mb={2} /> */}
//                 <Text color={iconColor}>No node types available</Text>
//               </Center>
//             ) : (
//               <SimpleGrid columns={2} spacing={3}>
//                 {filteredNodeTypes.map(([key, nodeType]) => {
//                   const IconComponent = getIconComponent(nodeType.icon);
//                   return (
//                     <Box
//                       key={key}
//                       display="flex"
//                       flexDirection="column"
//                       alignItems="center"
//                       p={4}
//                       bg={itemBgColor}
//                       borderRadius="lg"
//                       cursor="grab"
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, key)}
//                       transition="all 0.2s"
//                       _hover={{
//                         transform: 'translateY(-2px)',
//                         boxShadow: 'md',
//                       }}
//                     >
//                       <Flex
//                         w="48px"
//                         h="48px"
//                         bg="transparent"
//                         borderRadius="lg"
//                         alignItems="center"
//                         justifyContent="center"
//                         mb={2}
//                       >
//                         <IconComponent color={iconColor} size={40} />
//                       </Flex>
//                       <Text fontWeight="medium" fontSize="sm">{nodeType.name}</Text>
//                     </Box>
//                   );
//                 })}
                
//                 {filteredCustomTemplates.map((template) => (
//                   <Box
//                     key={template.id}
//                     display="flex"
//                     flexDirection="column"
//                     alignItems="center"
//                     p={4}
//                     bg={itemBgColor}
//                     borderRadius="lg"
//                     cursor="grab"
//                     draggable
//                     onDragStart={(e) => handleDragStart(e, template.type || 'custom')}
//                     transition="all 0.2s"
//                     position="relative"
//                     _hover={{
//                       transform: 'translateY(-2px)',
//                       boxShadow: 'md',
//                     }}
//                     onClick={() => handleTemplateClick(template.id)}
//                   >
//                     <Flex
//                       w="48px"
//                       h="48px"
//                       bg="yellow.500"
//                       borderRadius="lg"
//                       alignItems="center"
//                       justifyContent="center"
//                       mb={2}
//                     >
//                       <FiActivity color="white" size={24} />
//                     </Flex>
//                     <Text fontWeight="medium" fontSize="sm">{template.name}</Text>
                    
//                     <IconButton
//                       icon={<FiEdit2 />}
//                       size="xs"
//                       position="absolute"
//                       top="2"
//                       right="2"
//                       opacity="0.7"
//                       aria-label="Edit template"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleTemplateClick(template.id);
//                       }}
//                     />
//                   </Box>
//                 ))}
//               </SimpleGrid>
//             )}
//           </TabPanel>
          
//           <TabPanel p={4}>
//             <Flex align="center" justify="space-between" mb={3}>
//               <Heading as="h2" size="sm" color={headingColor}>Flow Layers</Heading>
//               {beautifyMode && (
//                 <Badge colorScheme="blue" display="flex" alignItems="center" px={2} py={1}>
//                   <FiMaximize2 style={{ marginRight: '4px' }} />
//                   Beautified
//                 </Badge>
//               )}
//             </Flex>
            
//             {Object.keys(layerMap).length > 0 ? (
//               <Accordion allowMultiple defaultIndex={[0]}>
//                 {Object.keys(layerMap).map((layer) => (
//                   <AccordionItem key={layer} mb={2} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
//                     <h2>
//                       <AccordionButton bg={layerHeaderBg}>
//                         <Box flex="1" textAlign="left" fontWeight="medium" color={layerHeaderColor}>
//                           <Flex align="center">
//                             <FiLayers style={{ marginRight: '8px' }} />
//                             Layer {layer} ({layerMap[layer].length} node{layerMap[layer].length !== 1 ? 's' : ''})
//                           </Flex>
//                         </Box>
//                         <AccordionIcon />
//                       </AccordionButton>
//                     </h2>
//                     <AccordionPanel pb={4} bg={accordionBgColor}>
//                       <List spacing={2}>
//                         {layerMap[layer].map((node) => (
//                           <ListItem 
//                             key={node.id} 
//                             p={2} 
//                             borderRadius="md" 
//                             bg={itemBgColor}
//                             cursor="pointer"
//                             _hover={{ bg: hoverBgColor }} 
//                             onClick={() => onNodeClick && onNodeClick(node.id)}
//                           >
//                             <Flex align="center">
//                               <Box
//                                 w="24px"
//                                 h="24px"
//                                 borderRadius="md"
//                                 bg={nodeTypes[node.type]?.color || 'gray.500'}
//                                 display="flex"
//                                 alignItems="center"
//                                 justifyContent="center"
//                                 mr={2}
//                               >
//                                 {node.type && (
//                                   <Box 
//                                     as={getIconComponent(nodeTypes[node.type]?.icon)} 
//                                     color="white" 
//                                     size={14} 
//                                   />
//                                 )}
//                               </Box>
//                               <Text fontWeight="medium" fontSize="sm">{node.name}</Text>
//                             </Flex>
//                           </ListItem>
//                         ))}
//                       </List>
//                     </AccordionPanel>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             ) : (
//               <Flex 
//                 direction="column" 
//                 align="center" 
//                 justify="center" 
//                 p={6} 
//                 bg={itemBgColor} 
//                 borderRadius="md"
//                 h="200px"
//               >
//                 <Box as={FiLayers} fontSize="40px" color={emptyStateIconColor} mb={4} />
//                 <Text color="gray.500" textAlign="center">
//                   {emptyStateMessage}
//                 </Text>
//               </Flex>
//             )}
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default BlocksPanel;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Input, 
  IconButton, 
  Text, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  Badge,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import { 
  FiX, 
  FiActivity, 
  FiEdit2,
  FiLayers,
  FiMaximize2,
  FiAlertCircle,
  FiDatabase, 
  FiSliders, 
  FiExternalLink, 
  FiRepeat, 
  FiGitBranch,
  FiPlayCircle,
  FiXCircle,
  FiMessageCircle,
  FiBookOpen,
  FiServer,
  FiGlobe,
  FiLink,
  FiFileText,
  FiFilter,
  FiGitMerge,
  FiShuffle,
  FiClock,
  FiCpu,
  FiLayout,
  FiCode,
  FiChevronRight,
  FiChevronDown
} from 'react-icons/fi';

// Map icon strings to React icons
const ICON_MAP = {
  'database': FiDatabase,
  'activity': FiActivity,
  'sliders': FiSliders,
  'external-link': FiExternalLink,
  'repeat': FiRepeat,
  'git-branch': FiGitBranch,
  'play-circle': FiPlayCircle,
  'x-circle': FiXCircle,
  'message-circle': FiMessageCircle,
  'book-open': FiBookOpen,
  'server': FiServer,
  'globe': FiGlobe,
  'link': FiLink,
  'file-text': FiFileText,
  'filter': FiFilter,
  'git-merge': FiGitMerge,
  'shuffle': FiShuffle,
  'clock': FiClock,
  'cpu': FiCpu,
  'layout': FiLayout,
  'code': FiCode,
};

const BlocksPanel = ({ 
  onAddNode, 
  onOpenTemplate, 
  customTemplates = [], 
  onEditTemplate,
  layerMap = {},
  beautifyMode = false,
  onNodeClick,
  nodeTypes = {},
  nodeCategories = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Initialize all categories as expanded
  useEffect(() => {
    if (nodeCategories && nodeCategories.length > 0) {
      const initialExpanded = {};
      nodeCategories.forEach(category => {
        initialExpanded[category.id] = false;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [nodeCategories]);

  useEffect(() => {
    console.log('BlocksPanel nodeTypes:', nodeTypes);
    console.log('BlocksPanel nodeCategories:', nodeCategories);
    
    // Check if nodeCategories have the right structure
    if (nodeCategories && nodeCategories.length > 0) {
      console.log('First category nodes:', nodeCategories[0].nodes);
      
      // Check if the node keys in the category exist in nodeTypes
      const firstCategoryNodes = nodeCategories[0].nodes;
      if (firstCategoryNodes && firstCategoryNodes.length > 0) {
        console.log('First node exists in nodeTypes:', !!nodeTypes[firstCategoryNodes[0]]);
      }
    }
  }, [nodeTypes, nodeCategories]);

  useEffect(() => {
    if (Object.keys(nodeTypes).length > 0) {
      console.log('BlocksPanel received nodeTypes:', nodeTypes);
    }
  }, [nodeTypes]);
  
  const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const accordionBgColor = useColorModeValue('gray.50', 'gray.600');
  const layerHeaderBg = useColorModeValue('blockpanel.listhoverBg.light', 'blockpanel.listhoverBg.dark');
  const layerHeaderColor = useColorModeValue('blue.700', 'blue.300');
  const iconColor = useColorModeValue('blockpanel.icon.light', 'blockpanel.icon.dark');
  const itemBgColor = useColorModeValue('blockpanel.itemBg.light', 'blockpanel.itemBg.dark');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
  const emptyStateIconColor = useColorModeValue('gray.300', 'gray.600');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const categoryColor = useColorModeValue('gray.700', 'gray.300');
  const listhoverBgColor = useColorModeValue('blockpanel.listhoverBg.light', 'blockpanel.listhoverBg.dark');
  
  // Define message based on beautify mode
  const emptyStateMessage = beautifyMode 
    ? "Your flow has no nodes yet. Add some nodes from the Blocks tab."
    : "Enable Beautify mode in the Visualize panel to organize your flow into layers.";
  
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Filter node types based on search term
  const getFilteredNodeTypes = () => {
    if (!searchTerm) return nodeTypes;
    
    return Object.entries(nodeTypes)
      .filter(([key, nodeType]) => 
        nodeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nodeType.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };
  
  const filteredCustomTemplates = customTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateClick = (templateId) => {
    if (onEditTemplate) {
      onEditTemplate(templateId);
    }
  };
  
  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Get the appropriate icon component for a node type
  const getIconComponent = (iconName) => {
    if (typeof iconName === 'function') {
      return iconName; // Already a component
    }
    return ICON_MAP[iconName] || FiActivity; // Default to FiActivity if icon not found
  };

  // Render node block item
  const renderNodeBlock = (nodeKey, nodeType) => {
    const IconComponent = getIconComponent(nodeType.icon);
    
    return (
      <Box
        key={nodeKey}
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        bg={itemBgColor}
        borderRadius="lg"
        cursor="grab"
        draggable
        onDragStart={(e) => handleDragStart(e, nodeKey)}
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
        // mb={3}
      >
        <Flex
          w="48px"
          h="48px"
          bg="transparent"
          borderRadius="lg"
          alignItems="center"
          justifyContent="center"
          mb={2}
        >
          <IconComponent color={iconColor} size={36} />
        </Flex>
        <Text fontWeight="medium" fontSize="sm" textAlign="center">{nodeType.name}</Text>
      </Box>
    );
  };

  return (
    <Box
      w="320px"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Box p={4} borderColor={borderColor}>
        <Heading as="h1" size="md" color={headingColor}>Flow Designer</Heading>
      </Box>

      <Tabs isFitted flex="1" display="flex" flexDirection="column">
        <TabList>
          <Tab>Blocks</Tab>
          <Tab>Pipelines</Tab>
        </TabList>
        
        <TabPanels flex="1" overflowY="auto"
          // css={{
          //   // Add custom CSS to ensure proper scrolling
          //   '&::-webkit-scrollbar': {
          //     width: '6px',
          //   },
          //   '&::-webkit-scrollbar-track': {
          //     width: '8px',
          //     background: useColorModeValue('gray.100', 'gray.700'),
          //   },
          //   '&::-webkit-scrollbar-thumb': {
          //     background: useColorModeValue('gray.400', 'gray.500'),
          //     borderRadius: '24px',
          //   },
          // }}
        
        >
          <TabPanel p={4} h="100%">
            <Flex position="relative">
              <Input
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                pr="36px"
                bg='transparent'
                mb={3}
                border="none"
                _focus={{ 
                  boxShadow: "none", 
                  outline: "none",
                  borderBottom: "1px solid",
                  borderColor: borderColor
                }}
                _hover={{ 
                  borderColor: borderColor 
                }}
                borderRadius="none"
                borderBottom="1px solid"
                borderColor={borderColor}
                pl={0}
              />
              {searchTerm && (
                <IconButton
                  icon={<FiX />}
                  size="sm"
                  aria-label="Clear search"
                  position="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </Flex>
            
            {!searchTerm ? (
              // Display categorized blocks when not searching
              <Box mt={2}>
                {nodeCategories.map(category => {
                  const categoryNodes = category.nodes
                    .map(nodeKey => nodeTypes[nodeKey])
                    .filter(Boolean);
                  
                  if (categoryNodes.length === 0) return null;
                  
                  const isExpanded = expandedCategories[category.id];
                  
                  return (
                <Box key={category.id}>
                  <Flex 
                    alignItems="center" 
                    py={2} 
                    // px={3}  // Add consistent padding on both sides
                    bg={isExpanded ? layerHeaderBg : 'transparent'}
                    color={categoryColor}
                    // borderRadius="md"
                    cursor="pointer"
                    onClick={() => toggleCategory(category.id)}
                    fontWeight="600"
                    // width="100%"  // Ensure it spans the full width
                    position="relative"  // For pseudo element positioning
                    _hover={{
                      bg: listhoverBgColor

                    }}
                    transition="background-color 0.2s"  // Smooth transition for hover
                    mx={-4}  // Negative margin on both sides
                    // mr={10}
                    px={4} 
                    width="calc(100% + 32px)"  // Full width plus the negative margins
                  >
                    <Box mr={2}>
                      {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                    </Box>
                    <Text>{category.name}</Text>
                  </Flex>
                  
                  {isExpanded && (
                    <SimpleGrid columns={2} spacing={3} px={2} py={5}
                    >
                      {category.nodes.map(nodeKey => {
                        const nodeType = nodeTypes[nodeKey];
                        if (!nodeType) return null;
                        return renderNodeBlock(nodeKey, nodeType);
                      })}
                    </SimpleGrid>
                  )}
                </Box>
                  );
                })}
                
                {/* Custom templates section */}
                {customTemplates.length > 0 && (
                  <Box mb={4}>
                    <Flex 
                      alignItems="center" 
                      py={2} 
                      px={2}
                      bg={expandedCategories['templates'] ? layerHeaderBg : 'transparent'}
                      color={categoryColor}
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => toggleCategory('templates')}
                      fontWeight="600"
                    >
                      <Box mr={2}>
                        {expandedCategories['templates'] ? <FiChevronDown /> : <FiChevronRight />}
                      </Box>
                      <Text>Custom Templates</Text>
                    </Flex>
                    
                    {expandedCategories['templates'] && (
                      <SimpleGrid columns={2} spacing={3} mt={2} px={2}>
                        {customTemplates.map((template) => (
                          <Box
                            key={template.id}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            p={4}
                            bg={itemBgColor}
                            borderRadius="lg"
                            cursor="grab"
                            draggable
                            onDragStart={(e) => handleDragStart(e, template.type || 'custom')}
                            transition="all 0.2s"
                            position="relative"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            onClick={() => handleTemplateClick(template.id)}
                            // mb={3}
                          >
                            <Flex
                              w="48px"
                              h="48px"
                              bg="yellow.500"
                              borderRadius="lg"
                              alignItems="center"
                              justifyContent="center"
                              mb={2}
                            >
                              <FiActivity color="white" size={24} />
                            </Flex>
                            <Text fontWeight="medium" fontSize="sm">{template.name}</Text>
                            
                            <IconButton
                              icon={<FiEdit2 />}
                              size="xs"
                              position="absolute"
                              top="2"
                              right="2"
                              opacity="0.7"
                              aria-label="Edit template"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateClick(template.id);
                              }}
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              // Display search results
              <>
                <Heading as="h2" size="sm" color={headingColor} mb={3}>Search Results</Heading>
                <SimpleGrid columns={2} spacing={3}>
                  {Object.entries(getFilteredNodeTypes()).map(([nodeKey, nodeType]) => 
                    renderNodeBlock(nodeKey, nodeType)
                  )}
                  
                  {filteredCustomTemplates.map((template) => (
                    <Box
                      key={template.id}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      p={4}
                      bg={itemBgColor}
                      borderRadius="lg"
                      cursor="grab"
                      draggable
                      onDragStart={(e) => handleDragStart(e, template.type || 'custom')}
                      transition="all 0.2s"
                      position="relative"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                      }}
                      onClick={() => handleTemplateClick(template.id)}
                    >
                      <Flex
                        w="48px"
                        h="48px"
                        bg="yellow.500"
                        borderRadius="lg"
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                      >
                        <FiActivity color="white" size={24} />
                      </Flex>
                      <Text fontWeight="medium" fontSize="sm">{template.name}</Text>
                      
                      <IconButton
                        icon={<FiEdit2 />}
                        size="xs"
                        position="absolute"
                        top="2"
                        right="2"
                        opacity="0.7"
                        aria-label="Edit template"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateClick(template.id);
                        }}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </>
            )}
          </TabPanel>
          
          <TabPanel p={4}>
            <Flex align="center" justify="space-between" mb={3}>
              <Heading as="h2" size="sm" color={headingColor}>Flow Layers</Heading>
              {beautifyMode && (
                <Badge colorScheme="blue" display="flex" alignItems="center" px={2} py={1}>
                  <FiMaximize2 style={{ marginRight: '4px' }} />
                  Beautified
                </Badge>
              )}
            </Flex>
            
            {Object.keys(layerMap).length > 0 ? (
              <Accordion allowMultiple defaultIndex={[0]}>
                {Object.keys(layerMap).map((layer) => (
                  <AccordionItem key={layer} mb={2} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                    <h2>
                      <AccordionButton bg={layerHeaderBg}>
                        <Box flex="1" textAlign="left" fontWeight="medium" color={layerHeaderColor}>
                          <Flex align="center">
                            <FiLayers style={{ marginRight: '8px' }} />
                            Layer {layer} ({layerMap[layer].length} node{layerMap[layer].length !== 1 ? 's' : ''})
                          </Flex>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBgColor}>
                      <List spacing={2}>
                        {layerMap[layer].map((node) => (
                          <ListItem 
                            key={node.id} 
                            p={2} 
                            borderRadius="md" 
                            bg={itemBgColor}
                            cursor="pointer"
                            _hover={{ bg: hoverBgColor }} 
                            onClick={() => onNodeClick && onNodeClick(node.id)}
                          >
                            <Flex align="center">
                              <Box
                                w="24px"
                                h="24px"
                                borderRadius="md"
                                bg={nodeTypes[node.type]?.color || 'gray.500'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mr={2}
                              >
                                {node.type && (
                                  <Box 
                                    as={getIconComponent(nodeTypes[node.type]?.icon)} 
                                    color="white" 
                                    size={14} 
                                  />
                                )}
                              </Box>
                              <Text fontWeight="medium" fontSize="sm">{node.name}</Text>
                            </Flex>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                p={6} 
                bg={itemBgColor} 
                borderRadius="md"
                h="200px"
              >
                <Box as={FiLayers} fontSize="40px" color={emptyStateIconColor} mb={4} />
                <Text color="gray.500" textAlign="center">
                  {emptyStateMessage}
                </Text>
              </Flex>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BlocksPanel;