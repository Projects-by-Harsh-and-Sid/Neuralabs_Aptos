// // src/components/access_management/AccessSidebar.jsx - Fixed version
// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   VStack, 
//   HStack, 
//   Text, 
//   Icon, 
//   useColorModeValue, 
//   List, 
//   ListItem,
//   Flex,
// } from '@chakra-ui/react';
// import { 
//   FiGrid, 
//   FiShield, 
//   FiDatabase, 
//   FiChevronRight,
//   FiChevronDown,
//   FiClock,
//   FiX
// } from 'react-icons/fi';

// const AccessSidebar = ({ accessLevels, selectedAccessLevel, onSelectAccessLevel, flowsData }) => {
//   const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');
//   const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
//   const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
//   const selectedTextColor = useColorModeValue('blue.700', 'blue.300');
//   const textColor = useColorModeValue('gray.800', 'gray.200');
//   const iconColor = useColorModeValue('gray.600', 'gray.300');
  
//   // Get the appropriate icon for each access level
//   const getAccessLevelIcon = (levelId) => {
//     if (levelId === 'all') return FiGrid;
//     if (levelId === 0) return FiClock;  // Flows under development
//     return FiShield; // Default icon for all access levels
//   };
  
//   // State to track expanded access levels (to show the flows)
//   const [expandedLevels, setExpandedLevels] = useState({});
  
//   // Toggle expanded state for an access level
//   const toggleExpandLevel = (levelId) => {
//     setExpandedLevels(prev => ({
//       ...prev,
//       [levelId]: !prev[levelId]
//     }));
//   };
  
//   // Expand levels that have flows by default
//   useEffect(() => {
//     if (accessLevels && accessLevels.length > 0) {
//       const initialExpandedState = {};
//       accessLevels.forEach(level => {
//         if (level.flows && level.flows.length > 0) {
//           initialExpandedState[level.id] = true;
//         }
//       });
//       setExpandedLevels(initialExpandedState);
//     }
//   }, [accessLevels]);
  
//   // Get item background color based on selection state
//   const getItemBgColor = (levelId) => {
//     if (selectedAccessLevel === levelId) {
//       return selectedBgColor;
//     }
//     return 'transparent';
//   };
  
//   // Get item text color based on selection state
//   const getItemTextColor = (levelId) => {
//     if (selectedAccessLevel === levelId) {
//       return selectedTextColor;
//     }
//     return textColor;
//   };

//   // Find flow details by ID
//   const getFlowDetails = (flowId) => {
//     if (!flowsData || !Array.isArray(flowsData)) return null;
//     return flowsData.find(flow => flow.id === flowId) || null;
//   };

//   return (
//     <Box
//       w="320px"
//       h="100%"
//       bg={bgColor}
//       borderRight="1px solid"
//       borderColor={borderColor}
//       overflow="auto"
//     >
//       <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
//         <Text fontSize="xl" fontWeight="bold">Flow Access</Text>
//       </Box>
      
//       <List spacing={0}>
//         {/* All Flows */}
//         <ListItem
//           px={4}
//           py={3}
//           cursor="pointer"
//           bg={getItemBgColor('all')}
//           color={getItemTextColor('all')}
//           _hover={{ bg: hoverBgColor }}
//           onClick={() => onSelectAccessLevel('level', 'all')}
//         >
//           <HStack spacing={3}>
//             <Icon as={FiGrid} boxSize={5} color={iconColor} />
//             <Text fontWeight="medium">All</Text>
//           </HStack>
//         </ListItem>
        
//         {/* Access Levels */}
//         {accessLevels && accessLevels.map(level => (
//           <React.Fragment key={level.id}>
//             <ListItem
//               px={4}
//               py={3}
//               cursor="pointer"
//               bg={getItemBgColor(level.id)}
//               color={getItemTextColor(level.id)}
//               _hover={{ bg: hoverBgColor }}
//               onClick={() => {
//                 onSelectAccessLevel('level', level.id);
//                 toggleExpandLevel(level.id);
//               }}
//             >
//               <HStack spacing={3}>
//                 <Icon as={getAccessLevelIcon(level.id)} boxSize={5} color={iconColor} />
//                 <Text fontWeight="medium">{level.name}</Text>
//                 {level.flows && level.flows.length > 0 && (
//                   <Box ml="auto">
//                     <Icon
//                       as={expandedLevels[level.id] ? FiChevronDown : FiChevronRight}
//                       boxSize={4}
//                       color={iconColor}
//                     />
//                   </Box>
//                 )}
//               </HStack>
//             </ListItem>
            
//             {/* Show flows if this level is expanded */}
//             {expandedLevels[level.id] && level.flows && level.flows.length > 0 && (
//               <Box pl={8} w="100%">
//                 <List spacing={0}>
//                   {level.flows.map(flowId => {
//                     const flowDetail = getFlowDetails(flowId);
//                     return (
//                       <ListItem 
//                         key={flowId} 
//                         py={2} 
//                         px={3}
//                         _hover={{ bg: hoverBgColor }}
//                         cursor="pointer"
//                         transition="all 0.2s"
//                         borderRadius="md"
//                         mx={2}
//                         onClick={() => onSelectAccessLevel('flow', flowId)}
//                       >
//                         <Flex align="center">
//                           <Text 
//                             fontSize="md" 
//                             fontWeight="bold" 
//                             color={iconColor} 
//                             mr={2}
//                           >
//                             {flowDetail ? flowDetail.icon : 'D'}
//                           </Text>
//                           <Text fontSize="sm" color={textColor}>
//                             {flowDetail ? flowDetail.name : flowId}
//                           </Text>
//                         </Flex>
//                       </ListItem>
//                     );
//                   })}
//                 </List>
//               </Box>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default AccessSidebar;

