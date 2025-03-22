import React from 'react';
import { 
  Box, 
  Flex,
  Heading, 
  Text, 
  SimpleGrid, 
  Spinner, 
  Center,
  useColorModeValue 
} from '@chakra-ui/react';
import MarketplaceDetailPanel from './MarketplaceDetailPanel';

// MarketplaceCard component - extracted from marketplace.jsx
const MarketplaceCard = ({ item, onClick }) => {
  const bgColor = useColorModeValue('marketplace.body.light', 'marketplace.body.dark');
  const borderColor = useColorModeValue('marketplace.border.light', 'marketplace.border.dark');
  const hoverBorderColor = useColorModeValue('marketplace.hoverBorder.light', 'marketplace.hoverBorder.dark');
  const tagColor = useColorModeValue('marketplace.tag.light', 'marketplace.tag.dark');
  const tagTextColor = useColorModeValue('marketplace.tagText.light', 'marketplace.tagText.dark');

  const loading_color = useColorModeValue('black', 'white');

  
  return (
    <Box
    bg={bgColor}
    p={4}
    borderRadius="md"
    border="1px solid"
    borderColor={borderColor}
    _hover={{ borderColor: hoverBorderColor, transform: 'translateY(-2px)' }}
    transition="all 0.2s"
    cursor="pointer"
    onClick={() => onClick(item)}
  >
    <Flex gap={3} alignItems="flex-start">
      {/* Icon column */}
      <Flex 
        w="70px" 
        h="70px" 
        borderRadius="md" 
        bg={item.color} 
        align="center" 
        justify="center"
        color="white"
        fontSize="40px"
        fontWeight="bold"
        flexShrink={0} // Prevent icon from shrinking
      >
        {item.icon}
      </Flex>
      
      {/* Content column */}
      <Flex 
        flex="1" 
        direction="column" 
        justifyContent="space-between"
      >
        {/* Name and description */}
        <Box>
          <Heading as="h3" size="md" color="white" mb={1}>{item.name}</Heading>
          <Text color="gray.300" fontSize="sm" mb={2} noOfLines={2}>{item.description}</Text>
        </Box>
        
        {/* Tags */}
        <Flex gap={1.5} flexWrap="wrap" mt={1}>
          {item.tags.map(tag => (
            <Box 
              key={tag} 
              px={1.5}        // Reduced padding
              py={0.5}        // Reduced padding
              bg={tagColor}
              color={tagTextColor}
              fontSize="2xs"  // Smaller font size
              borderRadius="md" // Smaller border radius
              display="inline-flex"
              alignItems="center"
              lineHeight="1"
              fontWeight="medium"
              minH="16px"
              minW="auto"
            >
              {tag}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  </Box>
);
};

// Main MarketplaceContent component
const MarketplaceContent = ({
  loading,
  error,
  featuredItems,
  ownedItems,
  selectedItem,
  handleSelectItem,
  handleCloseDetailPanel
}) => {


  const loading_color = useColorModeValue('black', 'white');
  const main_bg_color = useColorModeValue('marketplace.body.light', 'marketplace.body.dark');
  
  return (
    <Box 
      flex="1" 
      bg={main_bg_color} 
      overflow="auto"
      position="relative"
    >
      {loading ? (
        <Center h="100%">
          <Spinner size="xl" color={loading_color} />
        </Center>
      ) : error ? (
        <Center h="100%" p={8}>
          <Text color="red.500" fontSize="xl" textAlign="center">
            {error}. Please try refreshing the page.
          </Text>
        </Center>
      ) : (
        !selectedItem && (
          <Box p={8} maxW="1200px" mx="auto">
            <Heading as="h1" size="xl" color="white" mb={4}>Marketplace</Heading>
            
            <Box mb={10}>
              <Heading as="h2" size="lg" color="white" mb={6}>
                Featured by NeuraLabs :
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {featuredItems.map(item => (
                  <MarketplaceCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleSelectItem}
                  />
                ))}
              </SimpleGrid>
            </Box>
            
            {/* {ownedItems.length > 0 && (
              <Box>
                <Heading as="h2" size="lg" color="white" mb={6}>
                  Owned :
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {ownedItems.map(item => (
                    <MarketplaceCard 
                      key={item.id} 
                      item={item} 
                      onClick={handleSelectItem}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )} */}
          </Box>
        )
      )}
      
      {/* Show marketplace detail panel when an item is selected */}
      {selectedItem && (
        <MarketplaceDetailPanel 
          item={selectedItem} 
          onClose={handleCloseDetailPanel}
        />
      )}
    </Box>
  );
};

export default MarketplaceContent;