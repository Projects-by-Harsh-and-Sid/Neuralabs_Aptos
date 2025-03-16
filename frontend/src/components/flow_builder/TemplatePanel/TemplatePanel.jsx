// src/components/flow_builder/TemplatePanel/TemplatePanel.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Button,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiX,
  FiCode,
  FiSave,
  FiTrash2,
  FiPlus,
} from 'react-icons/fi';

const TemplatePanel = ({ onClose, onSaveTemplate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    type: 'custom',
    description: '',
    inputs: [{ name: 'input1', type: 'any' }],
    outputs: [{ name: 'output1', type: 'any' }],
    hyperParameters: [],
    code: `import pandas as pd\n\ndef process(data):\n    \"\"\"\n    Process the input data.\n    \n    Args:\n        data: Input data to process\n        \n    Returns:\n        Processed data\n    \"\"\"\n    # Process data\n    result = data.copy()\n    \n    # Add your processing logic here\n    \n    return result`
  });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBgColor = useColorModeValue('gray.50', 'gray.700');
  
  const handleInputChange = (e) => {
    setTemplateData({
      ...templateData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCodeChange = (e) => {
    setTemplateData({
      ...templateData,
      code: e.target.value
    });
  };
  
  const addInput = () => {
    const inputs = [...templateData.inputs, { name: `input${templateData.inputs.length + 1}`, type: 'any' }];
    setTemplateData({ ...templateData, inputs });
  };
  
  const removeInput = (index) => {
    const inputs = templateData.inputs.filter((_, i) => i !== index);
    setTemplateData({ ...templateData, inputs });
  };
  
  const updateInput = (index, field, value) => {
    const inputs = [...templateData.inputs];
    inputs[index][field] = value;
    setTemplateData({ ...templateData, inputs });
  };
  
  const addOutput = () => {
    const outputs = [...templateData.outputs, { name: `output${templateData.outputs.length + 1}`, type: 'any' }];
    setTemplateData({ ...templateData, outputs });
  };
  
  const removeOutput = (index) => {
    const outputs = templateData.outputs.filter((_, i) => i !== index);
    setTemplateData({ ...templateData, outputs });
  };
  
  const updateOutput = (index, field, value) => {
    const outputs = [...templateData.outputs];
    outputs[index][field] = value;
    setTemplateData({ ...templateData, outputs });
  };
  
  const addHyperParameter = () => {
    const hyperParameters = [...templateData.hyperParameters, { key: '', value: '' }];
    setTemplateData({ ...templateData, hyperParameters });
  };
  
  const removeHyperParameter = (index) => {
    const hyperParameters = templateData.hyperParameters.filter((_, i) => i !== index);
    setTemplateData({ ...templateData, hyperParameters });
  };
  
  const updateHyperParameter = (index, field, value) => {
    const hyperParameters = [...templateData.hyperParameters];
    hyperParameters[index][field] = value;
    setTemplateData({ ...templateData, hyperParameters });
  };
  
  const handleSave = () => {
    if (onSaveTemplate) {
      onSaveTemplate(templateData);
      onClose();
    }
  };
  
  return (
    <Box 
      w={showCode ? "700px" : "384px"}
      h="100%"
      bg={bgColor}
      borderLeft="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      transition="width 0.3s"
    >
      <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Heading as="h2" size="md">New Custom Template</Heading>
        <Flex align="center" gap={3}>
          <Button 
            leftIcon={<FiCode />} 
            size="sm"
            variant={showCode ? "solid" : "outline"}
            onClick={() => setShowCode(!showCode)}
          >
            Code
          </Button>
          <IconButton 
            icon={<FiX />} 
            variant="ghost" 
            onClick={onClose} 
            aria-label="Close" 
          />
        </Flex>
      </Flex>
      
      <Tabs flex="1" display="flex" flexDirection="column" index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mx={4} mt={2}>
          <Tab>General</Tab>
          <Tab>I/O Ports</Tab>
          <Tab>Parameters</Tab>
        </TabList>
        
        <TabPanels flex="1" overflow="hidden">
          <TabPanel p={4} h="100%" position="relative">
            {showCode && (
              <Box 
                position="absolute" 
                left={0} 
                top={0} 
                h="100%" 
                w="304px" 
                borderRight="1px solid" 
                borderColor={borderColor} 
                overflow="auto" 
                bg={codeBgColor}
                zIndex={10}
              >
                <Textarea 
                  value={templateData.code}
                  onChange={handleCodeChange}
                  fontFamily="mono"
                  fontSize="sm"
                  h="100%"
                  p={4}
                  resize="none"
                  border="none"
                  borderRadius={0}
                />
              </Box>
            )}
            
            <VStack 
              spacing={6} 
              align="stretch"
              ml={showCode ? "304px" : 0}
            >
              <FormControl>
                <FormLabel htmlFor="template-name" fontSize="sm" fontWeight="medium">Template Name</FormLabel>
                <Input 
                  id="template-name"
                  name="name"
                  value={templateData.name} 
                  onChange={handleInputChange}
                  placeholder="Enter template name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="template-description" fontSize="sm" fontWeight="medium">Description</FormLabel>
                <Textarea 
                  id="template-description"
                  name="description"
                  value={templateData.description} 
                  onChange={handleInputChange}
                  placeholder="Describe what this template does"
                  minH="100px"
                />
              </FormControl>
            </VStack>
          </TabPanel>
          
          <TabPanel p={4} h="100%" position="relative">
            {showCode && (
              <Box 
                position="absolute" 
                left={0} 
                top={0} 
                h="100%" 
                w="304px" 
                borderRight="1px solid" 
                borderColor={borderColor} 
                overflow="auto" 
                bg={codeBgColor}
                zIndex={10}
              >
                <Textarea 
                  value={templateData.code}
                  onChange={handleCodeChange}
                  fontFamily="mono"
                  fontSize="sm"
                  h="100%"
                  p={4}
                  resize="none"
                  border="none"
                  borderRadius={0}
                />
              </Box>
            )}
            
            <VStack 
              spacing={6} 
              align="stretch"
              ml={showCode ? "304px" : 0}
            >
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <FormLabel m={0} fontSize="sm" fontWeight="medium">Input Ports</FormLabel>
                  <Button 
                    leftIcon={<FiPlus />} 
                    size="sm" 
                    variant="outline"
                    onClick={addInput}
                  >
                    Add Input
                  </Button>
                </Flex>
                
                <VStack spacing={3} align="stretch">
                  {templateData.inputs.map((input, index) => (
                    <Flex key={`input-${index}`} gap={2} align="center">
                      <Input 
                        value={input.name}
                        onChange={(e) => updateInput(index, 'name', e.target.value)}
                        placeholder="Name"
                        flex="1"
                      />
                      <Input 
                        value={input.type}
                        onChange={(e) => updateInput(index, 'type', e.target.value)}
                        placeholder="Type"
                        flex="1"
                      />
                      <IconButton 
                        icon={<FiTrash2 />} 
                        variant="ghost" 
                        aria-label="Remove input"
                        onClick={() => removeInput(index)}
                        isDisabled={templateData.inputs.length <= 1}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
              
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <FormLabel m={0} fontSize="sm" fontWeight="medium">Output Ports</FormLabel>
                  <Button 
                    leftIcon={<FiPlus />} 
                    size="sm" 
                    variant="outline"
                    onClick={addOutput}
                  >
                    Add Output
                  </Button>
                </Flex>
                
                <VStack spacing={3} align="stretch">
                  {templateData.outputs.map((output, index) => (
                    <Flex key={`output-${index}`} gap={2} align="center">
                      <Input 
                        value={output.name}
                        onChange={(e) => updateOutput(index, 'name', e.target.value)}
                        placeholder="Name"
                        flex="1"
                      />
                      <Input 
                        value={output.type}
                        onChange={(e) => updateOutput(index, 'type', e.target.value)}
                        placeholder="Type"
                        flex="1"
                      />
                      <IconButton 
                        icon={<FiTrash2 />} 
                        variant="ghost" 
                        aria-label="Remove output"
                        onClick={() => removeOutput(index)}
                        isDisabled={templateData.outputs.length <= 1}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
          
          <TabPanel p={4} h="100%" position="relative">
            {showCode && (
              <Box 
                position="absolute" 
                left={0} 
                top={0} 
                h="100%" 
                w="304px" 
                borderRight="1px solid" 
                borderColor={borderColor} 
                overflow="auto" 
                bg={codeBgColor}
                zIndex={10}
              >
                <Textarea 
                  value={templateData.code}
                  onChange={handleCodeChange}
                  fontFamily="mono"
                  fontSize="sm"
                  h="100%"
                  p={4}
                  resize="none"
                  border="none"
                  borderRadius={0}
                />
              </Box>
            )}
            
            <VStack 
              spacing={6} 
              align="stretch"
              ml={showCode ? "304px" : 0}
            >
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <FormLabel m={0} fontSize="sm" fontWeight="medium">Hyper Parameters</FormLabel>
                  <Button 
                    leftIcon={<FiPlus />} 
                    size="sm" 
                    variant="outline"
                    onClick={addHyperParameter}
                  >
                    Add Parameter
                  </Button>
                </Flex>
                
                <VStack spacing={3} align="stretch">
                  {templateData.hyperParameters.map((param, index) => (
                    <Flex key={`param-${index}`} gap={2} align="center">
                      <Input 
                        value={param.key}
                        onChange={(e) => updateHyperParameter(index, 'key', e.target.value)}
                        placeholder="Key"
                        flex="1"
                      />
                      <Input 
                        value={param.value}
                        onChange={(e) => updateHyperParameter(index, 'value', e.target.value)}
                        placeholder="Default Value"
                        flex="1"
                      />
                      <IconButton 
                        icon={<FiTrash2 />} 
                        variant="ghost" 
                        aria-label="Remove parameter"
                        onClick={() => removeHyperParameter(index)}
                      />
                    </Flex>
                  ))}
                  
                  {templateData.hyperParameters.length === 0 && (
                    <Box textAlign="center" color="gray.500" py={4}>
                      No hyper parameters defined. Click "Add Parameter" to create one.
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Flex justify="flex-end" gap={3} p={4} borderTop="1px solid" borderColor={borderColor}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          leftIcon={<FiSave />} 
          colorScheme="blue" 
          onClick={handleSave}
        >
          Save Template
        </Button>
      </Flex>
    </Box>
  );
};

export default TemplatePanel;