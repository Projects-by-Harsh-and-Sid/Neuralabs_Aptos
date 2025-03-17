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

const DetailsPanel = ({ selectedNode, onClose, onUpdateNode, onDeleteNode, onToggleCode, codeOpen }) => {
  const [executeByDefault, setExecuteByDefault] = useState(false);
  
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const panelBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const formBgColor = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  
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
      case 'data': return 'gray.500';
      case 'task': return 'gray.600';
      case 'parameters': return 'gray.700';
      default: return 'gray.500';
    }
  };
  
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
          <Heading as="h2" size="md" color={textColor}>{selectedNode.name}</Heading>
        </Flex>
        <Flex align="center" gap={3}>
          <Button 
            leftIcon={<FiCode />} 
            size="sm"
            variant={codeOpen ? "solid" : "outline"}
            onClick={onToggleCode}
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
          <Tab>Preview</Tab>
        </TabList>
        
        <TabPanels flex="1" overflow="hidden">
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
          
          <TabPanel p={4} h="100%">
            <Flex h="100%" direction="column" align="center" justify="center" textAlign="center" color="gray.500">
              <Box as={FiEye} size="48px" mb={4} opacity={0.3} />
              <Text>No preview available for this node.</Text>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Flex justify="flex-end" gap={3} p={4} borderTop="1px solid" borderColor={borderColor}>
        <Button colorScheme="red" onClick={handleDeleteNode} variant="outline">Delete</Button>
        <Button onClick={handleApplyChanges}>Apply Changes</Button>
      </Flex>
    </Box>
  );
};

export default DetailsPanel;