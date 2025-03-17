// src/components/flow_builder/CodePanel/CodePanel.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiX, FiPlay } from 'react-icons/fi';

const CodePanel = ({ node, template, isTemplate = false, onClose }) => {
  const [code, setCode] = useState(
    template ? template.code : 
    `import pandas as pd

def ${node ? node.name.toLowerCase() : 'process'}(data):
    """
    Process the input data.
    
    Args:
        data: Input data to process
        
    Returns:
        Processed data
    """
    # Process data
    result = data.copy()
    
    # Add your processing logic here
    
    return result`
  );

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const borderColor = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'white');
  const syntaxColor1 = useColorModeValue('blue.300', 'blue.200');
  const syntaxColor2 = useColorModeValue('green.300', 'green.200');
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  
  return (
    <Box
      position="absolute"
      left="0"
      top="0"
      h="100%"
      w="calc(100% - 384px)"
      bg={bgColor}
      zIndex={10}
      display="flex"
      flexDirection="column"
    >
      <Flex 
        align="center" 
        justify="space-between" 
        p={4} 
        borderBottom="1px solid" 
        borderColor={borderColor}
      >
        <Heading as="h3" size="sm" color={textColor}>
          {isTemplate ? 'Template Code' : 'Node Code'}
        </Heading>
        <Flex gap={2}>
          <IconButton
            icon={<FiPlay />}
            aria-label="Run code"
            variant="ghost"
            color="green.400"
          />
          <IconButton
            icon={<FiX />}
            aria-label="Close code panel"
            variant="ghost"
            onClick={onClose}
          />
        </Flex>
      </Flex>
      
      <Box flex="1" p={0} position="relative" overflow="hidden">
        <Textarea
          value={code}
          onChange={handleCodeChange}
          h="100%"
          resize="none"
          fontFamily="monospace"
          fontSize="14px"
          p={4}
          bg={bgColor}
          color={textColor}
          border="none"
          borderRadius={0}
          _focus={{ outline: 'none', boxShadow: 'none' }}
          isReadOnly={!isTemplate}
          sx={{
            // Basic syntax highlighting with CSS - would use a dedicated library in a real app
            '& .keyword': { color: syntaxColor1 },
            '& .string': { color: syntaxColor2 },
            spellCheck: 'false',
          }}
        />
      </Box>
    </Box>
  );
};

export default CodePanel;