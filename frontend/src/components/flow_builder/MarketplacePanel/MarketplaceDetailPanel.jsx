// src/components/flow_builder/MarketplacePanel/MarketplaceDetailPanel.jsx
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Tag,
  Badge,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiX,
  FiPackage,
  FiDownload,
  FiStar,
  FiUser,
  FiCalendar,
  FiCheck,
  FiInfo,
  FiGlobe,
  FiCode,
  FiCpu
} from 'react-icons/fi';

const MarketplaceDetailPanel = ({ item, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const lighterBgColor = useColorModeValue('gray.50', 'gray.600');
  
  // Default item if none is provided
  const defaultItem = {
    id: 'item-default',
    name: 'Sample Addon',
    description: 'This is a placeholder for when no item is selected',
    longDescription: 'Please select an item from the marketplace to view its details.',
    author: 'Unknown',
    category: 'Other',
    rating: 0,
    downloads: 0,
    tags: ['Sample'],
    version: '1.0.0',
    lastUpdated: '2024-03-01',
    icon: FiPackage,
    color: 'gray.500',
    features: [],
    requirements: []
  };
  
  // Use provided item or default
  const displayItem = item || defaultItem;
  
  // Extended description for the selected item
  const extendedDescription = displayItem.longDescription || `
    This is an extended description of the ${displayItem.name} addon.
    It includes details about its features, use cases, and benefits.
    
    This component is designed to help users process and transform data efficiently.
    It integrates seamlessly with the rest of the flow builder.
  `;
  
  // Sample features list
  const features = displayItem.features || [
    'Easy integration with existing flows',
    'Automatic data type detection',
    'Customizable processing options',
    'High performance on large datasets',
    'Detailed logging and error handling'
  ];
  
  // Sample requirements
  const requirements = displayItem.requirements || [
    'Flow Builder v2.0+',
    'Data Processing Module',
    'At least 4GB RAM for large datasets'
  ];
  
  return (
    <Box
      w="calc(100% - 400px)"
      h="100%"
      bg={bgColor}
      borderLeft="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      position="absolute"
      right="0"
      top="0"
      zIndex={5}
    >
      <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={3}>
          <Flex 
            w="40px" 
            h="40px" 
            borderRadius="md" 
            bg={displayItem.color} 
            align="center" 
            justify="center"
          >
            <Box as={displayItem.icon} color="white" size={20} />
          </Flex>
          <Heading as="h2" size="md" color={headingColor}>{displayItem.name}</Heading>
        </Flex>
        <IconButton
          icon={<FiX />}
          aria-label="Close details"
          variant="ghost"
          onClick={onClose}
        />
      </Flex>
      
      <Box flex="1" overflowY="auto">
        <Box p={6} bg={bgColor}>
          <Flex justify="space-between" align="center" mb={6}>
            <Flex direction="column">
              <Text color={textColor} fontSize="sm" mb={1}>By {displayItem.author}</Text>
              <Flex align="center" gap={2} mb={2}>
                <Flex align="center">
                  <Box as={FiStar} color="yellow.400" mr={1} />
                  <Text fontWeight="medium">{displayItem.rating}</Text>
                </Flex>
                <Text color={textColor} fontSize="sm">|</Text>
                <Flex align="center">
                  <Box as={FiDownload} mr={1} />
                  <Text fontSize="sm">{displayItem.downloads} downloads</Text>
                </Flex>
              </Flex>
              <Flex gap={2} mt={1}>
                {displayItem.tags.map(tag => (
                  <Tag key={tag} size="sm" colorScheme="blue">{tag}</Tag>
                ))}
              </Flex>
            </Flex>
            
            <Button 
              leftIcon={<FiDownload />} 
              colorScheme="blue" 
              size="md"
            >
              Install
            </Button>
          </Flex>
          
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={3} color={headingColor}>About</Heading>
            <Text color={textColor} whiteSpace="pre-line">
              {extendedDescription}
            </Text>
          </Box>
          
          <Divider mb={6} />
          
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Features</Tab>
              <Tab>Requirements</Tab>
              <Tab>Documentation</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <List spacing={3}>
                  {features.map((feature, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text color={textColor}>{feature}</Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel>
                <List spacing={3}>
                  {requirements.map((req, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiInfo} color="blue.500" />
                      <Text color={textColor}>{req}</Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel>
                <Box p={4} bg={lighterBgColor} borderRadius="md" mb={4}>
                  <Heading as="h4" size="xs" mb={2} color={headingColor}>Quick Start Guide</Heading>
                  <Text color={textColor} fontSize="sm">
                    1. Install the addon from the marketplace<br />
                    2. Add the component to your flow<br />
                    3. Configure the parameters<br />
                    4. Connect inputs and outputs
                  </Text>
                </Box>
                
                <Box p={4} bg={lighterBgColor} borderRadius="md">
                  <Heading as="h4" size="xs" mb={2} color={headingColor}>API Reference</Heading>
                  <Text color={textColor} fontSize="sm">
                    Refer to the documentation for a complete API reference including all available parameters and methods.
                  </Text>
                  <Button 
                    leftIcon={<FiGlobe />} 
                    size="sm" 
                    variant="outline" 
                    mt={2}
                  >
                    Open Documentation
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      
      <Flex justify="space-between" align="center" p={4} borderTop="1px solid" borderColor={borderColor}>
        <Text fontSize="sm" color={textColor}>
          Version: {displayItem.version} • Updated: {displayItem.lastUpdated}
        </Text>
        <Button 
          leftIcon={<FiDownload />} 
          colorScheme="blue" 
          size="sm"
        >
          Install
        </Button>
      </Flex>
    </Box>
  );
};

export default MarketplaceDetailPanel;