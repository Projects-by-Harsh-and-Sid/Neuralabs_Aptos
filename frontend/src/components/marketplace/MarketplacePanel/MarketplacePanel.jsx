// src/components/flow_builder/MarketplacePanel/MarketplacePanel.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Input, 
  IconButton, 
  Text, 
  SimpleGrid, 
  Image,
  Tag,
  useColorModeValue, 
} from '@chakra-ui/react';
import { 
  FiX, 
  FiSearch,
  FiStar,
  FiPackage,
  FiCode,
  FiCpu
} from 'react-icons/fi';

// Sample marketplace items for demonstration
const MARKETPLACE_ITEMS = [
  {
    id: 'item-1',
    name: 'Data Cleaner Pro',
    description: 'Advanced data cleaning and preprocessing',
    author: 'DataScience Tools',
    category: 'Data Processing',
    rating: 4.5,
    downloads: 2580,
    tags: ['Data', 'Cleaning', 'Popular'],
    icon: FiPackage,
    color: 'blue.500'
  },
  {
    id: 'item-2',
    name: 'ML Model Pack',
    description: 'Collection of pre-trained machine learning models',
    author: 'AI Research',
    category: 'Models',
    rating: 4.8,
    downloads: 3450,
    tags: ['ML', 'AI', 'Models'],
    icon: FiCpu,
    color: 'purple.500'
  },
  {
    id: 'item-3',
    name: 'Visualization Tools',
    description: 'Beautiful charts and data visualization components',
    author: 'Viz Studio',
    category: 'Visualization',
    rating: 4.3,
    downloads: 1890,
    tags: ['Charts', 'Visualization'],
    icon: FiCode,
    color: 'green.500'
  },
  {
    id: 'item-4',
    name: 'Neural Network Builder',
    description: 'Drag and drop neural network designer',
    author: 'Deep Learning Labs',
    category: 'Models',
    rating: 4.7,
    downloads: 2100,
    tags: ['Neural Networks', 'Deep Learning'],
    icon: FiCpu,
    color: 'red.500'
  },
  {
    id: 'item-5',
    name: 'CSV Master',
    description: 'Advanced CSV file handling and processing',
    author: 'Data Tools Inc',
    category: 'Data Processing',
    rating: 4.2,
    downloads: 1750,
    tags: ['CSV', 'Data Import'],
    icon: FiPackage,
    color: 'yellow.500'
  },
  {
    id: 'item-6',
    name: 'Database Connectors',
    description: 'Connect to various databases with ease',
    author: 'DB Systems',
    category: 'Connectors',
    rating: 4.6,
    downloads: 2300,
    tags: ['Database', 'SQL', 'NoSQL'],
    icon: FiCode,
    color: 'teal.500'
  }
];

const MarketplacePanel = ({ onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const itemBgColor = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  // Filter items based on search term
  const filteredItems = MARKETPLACE_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle item selection
  const handleItemClick = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
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
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="md" color={headingColor}>Marketplace</Heading>
          {/* <IconButton
            icon={<FiX />}
            aria-label="Close marketplace"
            variant="ghost"
            onClick={onClose}
          /> */}
        </Flex>
        <Flex position="relative">
          <Input
            placeholder="Search addons..."
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

      <Box flex="1" overflowY="auto" p={4}>
        <Heading as="h2" size="sm" mb={4} color={headingColor}>
          {searchTerm ? `Search Results (${filteredItems.length})` : 'Featured Addons'}
        </Heading>
        
        {filteredItems.length === 0 ? (
          <Flex direction="column" align="center" justify="center" h="200px" color={textColor}>
            <Text mb={2}>No items found</Text>
            <Text fontSize="sm">Try a different search term</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={1} spacing={4}>
            {filteredItems.map(item => (
              <Box
                key={item.id}
                bg={itemBgColor}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
                onClick={() => handleItemClick(item)}
              >
                <Flex gap={3}>
                  <Flex 
                    w="40px" 
                    h="40px" 
                    borderRadius="md" 
                    bg={item.color} 
                    align="center" 
                    justify="center"
                  >
                    <item.icon color="white" size={20} />
                  </Flex>
                  <Box flex="1">
                    <Heading as="h3" size="sm" mb={1} color={headingColor}>{item.name}</Heading>
                    {/* <Text fontSize="sm" color={textColor} mb={2} noOfLines={2}>{item.description}</Text> */}
                    <Flex justify="space-between" align="center">
                      {/* <Text fontSize="xs" color={textColor}>{item.author}</Text> */}
                      <Flex align="center" gap={1}>
                        {/* <FiStar color="gold" /> */}
                        {/* <Text fontSize="xs" fontWeight="medium">{item.rating}</Text> */}
                      </Flex>
                    </Flex>
                    <Flex mt={2} gap={2} flexWrap="wrap">
                      {item.tags.map(tag => (
                        <Tag key={tag} size="sm" variant="subtle" colorScheme="grey">
                          {tag}
                        </Tag>
                      ))}
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default MarketplacePanel;