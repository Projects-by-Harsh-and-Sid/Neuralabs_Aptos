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
  FiSearch,
  FiEdit2
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

const BlocksPanel = ({ onAddNode, onOpenTemplate, customTemplates = [], onEditTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const itemBgColor = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  
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
            <Heading as="h2" size="sm" mb={3} color={headingColor}>Pipelines</Heading>
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