// src/components/access_management/AccessSidebar.jsx - Updated version
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  useColorModeValue, 
  List, 
  ListItem,
  Flex,
} from '@chakra-ui/react';
import { 
  FiGrid, 
  FiChevronRight,
  FiChevronDown,
  FiClock,
  FiX
} from 'react-icons/fi';

const AccessSidebar = ({ accessLevels, selectedAccessLevel, onSelectAccessLevel, flowsData }) => {
  const bgColor = useColorModeValue('sidepanel.body.light', 'sidepanel.body.dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
  const selectedTextColor = useColorModeValue('blue.700', 'blue.300');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  
  // Get the appropriate icon for each access level
  const getAccessLevelIcon = (levelId) => {
    if (levelId === 'all') return FiGrid;
    if (levelId === 0) return FiClock;  // Flows under development
    return null; // No icon for regular access levels, we'll use chevrons instead
  };
  
  // State to track expanded access levels (to show the flows)
  const [expandedLevels, setExpandedLevels] = useState({});
  
  // Toggle expanded state for an access level
  const toggleExpandLevel = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };
  
  // Expand levels that have flows by default
  useEffect(() => {
    if (accessLevels && accessLevels.length > 0) {
      const initialExpandedState = {};
      accessLevels.forEach(level => {
        if (level.flows && level.flows.length > 0) {
          initialExpandedState[level.id] = true;
        }
      });
      setExpandedLevels(initialExpandedState);
    }
  }, [accessLevels]);
  
  // Get item background color based on selection state
  const getItemBgColor = (levelId) => {
    if (selectedAccessLevel === levelId) {
      return selectedBgColor;
    }
    return 'transparent';
  };
  
  // Get item text color based on selection state
  const getItemTextColor = (levelId) => {
    if (selectedAccessLevel === levelId) {
      return selectedTextColor;
    }
    return textColor;
  };

  // Find flow details by ID
  const getFlowDetails = (flowId) => {
    if (!flowsData || !Array.isArray(flowsData)) return null;
    return flowsData.find(flow => flow.id === flowId) || null;
  };

  return (
    <Box
      w="320px"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      overflow="auto"
    >
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Text fontSize="xl" fontWeight="bold">Flow Access</Text>
      </Box>
      
      <List spacing={0}>
        {/* All Flows */}
        <ListItem
          px={4}
          py={3}
          cursor="pointer"
          bg={getItemBgColor('all')}
          color={getItemTextColor('all')}
          _hover={{ bg: hoverBgColor }}
          onClick={() => onSelectAccessLevel('level', 'all')}
        >
          <HStack spacing={3}>
            <Icon as={FiGrid} boxSize={5} color={iconColor} />
            <Text fontWeight="medium">All</Text>
          </HStack>
        </ListItem>
        
        {/* Access Levels */}
        {accessLevels && accessLevels.map(level => (
          <React.Fragment key={level.id}>
            <ListItem
              px={4}
              py={3}
              cursor="pointer"
              bg={getItemBgColor(level.id)}
              color={getItemTextColor(level.id)}
              _hover={{ bg: hoverBgColor }}
              onClick={() => {
                onSelectAccessLevel('level', level.id);
                toggleExpandLevel(level.id);
              }}
            >
              <HStack spacing={3}>
                {/* Replace shield icon with chevron */}
                <Icon 
                  as={level.flows && level.flows.length > 0 
                    ? (expandedLevels[level.id] ? FiChevronDown : FiChevronRight)
                    : getAccessLevelIcon(level.id)} 
                  boxSize={5} 
                  color={iconColor} 
                />
                <Text fontWeight="medium">{level.name}</Text>
                
                {/* Remove the right-side chevron since we've moved it to the left */}
                {/* We'll only show a right-side indicator for special cases if needed */}
                {/* {level.id === 0 && (
                  <Box ml="auto">
                    <Text fontSize="xs" color="gray.500">In development</Text>
                  </Box>
                )} */}
              </HStack>
            </ListItem>
            
            {/* Show flows if this level is expanded */}
            {expandedLevels[level.id] && level.flows && level.flows.length > 0 && (
              <Box pl={8} w="100%">
                <List spacing={0}>
                  {level.flows.map(flowId => {
                    const flowDetail = getFlowDetails(flowId);
                    return (
                      <ListItem 
                        key={flowId} 
                        py={2} 
                        px={3}
                        _hover={{ bg: hoverBgColor }}
                        cursor="pointer"
                        transition="all 0.2s"
                        borderRadius="md"
                        mx={2}
                        onClick={() => onSelectAccessLevel('flow', flowId)}
                      >
                        <Flex align="center">
                          <Text 
                            fontSize="md" 
                            fontWeight="bold" 
                            color={iconColor} 
                            mr={2}
                          >
                            {flowDetail ? flowDetail.icon : 'D'}
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {flowDetail ? flowDetail.name : flowId}
                          </Text>
                        </Flex>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default AccessSidebar;