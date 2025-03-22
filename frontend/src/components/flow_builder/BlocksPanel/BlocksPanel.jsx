// src/components/flow_builder/BlocksPanel/BlocksPanel.jsx
import React, { useState } from 'react';
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
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiX, 
  FiDatabase, 
  FiActivity, 
  FiSliders, 
  FiPlus,
  FiSearch,
  FiEdit2,
  FiLayers,
  FiMaximize2
} from 'react-icons/fi';

// Node types and their templates with vibrant colors that remain consistent across themes
const NODE_TYPES = {
  data: {
    name: 'Data',
    icon: FiDatabase,
    color: 'blue.500',
  },
  task: {
    name: 'Task',
    icon: FiActivity,
    color: 'green.500',
  },
  parameters: {
    name: 'Parameters',
    icon: FiSliders,
    color: 'purple.500',
  },
};

const BlocksPanel = ({ 
  onAddNode, 
  onOpenTemplate, 
  customTemplates = [], 
  onEditTemplate,
  layerMap = {},
  beautifyMode = false,
  onNodeClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const itemBgColor = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const accordionBgColor = useColorModeValue('gray.50', 'gray.600');
  const layerHeaderBg = useColorModeValue('blue.50', 'blue.900');
  const layerHeaderColor = useColorModeValue('blue.700', 'blue.300');

  const hoverBgColor = useColorModeValue('gray.100', 'gray.600'); // Define here
  const emptyStateIconColor = useColorModeValue('gray.300', 'gray.600'); // Define here
  
  // Define message based on beautify mode before returning JSX
  const emptyStateMessage = beautifyMode 
    ? "Your flow has no nodes yet. Add some nodes from the Blocks tab."
    : "Enable Beautify mode in the Visualize panel to organize your flow into layers.";
  
  
  
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredNodeTypes = Object.entries(NODE_TYPES).filter(([key, nodeType]) => 
    nodeType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCustomTemplates = customTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateClick = (templateId) => {
    if (onEditTemplate) {
      onEditTemplate(templateId);
    }
  };
  
  // Get node color based on its type
  const getNodeTypeColor = (type) => {
    if (type === 'data') return 'blue';
    if (type === 'task') return 'green';
    if (type === 'parameters') return 'purple';
    return 'gray';
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
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Heading as="h1" size="md" mb={4} color={headingColor}>Flow Designer</Heading>
        <Flex position="relative">
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pr="36px"
            bg={itemBgColor}
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
      </Box>

      <Tabs isFitted flex="1" display="flex" flexDirection="column">
        <TabList>
          <Tab>Blocks</Tab>
          <Tab>Pipelines</Tab>
        </TabList>
        
        <TabPanels flex="1" overflowY="auto">
          <TabPanel p={4} h="100%">
            <Flex justify="space-between" align="center" mb={3}>
              <Heading as="h2" size="sm" color={headingColor}>Node Types</Heading>
              <Button
                leftIcon={<FiPlus />}
                size="sm"
                onClick={onOpenTemplate}
                variant="outline"
              >
                Custom
              </Button>
            </Flex>
            
            <SimpleGrid columns={2} spacing={3}>
              {filteredNodeTypes.map(([key, nodeType]) => (
                <Box
                  key={key}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  p={4}
                  bg={itemBgColor}
                  borderRadius="lg"
                  cursor="grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, key)}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                >
                  <Flex
                    w="48px"
                    h="48px"
                    bg={nodeType.color}
                    borderRadius="lg"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                  >
                    <nodeType.icon color="white" size={24} />
                  </Flex>
                  <Text fontWeight="medium" fontSize="sm">{nodeType.name}</Text>
                </Box>
              ))}
              
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
                                bg={NODE_TYPES[node.type]?.color || 'gray.500'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mr={2}
                              >
                                {node.type === 'data' && <FiDatabase color="white" size={14} />}
                                {node.type === 'task' && <FiActivity color="white" size={14} />}
                                {node.type === 'parameters' && <FiSliders color="white" size={14} />}
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
                  {beautifyMode ? 
                    "Your flow has no nodes yet. Add some nodes from the Blocks tab." : 
                    "Enable Beautify mode in the Visualize panel to organize your flow into layers."}
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