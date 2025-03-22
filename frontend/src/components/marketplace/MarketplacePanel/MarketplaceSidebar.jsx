// src/components/marketplace/MarketplacePanel/MarketplacePanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Input, 
  IconButton, 
  Text, 
  SimpleGrid,
  Tag,
  Divider,
  Spinner,
  useColorModeValue, 
} from '@chakra-ui/react';
import { 
  FiX, 
  FiSearch,
  FiStar,
} from 'react-icons/fi';
import { marketplaceApi } from '../../../utils/api';

const MarketplaceSidebar = ({ onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('featured');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
  
  const borderColor = useColorModeValue('marketplace.border.light', 'marketplace.border.dark');
  const itemBgColor = useColorModeValue('marketplace.item.light', 'marketplace.item.dark');
  const headingColor = useColorModeValue('marketplace.heading.light', 'marketplace.heading.dark');
  const textColor = useColorModeValue('marketplace.text.light', 'marketplace.text.dark');
  const tagColor = useColorModeValue('marketplace.tag.light', 'marketplace.tag.dark');
  const tagTextColor =  useColorModeValue('marketplace.tagText.light', 'marketplace.tagText.dark');

  const activeTabColor = useColorModeValue('marketplace.activeTab.light', 'marketplace.activeTab.dark');
const activeTabBorderColor = useColorModeValue('marketplace.activeTab.light', 'marketplace.activeTab.dark');

  const loading_color = useColorModeValue('black', 'white');
  
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all marketplace items
        const allItemsResponse = await marketplaceApi.getAll();
        
        // Get featured item IDs
        const featuredResponse = await marketplaceApi.getFeatured();
        
        // Get owned item IDs
        const ownedResponse = await marketplaceApi.getOwned();
        
        // Filter the items based on featured and owned IDs
        const allItems = allItemsResponse.data;
        const featuredItems = allItems.filter(item => 
          featuredResponse.data.includes(item.id)
        );
        const ownedItems = allItems.filter(item => 
          ownedResponse.data.includes(item.id)
        );
        
        setFeaturedItems(featuredItems);
        setOwnedItems(ownedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching marketplace data:", err);
        setError("Failed to load marketplace data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter items based on search term and current view
  const getFilteredItems = () => {
    let itemsToFilter = [];
    
    if (currentView === 'featured') {
      itemsToFilter = featuredItems;
    } else if (currentView === 'owned') {
      itemsToFilter = ownedItems;
    } else if (currentView === 'search') {
      // When searching, look through all items
      itemsToFilter = [...featuredItems, ...ownedItems];
      // Remove duplicates
      itemsToFilter = itemsToFilter.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );
    }
    
    if (!searchTerm) return itemsToFilter;
    
    return itemsToFilter.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredItems = getFilteredItems();
  
  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setCurrentView('search');
    } else {
      setCurrentView('featured');
    }
  };
  
  // Handle item selection
  const handleItemClick = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  // Section title based on current view
  const getSectionTitle = () => {
    if (currentView === 'search') {
      return `Search Results (${filteredItems.length})`;
    } else if (currentView === 'owned') {
      return `My Addons (${ownedItems.length})`;
    } else {
      return 'Featured Addons';
    }
  };

  if (loading) {
    return (
      <Box
        w="320px"
        h="100%"
        bg={bgColor}
        borderRight="1px solid"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        w="320px"
        h="100%"
        bg={bgColor}
        borderRight="1px solid"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Text color="red.500" textAlign="center">
          {error}. Please try refreshing the page.
        </Text>
      </Box>
    );
  }

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
      {/* Header & Search */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="md" color={headingColor}>Marketplace</Heading>
          {onClose && (
            <IconButton
              icon={<FiX />}
              aria-label="Close marketplace"
              variant="ghost"
              onClick={onClose}
            />
          )}
        </Flex>
        <Flex position="relative">
          <Input
            placeholder="Search addons..."
            value={searchTerm}
            onChange={handleSearch}
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
              onClick={() => {
                setSearchTerm('');
                setCurrentView('featured');
              }}
            />
          )}
        </Flex>
      </Box>

      {/* Navigation/Filters */}
      <Flex p={2} borderBottom="1px solid" borderColor={borderColor}>
        <Flex 
          justify="center" 
          align="center" 
          flex="1" 
          py={2}
          cursor="pointer"
          borderBottom={currentView === 'featured' ? "2px solid" : "none"}
          borderColor={activeTabBorderColor}
          color={currentView === 'featured' ? activeTabColor : textColor}
          fontWeight={currentView === 'featured' ? "medium" : "normal"}
          onClick={() => {
            setCurrentView('featured');
            setSearchTerm('');
          }}
        >
          Featured
        </Flex>
        <Flex 
          justify="center" 
          align="center" 
          flex="1" 
          py={2}
          cursor="pointer"
          borderBottom={currentView === 'owned' ? "2px solid" : "none"}
          borderColor={activeTabBorderColor}
          color={currentView === 'owned' ? activeTabColor : textColor}
          fontWeight={currentView === 'owned' ? "medium" : "normal"}
          onClick={() => {
            setCurrentView('owned');
            setSearchTerm('');
          }}
        >
          My Addons
        </Flex>
      </Flex>

      {/* Content */}
      <Box flex="1" overflowY="auto" p={4}>
        {/* <Heading as="h2" size="sm" mb={4} color={headingColor}>
          {getSectionTitle()}
        </Heading> */}
        
        {filteredItems.length === 0 ? (
          <Flex direction="column" align="center" justify="center" h="200px" color={textColor}>
            <Text mb={2}>No items found</Text>
            {currentView === 'search' && (
              <Text fontSize="sm">Try a different search term</Text>
            )}
            {currentView === 'owned' && (
              <Text fontSize="sm">Install addons from Featured section</Text>
            )}
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
                    color="white"
                    fontSize="18px"
                    fontWeight="bold"
                  >
                    {item.icon}
                  </Flex>
                  <Box flex="1">
                    <Heading as="h3" size="sm" mb={1} color={headingColor}>{item.name}</Heading>
                    {/* <Text fontSize="xs" color={textColor} mb={2} noOfLines={2}>{item.description}</Text> */}
                    <Flex mt={2} gap={2} flexWrap="wrap">
                      {item.tags.slice(0, 3).map(tag => (
                        <Box 
                          key={tag} 
                          px={1.5}        // Reduced horizontal padding from 2 to 1.5
                          py={0.5}        // Reduced vertical padding from 1 to 0.5
                          bg={tagColor}
                          color={tagTextColor}
                          fontSize="2xs"  // Changed from 'xs' to '2xs' for smaller text
                          borderRadius="md" // Changed from 'md' to 'sm' for smaller corners
                          display="inline-flex" // Use inline-flex for better spacing
                          alignItems="center"
                          lineHeight="1"  // Tighter line height
                          fontWeight="medium" // Add medium font weight for better readability at small size
                          minH="16px"     // Set minimum height
                          minW="auto"     // Allow the tag to be as small as its content
                        >
                          {tag}
                        </Box>
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

export default MarketplaceSidebar;