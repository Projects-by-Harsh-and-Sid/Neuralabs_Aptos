// Update the imports to include React hooks and the nodeApi
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
  Spinner,
  Center,
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
  FiMaximize2,
  FiExternalLink,
  FiRepeat,
  FiGitBranch,
  FiAlertCircle,
} from 'react-icons/fi';

// Import the nodeApi
import { nodeApi } from '../../../utils/api';

// Map icon strings to React icons - this allows us to dynamically create icons from string names
const ICON_MAP = {
  'database': FiDatabase,
  'activity': FiActivity,
  'sliders': FiSliders,
  'external-link': FiExternalLink,
  'repeat': FiRepeat,
  'git-branch': FiGitBranch,
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
  const [nodeTypes, setNodeTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch node types from API
  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        setLoading(true);
        const response = await nodeApi.getNodeTypes();
        setNodeTypes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching node types:", err);
        setError("Failed to load node types");
        setLoading(false);
      }
    };
    
    fetchNodeTypes();
  }, []);
  
  const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const accordionBgColor = useColorModeValue('gray.50', 'gray.600');
  const layerHeaderBg = useColorModeValue('blue.50', 'blue.900');
  const layerHeaderColor = useColorModeValue('blue.700', 'blue.300');
  const iconColor = useColorModeValue('blockpanel.icon.light', 'blockpanel.icon.dark');
  const itemBgColor = useColorModeValue('blockpanel.itemBg.light', 'blockpanel.itemBg.dark');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
  const emptyStateIconColor = useColorModeValue('gray.300', 'gray.600');
  const errorColor = useColorModeValue('red.500', 'red.300');
  
  // Define message based on beautify mode
  const emptyStateMessage = beautifyMode 
    ? "Your flow has no nodes yet. Add some nodes from the Blocks tab."
    : "Enable Beautify mode in the Visualize panel to organize your flow into layers.";
  
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Filter node types based on search term
  const filteredNodeTypes = Object.entries(nodeTypes).filter(([key, nodeType]) => 
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
  
  // Get the appropriate icon component for a node type
  const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || FiActivity; // Default to FiActivity if icon not found
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
        
        <TabPanels flex="1" overflowY="auto">
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
            
            <Flex justify="space-between" align="center" mb={3}>
              <Heading as="h2" size="sm" color={headingColor}>Elements</Heading>
            </Flex>
            
            {loading ? (
              <Center py={10}>
                <Spinner color="blue.500" />
              </Center>
            ) : error ? (
              <Center py={10} flexDirection="column">
                <Box as={FiAlertCircle} color={errorColor} fontSize="24px" mb={2} />
                <Text color={errorColor}>{error}</Text>
              </Center>
            ) : (
              <SimpleGrid columns={2} spacing={3}>
                {filteredNodeTypes.map(([key, nodeType]) => {
                  const IconComponent = getIconComponent(nodeType.icon);
                  return (
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
                        bg="transparent"
                        borderRadius="lg"
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                      >
                        <IconComponent color={iconColor} size={40} />
                      </Flex>
                      <Text fontWeight="medium" fontSize="sm">{nodeType.name}</Text>
                    </Box>
                  );
                })}
                
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
            )}
          </TabPanel>
          
          {/* Pipelines TabPanel remains the same */}
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
                                  <Box as={getIconComponent(nodeTypes[node.type]?.icon)} color="white" size={14} />
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