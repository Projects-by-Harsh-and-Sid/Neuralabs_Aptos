// src/components/flow_builder/DetailsPanel/DetailsPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  Heading, 
  Button, 
  IconButton, 
  Text, 
  Input, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  FormControl, 
  FormLabel, 
  Switch, 
  HStack, 
  Tag, 
  TagLabel, 
  TagCloseButton,
  Code,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiX, 
  FiDatabase, 
  FiActivity, 
  FiSliders, 
  FiCode, 
  FiEye, 
  FiPlus,
  FiInfo,
  FiLink
} from 'react-icons/fi';

const DetailsPanel = ({ 
  selectedNode, 
  onClose, 
  onUpdateNode, 
  onDeleteNode, 
  onToggleCode, 
  codeOpen,
  viewOnlyMode = false 
}) => {
  const [executeByDefault, setExecuteByDefault] = useState(false);
  const [tabIndex, setTabIndex] = useState(viewOnlyMode ? 1 : 0); // Default to Preview tab in view-only mode
  
  // Update tab index when view mode changes
  useEffect(() => {
    if (viewOnlyMode) {
      setTabIndex(1); // Preview tab index
    }
  }, [viewOnlyMode]);

  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const panelBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const formBgColor = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const sectionBgColor = useColorModeValue('gray.50', 'gray.600');

  // Add this function to your DetailsPanel component
const getNodeTypeColor = (type) => {
  switch (type) {
    case 'data':
      return 'blue';
    case 'task':
      return 'green';
    case 'parameters':
      return 'purple';
    default:
      return 'gray';
  }
};
  
  if (!selectedNode) {
    return (
      <Box 
        w="384px"
        h="100%"
        bg={panelBgColor}
        borderLeft="1px solid"
        borderColor={borderColor}
        display="flex"
        flexDirection="column"
      >
        <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
          <Heading as="h2" size="md" color={textColor}>Details</Heading>
          <IconButton icon={<FiX />} variant="ghost" onClick={onClose} aria-label="Close" />
        </Flex>
        <Flex flex="1" align="center" justify="center" p={6} textAlign="center" color="gray.500">
          Select a node to view and edit its properties
        </Flex>
      </Box>
    );
  }
  
  // Get icon based on node type
  const getNodeIcon = () => {
    switch (selectedNode.type) {
      case 'data':
        return <FiDatabase color="currentColor" />;
      case 'task':
        return <FiActivity color="currentColor" />;
      case 'parameters':
        return <FiSliders color="currentColor" />;
      default:
        return null;
    }
  };

  const handleNameChange = (e) => {
    if (onUpdateNode && !viewOnlyMode) {
      onUpdateNode(selectedNode.id, { name: e.target.value });
    }
  };
  
  const handleDeleteNode = () => {
    if (onDeleteNode && !viewOnlyMode) {
      onDeleteNode(selectedNode.id);
      onClose();
    }
  };
  
  const handleApplyChanges = () => {
    // In a real app, this would save all pending changes
    // For this example, changes are applied immediately
  };
  
  const getTypeColor = () => {
    switch (selectedNode.type) {
      case 'data': return 'blue.500';
      case 'task': return 'green.500';
      case 'parameters': return 'purple.500';
      default: return 'gray.500';
    }
  };
  
  // Determine connections for preview
  const getConnections = () => {
    return {
      inputs: selectedNode.inputs || [],
      outputs: selectedNode.outputs || []
    };
  };
  
  const { inputs, outputs } = getConnections();

  return (
    <Box 
      w="384px"
      h="100%"
      bg={panelBgColor}
      borderLeft="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={2}>
          <Flex 
            p={1} 
            borderRadius="md" 
            border="1px solid" 
            borderColor={getTypeColor()}
            color={getTypeColor()}
          >
            {getNodeIcon()}
          </Flex>
          <Box>
            <Heading as="h2" size="md" color={textColor}>{selectedNode.name}</Heading>
            {/* <Badge colorScheme={selectedNode.type === 'data' ? 'blue' : selectedNode.type === 'task' ? 'green' : 'purple'}>
              {selectedNode.type}
            </Badge> */}
          </Box>
        </Flex>
        <Flex align="center" gap={3}>
          {!viewOnlyMode && (
            <Button 
              leftIcon={<FiCode />} 
              size="sm"
              variant={codeOpen ? "solid" : "outline"}
              onClick={onToggleCode}
            >
              Code
            </Button>
          )}
          <IconButton 
            icon={<FiX />} 
            variant="ghost" 
            onClick={onClose} 
            aria-label="Close" 
          />
        </Flex>
      </Flex>
      
      {viewOnlyMode && (
        <Alert status="info" borderRadius="0">
          <AlertIcon />
          <Text fontSize="sm">View-only mode - Editing disabled</Text>
        </Alert>
      )}
      
      <Tabs 
        flex="1" 
        display="flex" 
        flexDirection="column"
        index={tabIndex}
        onChange={(index) => !viewOnlyMode && setTabIndex(index)}
        isLazy
      >
        <TabList mx={4} mt={2}>
          <Tab isDisabled={viewOnlyMode}>Properties</Tab>
          <Tab>Preview</Tab>
        </TabList>
        
        <TabPanels flex="1" overflow="hidden">
          {/* Properties Tab - Only shown in edit mode */}
          <TabPanel p={4} overflow="auto" h="100%">
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>Template Type</FormLabel>
                <Box py={2} px={3} bg={formBgColor} borderRadius="md" fontSize="sm" color={textColor}>
                  {selectedNode.type}
                </Box>
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="node-name" fontSize="sm" fontWeight="medium" color={textColor}>Block Name</FormLabel>
                <Input 
                  id="node-name"
                  value={selectedNode.name} 
                  onChange={handleNameChange}
                  bg={formBgColor}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="node-id" fontSize="sm" fontWeight="medium" color={textColor}>ID</FormLabel>
                <Box py={2} px={3} bg={formBgColor} borderRadius="md" fontSize="sm" color={textColor}>
                  {selectedNode.id}
                </Box>
              </FormControl>
              
              <Flex justify="space-between" align="center">
                <FormLabel htmlFor="execute-default" fontSize="sm" fontWeight="medium" mb={0} color={textColor}>
                  Execute by default
                </FormLabel>
                <Switch 
                  id="execute-default" 
                  isChecked={executeByDefault}
                  onChange={(e) => setExecuteByDefault(e.target.checked)}
                />
              </Flex>
              
              {executeByDefault && (
                <FormControl>
                  <FormLabel htmlFor="default-value" fontSize="sm" fontWeight="medium" color={textColor}>Default Value</FormLabel>
                  <Input 
                    id="default-value"
                    placeholder="Enter default value"
                    bg={formBgColor}
                  />
                </FormControl>
              )}
              
              {selectedNode.type === 'parameters' && (
                <VStack spacing={3} align="stretch">
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>HyperParameters</FormLabel>
                  <Flex gap={2} mb={2}>
                    <Input placeholder="Key" flex="1" bg={formBgColor} />
                    <Input placeholder="Value" flex="1" bg={formBgColor} />
                    <IconButton icon={<FiPlus />} variant="outline" aria-label="Add" />
                  </Flex>
                </VStack>
              )}
              
              <VStack spacing={3} align="stretch">
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>Tags</FormLabel>
                <Input placeholder="Add tags..." mb={2} bg={formBgColor} />
                
                <Flex wrap="wrap" gap={2}>
                  <Tag size="sm" borderRadius="md" variant="subtle" colorScheme="gray">
                    <TagLabel>Data</TagLabel>
                    <TagCloseButton />
                  </Tag>
                  <Tag size="sm" borderRadius="md" variant="subtle" colorScheme="gray">
                    <TagLabel>Pipeline</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </Flex>
              </VStack>
            </VStack>
          </TabPanel>
          
          {/* Preview Tab - Always available */}
          <TabPanel p={4} h="100%" overflow="auto">
            {/* Node preview content */}
            <VStack spacing={6} align="stretch">
              {/* <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Position</Text>
                <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                  <Text fontSize="sm">X: {Math.round(selectedNode.x)}, Y: {Math.round(selectedNode.y)}</Text>
                </Box>
              </Box> */}

              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Node Type</Text>
                <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                  <Text fontSize="sm" fontFamily="monospace">{selectedNode.type}</Text>
                </Box>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Node Name</Text>
                <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                  <Text fontSize="sm" fontFamily="monospace">{selectedNode.name}</Text>
                  </Box>
              </Box>
{/* 
              {executeByDefault && (  
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Default Value</Text>
                  <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                    <Text fontSize="sm" fontFamily="monospace">{selectedNode.defaultValue}</Text>
                  </Box>
                </Box>
              )} */}
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Node ID</Text>
                <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                  <Text fontSize="sm" fontFamily="monospace">{selectedNode.id}</Text>
                </Box>
              </Box>
              
              {/* Input connections */}
              {inputs.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>Input Ports</Text>
                  <VStack spacing={2} align="stretch">
                    {inputs.map((input, index) => (
                      <Flex 
                        key={index} 
                        py={2} 
                        px={3} 
                        bg={sectionBgColor} 
                        borderRadius="md"
                        alignItems="center"
                      >
                        <Box mr={2}>
                          <FiLink size={14} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">{input.name || `Input ${index + 1}`}</Text>
                          {input.type && <Text fontSize="xs" color={mutedTextColor}>Type: {input.type}</Text>}
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
              
              {/* Output connections */}
              {outputs.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>Output Ports</Text>
                  <VStack spacing={2} align="stretch">
                    {outputs.map((output, index) => (
                      <Flex 
                        key={index} 
                        py={2} 
                        px={3} 
                        bg={sectionBgColor} 
                        borderRadius="md"
                        alignItems="center"
                      >
                        <Box mr={2}>
                          <FiLink size={14} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">{output.name || `Output ${index + 1}`}</Text>
                          {output.type && <Text fontSize="xs" color={mutedTextColor}>Type: {output.type}</Text>}
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
              
              {/* Parameters if present */}
              {selectedNode.type === 'parameters' && selectedNode.hyperParameters && selectedNode.hyperParameters.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>HyperParameters</Text>
                  <VStack spacing={2} align="stretch">
                    {selectedNode.hyperParameters.map((param, index) => (
                      <Flex 
                        key={index} 
                        py={2} 
                        px={3} 
                        bg={sectionBgColor} 
                        borderRadius="md"
                        justifyContent="space-between"
                      >
                        <Text fontSize="sm" fontWeight="medium">{param.key}</Text>
                        <Text fontSize="sm">{param.value}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
              
              {/* Node description if present */}
              {selectedNode.description && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={1}>Description</Text>
                  <Box py={2} px={3} bg={sectionBgColor} borderRadius="md">
                    <Text fontSize="sm">{selectedNode.description}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Tags section */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>Tags</Text>
                <Flex wrap="wrap" gap={2}>
                  <Tag size="sm" borderRadius="md" variant="subtle" colorScheme={getNodeTypeColor(selectedNode.type)}>
                    {selectedNode.type}
                  </Tag>
                  {selectedNode.tags && selectedNode.tags.map((tag, index) => (
                    <Tag key={index} size="sm" borderRadius="md" variant="subtle" colorScheme="gray">
                      {tag}
                    </Tag>
                  ))}
                </Flex>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {!viewOnlyMode && (
        <Flex justify="flex-end" gap={3} p={4} borderTop="1px solid" borderColor={borderColor}>
          <Button colorScheme="red" onClick={handleDeleteNode} variant="outline">Delete</Button>
          <Button onClick={handleApplyChanges} colorScheme="blue">Apply Changes</Button>
        </Flex>
      )}
    </Box>
  );
};

export default DetailsPanel;