// import React from 'react';
// import {
//   Flex,
//   Text,
//   Box,
//   Icon,
//   useColorModeValue,
//   Badge
// } from '@chakra-ui/react';
// import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

// const SidebarItem = ({ 
//   label, 
//   isActive = false, 
//   isSection = false, 
//   isExpanded = false, 
//   indentLevel = 0, 
//   icon = null,
//   hasChildren = false,
//   onClick 
// }) => {
//   const bgColor = useColorModeValue('white', '#18191b');
//   const hoverBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
//   const activeBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
//   const activeTextColor = useColorModeValue('#1e1f21', '#fdfdfd');
//   const textColor = useColorModeValue('gray.800', 'gray.100');
//   const mutedTextColor = useColorModeValue('gray.600', '#525355');
//   const hovericonColor = useColorModeValue('gray.800', 'white');
  

//   return (
//     <Flex
//       py={2}
//       px={4 + (indentLevel * 8)}
//       bg={isActive ? activeBgColor : bgColor}
//       align="center"
//       cursor="pointer"
//       transition="all 0.2s"
//       role="group"
//       _hover={{ bg: hoverBgColor }}
//       onClick={onClick}
//       userSelect="none"
//     >
//       {/* Show expansion chevron if it's a section or has children */}
//       {(isSection || hasChildren) ? (
//         <Icon 
//           as={isExpanded ? FiChevronDown : FiChevronRight} 
//           mr={2} 
//           color={mutedTextColor}
//         />
//       ) : icon ? (
//         <Icon 
//           as={icon} 
//           mr={2} 
//           color={isActive ? activeTextColor : mutedTextColor}
//           fontSize="md"
//         />
//       ) : null}
      
//       <Text 
//         color={isActive ? activeTextColor : textColor} 
//         fontWeight={isSection || isActive ? 'semibold' : 'normal'} 
//         fontSize={isSection ? 'sm' : 'sm'}
//         flex="1"
//       >
//         {label}
//       </Text>
      
//     </Flex>
//   );
// };

// export default SidebarItem;
import React from 'react';
import {
  Flex,
  Text,
  Box,
  Icon,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiCircle, 
  FiFolder, 
  FiLayers, 
  FiFileText,
  FiUsers,
  FiCode
} from 'react-icons/fi';

const SidebarItem = ({ 
  label, 
  isActive = false, 
  isSection = false, 
  isExpanded = false, 
  indentLevel = 0, 
  icon = null,
  hasChildren = false,
  count,
  onClick 
}) => {
  const bgColor = useColorModeValue('white', '#18191b');
  const hoverBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
  const activeBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
  const activeTextColor = useColorModeValue('#1e1f21', '#fdfdfd');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', '#525355');
  const hovericonColor = useColorModeValue('gray.800', 'white');
  const badgeBg = useColorModeValue('gray.100', 'gray.700');
  const badgeColor = useColorModeValue('gray.600', 'gray.300');
  
  // Default icon based on indentation level and content
  const getDefaultIcon = () => {
    if (isSection) return null;
    if (indentLevel === 0) return icon; // Use provided icon for top-level items
    
    // For indented items (sub-elements), choose an appropriate icon
    if (label.toLowerCase().includes('project')) return FiFolder;
    if (label.toLowerCase().includes('development')) return FiCode;
    if (label.toLowerCase().includes('shared') || label.toLowerCase().includes('public')) return FiUsers;
    if (label.toLowerCase().includes('made by me')) return FiFileText;
    
    // Default icon for other sub-items
    return FiLayers;
  };

  // Get the appropriate icon
  const itemIcon = getDefaultIcon();

  return (
    <Flex
      py={2}
      px={4 + (indentLevel * 8)}
      bg={isActive ? activeBgColor : bgColor}
      align="center"
      cursor="pointer"
      transition="all 0.2s"
      role="group"
      _hover={{ bg: hoverBgColor }}
      onClick={onClick}
      userSelect="none"
    >
      {/* Show expansion chevron if it's a section or has children */}
      {(isSection || hasChildren) ? (
        <Icon 
          as={isExpanded ? FiChevronDown : FiChevronRight} 
          mr={2} 
          color={mutedTextColor}
        />
      ) : itemIcon ? (
        <Icon 
          as={itemIcon} 
          mr={2} 
          fontSize="sm"
          color={isActive ? activeTextColor : mutedTextColor}
          _groupHover={{ color: hovericonColor }}
        />
      ) : indentLevel > 0 ? (
        // Small dot for sub-items without specific icons
        <Box 
          as="span" 
          w="2px" 
          h="2px" 
          borderRadius="full" 
          bg={mutedTextColor} 
          mr={2} 
          ml={1}
        />
      ) : null}
      
      <Text 
        color={isActive ? activeTextColor : textColor} 
        fontWeight={isSection || isActive ? 'semibold' : 'normal'} 
        fontSize={isSection ? 'sm' : 'sm'}
        flex="1"
      >
        {label}
      </Text>
      
      {/* Show count badge if provided */}
      {count !== undefined && (
        <Badge 
          fontSize="xs" 
          colorScheme={isActive ? "blue" : "gray"}
          bg={isActive ? "blue.50" : badgeBg}
          color={isActive ? "blue.600" : badgeColor}
          borderRadius="full"
          px={2}
          ml={2}
        >
          {count}
        </Badge>
      )}
    </Flex>
  );
};

export default SidebarItem;