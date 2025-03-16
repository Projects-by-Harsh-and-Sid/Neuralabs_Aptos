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
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiX, 
  FiDatabase, 
  FiActivity, 
  FiSliders, 
  FiPlus,
  FiSearch
} from 'react-icons/fi';

// Node types and their templates
const NODE_TYPES = {
  data: {
    name: 'Data',
    icon: FiDatabase,
    color: 'blue.300',
  },
  task: {
    name: 'Task',
    icon: FiActivity,
    color: 'green.300',
  },
  parameters: {
    name: 'Parameters',
    icon: FiSliders,
    color: 'purple.300',
  },
};

const BlocksPanel = ({ onAddNode, onOpenTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const itemBgColor = useColorModeValue('gray.50', 'gray.700');
  
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredNodeTypes = Object.entries(NODE_TYPES).filter(([key, nodeType]) => 
    nodeType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Heading as="h1" size="md" mb={4}>Flow Designer</Heading>
        <Flex position="relative">
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pr="36px"
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
              <Heading as="h2" size="sm">Node Types</Heading>
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
            </SimpleGrid>
          </TabPanel>
          
          <TabPanel p={4}>
            <Heading as="h2" size="sm" mb={3}>Pipelines</Heading>
            <Text textAlign="center" color="gray.500" p={4}>
              Create pipelines by connecting nodes on the canvas.
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BlocksPanel;