import React from 'react';
import {
  Flex,
  Text,
  Box,
  Icon,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const SidebarItem = ({ 
  label, 
  isActive = false, 
  isSection = false, 
  isExpanded = false, 
  indentLevel = 0, 
  icon = null,
  hasChildren = false,
  onClick 
}) => {
  const bgColor = useColorModeValue('white', '#18191b');
  const hoverBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
  const activeBgColor = useColorModeValue('#fdfdfd', '#1e1f21');
  const activeTextColor = useColorModeValue('#1e1f21', '#fdfdfd');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', '#525355');
  const hovericonColor = useColorModeValue('gray.800', 'white');
  

  return (
    <Flex
      py={2}
      px={4 + (indentLevel * 4)}
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
      ) : icon ? (
        <Icon 
          as={icon} 
          mr={2} 
          color={isActive ? activeTextColor : mutedTextColor}
          fontSize="md"
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
      
    </Flex>
  );
};

export default SidebarItem;