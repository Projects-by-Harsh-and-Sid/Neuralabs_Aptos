// src/components/flow_builder/DetailsPanel/DetailsPanel.jsx
import React, { useState } from 'react';
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
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiX, 
  FiDatabase, 
  FiActivity, 
  FiSliders, 
  FiCode, 
  FiEye, 
  FiPlus
} from 'react-icons/fi';

const DetailsPanel = ({ selectedNode, onClose, onUpdateNode, onDeleteNode }) => {
  const [showCode, setShowCode] = useState(false);
  const [executeByDefault, setExecuteByDefault] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const formBgColor = useColorModeValue('gray.50', 'gray.700');
  
  if (!selectedNode) {
    return (
      <Box 
        w="384px"
        h="100%"
        bg={bgColor}
        borderLeft="1px solid"
        borderColor={borderColor}
        display="flex"
        flexDirection="column"
      >
        <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
          <Heading as="h2" size="md">Details</Heading>
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
        return <FiDatabase color="blue.500" />;
      case 'task':
        return <FiActivity color="green.500" />;
      case 'parameters':
        return <FiSliders color="purple.500" />;
      default:
        return null;
    }
  };

  const handleNameChange = (e) => {
    if (onUpdateNode) {
      onUpdateNode(selectedNode.id, { name: e.target.value });
    }
  };
  
  const handleDeleteNode = () => {
    if (onDeleteNode) {
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
  
  return (
    <Box 
      w={showCode ? "700px" : "384px"}
      h="100%"
      bg={bgColor}
      borderLeft="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      transition="width 0.3s"
    >
      <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={2}>
          <Flex 
            p={1} 
            borderRadius="md" 
            border="1px solid" 
            borderColor={getTypeColor()}
          >
            {getNodeIcon()}
          </Flex>
          <Heading as="h2" size="md">{selectedNode.name}</Heading>
        </Flex>
        <Flex align="center" gap={3}>
          <Button 
            leftIcon={<FiCode />} 
            size="sm"
            variant={showCode ? "solid" : "outline"}
            onClick={() => setShowCode(!showCode)}
          >
            Code
          </Button>
          <IconButton 
            icon={<FiX />} 
            variant="ghost" 
            onClick={onClose} 
            aria-label="Close" 
          />
        </Flex>
      </Flex>
      
      <Tabs flex="1" display="flex" flexDirection="column">
        <TabList mx={4} mt={2}>
          <Tab>Properties</Tab>
          <Tab>Code</Tab>
          <Tab>Preview</Tab>
        </TabList>
        
        <TabPanels flex="1" overflow="hidden">
          <TabPanel p={4} overflow="auto" h="100%">
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Template Type</FormLabel>
                <Box py={2} px={3} bg={formBgColor} borderRadius="md" fontSize="sm">
                  {selectedNode.type}
                </Box>
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="node-name" fontSize="sm" fontWeight="medium">Block Name</FormLabel>
                <Input 
                  id="node-name"
                  value={selectedNode.name} 
                  onChange={handleNameChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="node-id" fontSize="sm" fontWeight="medium">ID</FormLabel>
                <Box py={2} px={3} bg={formBgColor} borderRadius="md" fontSize="sm">
                  {selectedNode.id}
                </Box>
              </FormControl>
              
              <Flex justify="space-between" align="center">
                <FormLabel htmlFor="execute-default" fontSize="sm" fontWeight="medium" mb={0}>
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
                  <FormLabel htmlFor="default-value" fontSize="sm" fontWeight="medium">Default Value</FormLabel>
                  <Input 
                    id="default-value"
                    placeholder="Enter default value"
                  />
                </FormControl>
              )}
              
              {selectedNode.type === 'parameters' && (
                <VStack spacing={3} align="stretch">
                  <FormLabel fontSize="sm" fontWeight="medium">HyperParameters</FormLabel>
                  <Flex gap={2} mb={2}>
                    <Input placeholder="Key" flex="1" />
                    <Input placeholder="Value" flex="1" />
                    <IconButton icon={<FiPlus />} variant="outline" aria-label="Add" />
                  </Flex>
                </VStack>
              )}
              
              <VStack spacing={3} align="stretch">
                <FormLabel fontSize="sm" fontWeight="medium">Tags</FormLabel>
                <Input placeholder="Add tags..." mb={2} />
                
                <Flex wrap="wrap" gap={2}>
                  <Tag size="sm" borderRadius="md" variant="subtle" colorScheme="blue">
                    <TagLabel>Data</TagLabel>
                    <TagCloseButton />
                  </Tag>
                  <Tag size="sm" borderRadius="md" variant="subtle" colorScheme="green">
                    <TagLabel>Pipeline</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </Flex>
              </VStack>
            </VStack>
          </TabPanel>
          
          <TabPanel p={0} h="100%" position="relative">
            {showCode && (
              <Box 
                position="absolute" 
                left={0} 
                top={0} 
                h="100%" 
                w="304px" 
                borderRight="1px solid" 
                borderColor={borderColor} 
                overflow="auto" 
                bg={formBgColor}
              >
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontFamily="mono"
                  p={4}
                  fontSize="sm"
                  overflowX="auto"
                  w="100%"
                >
{`import pandas as pd

def ${selectedNode.name.toLowerCase()}(data):
    """
    Process the input data.
    
    Args:
        data: Input data to process
        
    Returns:
        Processed data
    """
    # Process data
    result = data.copy()
    
    # Add your processing logic here
    
    return result`}
                </Code>
              </Box>
            )}
            
            <Flex 
              h="100%" 
              ml={showCode ? "304px" : 0} 
              p={4}
              align="center"
              justify="center"
              color="gray.500"
              textAlign="center"
            >
              {showCode ? (
                <Box>
                  <Text>View code on the left panel</Text>
                  <Text fontSize="sm" mt={2}>Toggle code button to hide</Text>
                </Box>
              ) : (
                <Box>
                  <Box as={FiCode} size="48px" mx="auto" mb={4} opacity={0.3} />
                  <Text>Toggle code button to view code</Text>
                </Box>
              )}
            </Flex>
          </TabPanel>
          
          <TabPanel p={4} h="100%">
            <Flex h="100%" direction="column" align="center" justify="center" textAlign="center" color="gray.500">
              <Box as={FiEye} size="48px" mb={4} opacity={0.3} />
              <Text>No preview available for this node.</Text>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Flex justify="flex-end" gap={3} p={4} borderTop="1px solid" borderColor={borderColor}>
        <Button colorScheme="red" onClick={handleDeleteNode}>Delete</Button>
        <Button colorScheme="blue" onClick={handleApplyChanges}>Apply Changes</Button>
      </Flex>
    </Box>
  );
};

export default DetailsPanel;