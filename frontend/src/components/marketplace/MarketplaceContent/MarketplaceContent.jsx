import React, { useState } from 'react';
import { 
  Box, 
  Flex,
  Heading, 
  Text, 
  SimpleGrid, 
  Spinner, 
  Center,
  useColorModeValue,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  FormControl
} from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';
import MarketplaceDetailPanel from './MarketplaceDetailPanel';

// MarketplaceCard component - extracted from marketplace.jsx
const MarketplaceCard = ({ item, onClick }) => {
  const bgColor = useColorModeValue('marketplace.marketplaceCardbg.light', 'marketplace.marketplaceCardbg.dark');
  const borderColor = useColorModeValue('marketplace.border.light', 'marketplace.border.dark');
  const hoverBorderColor = useColorModeValue('marketplace.hoverBorder.light', 'marketplace.hoverBorder.dark');
  const tagColor = useColorModeValue('marketplace.tag.light', 'marketplace.tag.dark');
  const tagTextColor = useColorModeValue('marketplace.tagText.light', 'marketplace.tagText.dark');
  const cardheadingColor = useColorModeValue('marketplace.heading.light', 'marketplace.heading.dark');
  const carddescriptionColor = useColorModeValue('marketplace.description.light', 'marketplace.description.dark');
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
          <Heading as="h3" size="md" color={cardheadingColor} mb={1}>{item.name}</Heading>
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loading_color = useColorModeValue('black', 'white');
  const main_bg_color = useColorModeValue('marketplace.body.light', 'marketplace.body.dark');
  const headingColor = useColorModeValue('marketplace.heading.light', 'marketplace.heading.dark');


  const inputBgColor = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputTextColor = useColorModeValue('gray.800', 'white');

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setIsSearching(false);
      setFilteredItems([]);
      return;
    }
    
    setIsSearching(true);
    // Filter items based on search query
    const filtered = featuredItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) || 
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredItems(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setFilteredItems([]);
  };

  const displayedItems = isSearching ? filteredItems : featuredItems;


//   return (
//     <Box 
//       flex="1" 
//       bg={main_bg_color} 
//       overflow="auto"
//       position="relative"
//       paddingTop={"5%"}
//     >
//       {loading ? (
//         <Center h="100%">
//           <Spinner size="xl" color={loading_color} />
//         </Center>
//       ) : error ? (
//         <Center h="100%" p={8}>
//           <Text color="red.500" fontSize="xl" textAlign="center">
//             {error}. Please try refreshing the page.
//           </Text>
//         </Center>
//       ) : (
//         !selectedItem && (
//           <Box p={8} maxW="1200px" mx="auto">
//             <Heading as="h1" size="xl" color={headingColor} marginTop={"50px"} marginBottom={"40px"} textAlign={"center"}>Explore AI Agents</Heading>
            
//             <Box mb={10}>

//               <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
//                 {featuredItems.map(item => (
//                   <MarketplaceCard 
//                     key={item.id} 
//                     item={item} 
//                     onClick={handleSelectItem}
//                   />
//                 ))}
//               </SimpleGrid>
//             </Box>
            
//             {/* {ownedItems.length > 0 && (
//               <Box>
//                 <Heading as="h2" size="lg" color="white" mb={6}>
//                   Owned :
//                 </Heading>
//                 <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
//                   {ownedItems.map(item => (
//                     <MarketplaceCard 
//                       key={item.id} 
//                       item={item} 
//                       onClick={handleSelectItem}
//                     />
//                   ))}
//                 </SimpleGrid>
//               </Box>
//             )} */}
//           </Box>
//         )
//       )}
      
//       {/* Show marketplace detail panel when an item is selected */}
//       {selectedItem && (
//         <MarketplaceDetailPanel 
//           item={selectedItem} 
//           onClose={handleCloseDetailPanel}
//         />
//       )}
//     </Box>
//   );
// };

// export default MarketplaceContent;

return (
  <Box 
    flex="1" 
    bg={main_bg_color} 
    overflow="auto"
    position="relative"
    paddingTop={"5%"}
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
          <Heading as="h1" size="xl" color={headingColor} marginTop={"50px"} marginBottom={"40px"} textAlign={"center"}>Explore AI Agents</Heading>
          
          {/* Search bar */}
          <Box mb={8} maxW="600px" mx="auto">
            <FormControl>
              <InputGroup size="lg">
                <Input
                  placeholder="Search by name, description or tags..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  bg={inputBgColor}
                  color={inputTextColor}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  pr="4.5rem"
                />
                <InputRightElement width="4.5rem">
                  {searchQuery ? (
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      icon={<FiX />}
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                      variant="ghost"
                    />
                  ) : (
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      icon={<FiSearch />}
                      aria-label="Search"
                      variant="ghost"
                      cursor="default"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
          
          <Box mb={10}>
            {isSearching && filteredItems.length === 0 ? (
              <Center p={8}>
                <Text color={headingColor}>
                  No results found for "{searchQuery}". Try a different search term.
                </Text>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {displayedItems.map(item => (
                  <MarketplaceCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleSelectItem}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
          
          {/* Owned items section remains unchanged */}
          {/* {ownedItems.length > 0 && (
            // ... existing code for owned items
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