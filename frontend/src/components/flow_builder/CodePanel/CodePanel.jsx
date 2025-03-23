

// src/components/flow_builder/CodePanel/CodePanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Textarea,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiX, FiPlay, FiSave } from 'react-icons/fi';

const CodePanel = ({ 
  node, 
  template, 
  isTemplate = false, 
  onClose,
  onSaveCode,
  sidebarOpen,
  isCustomScript = false
}) => {
  const [code, setCode] = useState(
    template ? template.code : 
    node && node.code ? node.code :
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

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.900');
  // const borderColor = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const syntaxColor1 = useColorModeValue('blue.300', 'blue.200');
  const syntaxColor2 = useColorModeValue('green.300', 'green.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Update code when node or template changes
  useEffect(() => {
    if (template) {
      setCode(template.code);
    } else if (node && node.code) {
      setCode(node.code);
    }
  }, [node, template]);
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  
  const handleSaveCode = () => {
    if (onSaveCode) {
      onSaveCode(node.id, code);
      
      toast({
        title: "Code saved",
        description: "Your code has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleRunCode = () => {
    toast({
      title: "Code execution",
      description: "Code execution feature is not implemented in this demo.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Calculate width based on whether sidebar is open or not
  const getWidth = () => {
    const panelWidth = 384; // Details panel width
    const sidebarWidth = 320; // Sidebar width
    
    // if (isCustomScript) {
    //   // Use more space for custom script
    //   return `calc(40%)`; // 80px is for the nav panel
    // }
    
    // Regular code panel
    if (sidebarOpen) {
      return `calc(100% - ${sidebarWidth + panelWidth}px - 56px)`; // 80px is for the nav panel
    } else {
      return `calc(100% - ${panelWidth}px - 80px)`;
    }
  };
  
  return (
<Box
  position="absolute"
  right="0"
  marginRight={384}
  top="0"
  h="100%"
  w={getWidth()}
  bg={bgColor}
  zIndex={10}
  display="flex"
  flexDirection="column"
  boxShadow="0 0 10px rgba(0,0,0,0.1)"
  borderLeft="1px solid"
  borderColor={borderColor}
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

        <Flex gap={2} align="center">
          <Button
            leftIcon={<FiSave />}
            size="sm"
            colorScheme="blue"
            onClick={handleSaveCode}
            isDisabled={isTemplate} // Only disable for templates
          >
            Save
          </Button>
          <IconButton
            icon={<FiPlay />}
            aria-label="Run code"
            variant="ghost"
            color="green.400"
            onClick={handleRunCode}
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
          isReadOnly={!isTemplate && !isCustomScript}
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