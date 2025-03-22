// src/components/marketplace/MarketplacePanel/MarketplaceDetailPanel.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Tag,
  Badge,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiX,
  FiDownload,
  FiStar,
  FiCheck,
  FiInfo,
  FiGlobe,
  FiTrash2
} from 'react-icons/fi';
import { marketplaceApi } from '../../../utils/api';

const MarketplaceDetailPanel = ({ item, onClose }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const toast = useToast();
  

  // market place detial panel colors define and use

  const bgColor         = useColorModeValue('marketplace.body.light', 'marketplace.body.dark');
  const borderColor     = useColorModeValue('marketplace.border.light', 'marketplace.border.dark');
  const headingColor    = useColorModeValue('marketplace.heading.light', 'marketplace.heading.dark');
  const textColor       = useColorModeValue('marketplace.text.light', 'marketplace.text.dark');
  const lighterBgColor  = useColorModeValue('gray.50', 'gray.600');
  
  // Check if the item is owned
  React.useEffect(() => {
    const checkOwnership = async () => {
      try {
        const response = await marketplaceApi.getOwned();
        setIsOwned(response.data.includes(item.id));
      } catch (err) {
        console.error("Error checking item ownership:", err);
      }
    };
    
    checkOwnership();
  }, [item.id]);
  
  // Handle install button click
  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const response = await marketplaceApi.installItem(item.id);
      
      if (response.data.success) {
        setIsOwned(true);
        toast({
          title: "Installation Successful",
          description: `${item.name} has been installed successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Installation Failed",
        description: `Failed to install ${item.name}. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsInstalling(false);
    }
  };
  
  // Handle uninstall button click
  const handleUninstall = async () => {
    setIsUninstalling(true);
    try {
      const response = await marketplaceApi.uninstallItem(item.id);
      
      if (response.data.success) {
        setIsOwned(false);
        toast({
          title: "Uninstallation Successful",
          description: `${item.name} has been uninstalled successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Uninstallation Failed",
        description: `Failed to uninstall ${item.name}. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUninstalling(false);
    }
  };
  
  return (
    <Box
      w="calc(100%)"
      h="100%"
      bg={bgColor}
      borderLeft="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      position="absolute"
      right="0"
      top="0"
      zIndex={10}
    >
      <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={3}>
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
          <Heading as="h2" size="md" color={headingColor}>{item.name}</Heading>
        </Flex>
        <IconButton
          icon={<FiX />}
          aria-label="Close details"
          variant="ghost"
          onClick={onClose}
        />
      </Flex>
      
      <Box flex="1" overflowY="auto">
        <Box p={6} bg={bgColor}>
          <Flex justify="space-between" align="center" mb={6}>
            <Flex direction="column">
              <Text color={textColor} fontSize="sm" mb={1}>By {item.author}</Text>
              <Flex align="center" gap={2} mb={2}>
                <Flex align="center">
                  <Box as={FiStar} color="yellow.400" mr={1} />
                  <Text fontWeight="medium">{item.rating}</Text>
                </Flex>
                <Text color={textColor} fontSize="sm">|</Text>
                <Flex align="center">
                  <Text fontSize="sm">{item.downloads.toLocaleString()} downloads</Text>
                </Flex>
              </Flex>
              <Flex gap={2} mt={1} flexWrap="wrap">
                {item.tags.map(tag => (
                  <Tag key={tag} size="sm" colorScheme="blue">{tag}</Tag>
                ))}
              </Flex>
            </Flex>
            
            {isOwned ? (
              <Button 
                leftIcon={isUninstalling ? <Spinner size="sm" /> : <FiTrash2 />} 
                colorScheme="red" 
                variant="outline"
                size="md"
                onClick={handleUninstall}
                isDisabled={isUninstalling}
              >
                {isUninstalling ? 'Uninstalling...' : 'Uninstall'}
              </Button>
            ) : (
              <Button 
                leftIcon={isInstalling ? <Spinner size="sm" /> : <FiDownload />} 
                colorScheme="blue" 
                size="md"
                onClick={handleInstall}
                isDisabled={isInstalling}
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </Button>
            )}
          </Flex>
          
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={3} color={headingColor}>About</Heading>
            <Text color={textColor} whiteSpace="pre-line">
              {item.longDescription}
            </Text>
          </Box>
          
          <Divider mb={6} />
          
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Features</Tab>
              <Tab>Requirements</Tab>
              <Tab>Documentation</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <List spacing={3}>
                  {item.features.map((feature, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text color={textColor}>{feature}</Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel>
                <List spacing={3}>
                  {item.requirements.map((req, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiInfo} color="blue.500" />
                      <Text color={textColor}>{req}</Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel>
                <Box p={4} bg={lighterBgColor} borderRadius="md" mb={4}>
                  <Heading as="h4" size="xs" mb={2} color={headingColor}>Quick Start Guide</Heading>
                  <Text color={textColor} fontSize="sm">
                    1. Install the addon from the marketplace<br />
                    2. Add the component to your flow<br />
                    3. Configure the parameters<br />
                    4. Connect inputs and outputs
                  </Text>
                </Box>
                
                <Box p={4} bg={lighterBgColor} borderRadius="md">
                  <Heading as="h4" size="xs" mb={2} color={headingColor}>API Reference</Heading>
                  <Text color={textColor} fontSize="sm">
                    Refer to the documentation for a complete API reference including all available parameters and methods.
                  </Text>
                  <Button 
                    leftIcon={<FiGlobe />} 
                    size="sm" 
                    variant="outline" 
                    mt={2}
                  >
                    Open Documentation
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      
      <Flex justify="space-between" align="center" p={4} borderTop="1px solid" borderColor={borderColor}>
        <Text fontSize="sm" color={textColor}>
          Version: {item.version} • Updated: {item.lastUpdated}
        </Text>
        {isOwned ? (
          <Button 
            leftIcon={isUninstalling ? <Spinner size="sm" /> : <FiTrash2 />}
            colorScheme="red" 
            variant="outline"
            size="sm"
            onClick={handleUninstall}
            isDisabled={isUninstalling}
          >
            {isUninstalling ? 'Uninstalling...' : 'Uninstall'}
          </Button>
        ) : (
          <Button 
            leftIcon={isInstalling ? <Spinner size="sm" /> : <FiDownload />}
            colorScheme="blue" 
            size="sm"
            onClick={handleInstall}
            isDisabled={isInstalling}
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default MarketplaceDetailPanel;