import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Divider,
  Flex,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
  Collapse
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiHome, FiList, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { accessManagementApi } from '../../utils/access-api'; // Updated import path
import SidebarItem from './SidebarItem';

const AccessSidebar = ({ selectedFlow, onSelectFlow, onViewChange, loading = false }) => {
  const [accessLevels, setAccessLevels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    myFlows: true,
    otherFlows: true,
    projects: true
  });
  const [expandedLevels, setExpandedLevels] = useState({});
  const [view, setView] = useState('home'); // 'home', 'all', 'myFlows', 'otherFlows', etc.
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', '#18191b');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  // Fetch access levels and flows
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch access levels
        const levelsResponse = await accessManagementApi.getAccessLevels();
        setAccessLevels(levelsResponse.data.levels);
        
        // Initialize expanded state for levels
        const initialExpandedLevels = {};
        levelsResponse.data.levels.forEach(level => {
          initialExpandedLevels[level.id] = false;
        });
        setExpandedLevels(initialExpandedLevels);
        
        // Fetch all flows
        const flowsResponse = await accessManagementApi.getAllFlows();
        setFlows(flowsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter flows by search query
  const filteredFlows = flows.filter(flow => 
    flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group flows by their access level
  const flowsByAccessLevel = accessLevels.reduce((acc, level) => {
    acc[level.id] = filteredFlows.filter(flow => flow.accessLevel === level.id);
    return acc;
  }, {});
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle level expansion
  const toggleLevel = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle view change
  // Handle view change
  const handleViewChange = (newView) => {
    if (onViewChange) {
      onViewChange(newView);
    }
  };
  
  // Handle flow selection
  const handleSelectFlow = (flow) => {
    if (onSelectFlow) {
      onSelectFlow(flow);
    }
  };

  return (
    <Box 
      w="280px" 
      h="100%" 
      bg={bgColor} 
      borderRight="1px" 
      borderColor={borderColor}
      position="relative"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <Text fontWeight="bold" fontSize="xl">My Flows</Text>
        <InputGroup size="sm" mt={3}>
        <InputLeftElement pointerEvents="none" height="100%" pl={1}>
          <Icon as={FiSearch} color="gray.500" fontSize="14px" />
        </InputLeftElement>
        <Input 
          placeholder="Search..." 
          value={searchQuery}
          onChange={handleSearchChange}
          borderRadius="md"
          bg={useColorModeValue("white", "#1f1f1f")}
          _placeholder={{ color: "gray.500", fontSize: "13px" }}
          _focus={{ 
            borderColor: "blue.400", 
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" 
          }}
        />
      </InputGroup>
      </Box>
      
      {/* Navigation Items - wrap in a scrollable container */}
      <Box flex="1" overflow="auto">
        <VStack align="stretch" spacing={0}>
          {/* Home */}
          <SidebarItem 
            label="Home" 
            isActive={view === 'home'} 
            onClick={() => handleViewChange('home')}
            icon={FiHome}
          />
          
          {/* All Flows */}
          <SidebarItem 
            label="All Flows" 
            isActive={view === 'all'} 
            onClick={() => handleViewChange('all')}
            icon={FiList}
          />
          
          {/* My Flows Section */}
          <SidebarItem 
            label="My Flows" 
            isSection 
            isExpanded={expandedSections.myFlows}
            onClick={() => toggleSection('myFlows')}
          />
          
          {expandedSections.myFlows && (
            <>
              <SidebarItem 
                label="Made by me" 
                indentLevel={1}
                isActive={view === 'myFlows-made'}
                onClick={() => handleViewChange('myFlows-made')}
              />
              <SidebarItem 
                label="Under Development" 
                indentLevel={1}
                isActive={view === 'myFlows-dev'}
                onClick={() => handleViewChange('myFlows-dev')}
              />
            </>
          )}
          
          {/* Other Flows Section */}
          <SidebarItem 
            label="Other Flows" 
            isSection 
            isExpanded={expandedSections.otherFlows}
            onClick={() => toggleSection('otherFlows')}
          />
          
          {expandedSections.otherFlows && accessLevels.map((level) => (
          <SidebarItem 
            key={level.id}
            label={level.name}
            indentLevel={1}
            isActive={view === `level-${level.id}`}
            onClick={() => handleViewChange(`level-${level.id}`)}
            // Count badge showing number of flows at this level
          
          />
        ))}
          {/* Projects Section */}
          <SidebarItem 
            label="Projects" 
            isSection 
            isExpanded={expandedSections.projects}
            onClick={() => toggleSection('projects')}
          />
          
          {expandedSections.projects && (
            <>
              <SidebarItem 
                label="Project 1" 
                indentLevel={1}
                isActive={view === 'project-1'}
                onClick={() => handleViewChange('project-1')}
              />
              <SidebarItem 
                label="Project 2" 
                indentLevel={1}
                isActive={view === 'project-2'}
                onClick={() => handleViewChange('project-2')}
              />
            </>
          )}
        </VStack>
        
        {/* Loading indicator */}
        {(isLoading || loading) && (
          <Flex justify="center" my={4}>
            <Spinner size="sm" color="blue.500" />
          </Flex>
        )}
      </Box>
      
      {/* Create Flow Button - fixed at bottom */}
      <Box 
        p={4} 
        borderColor={borderColor} 
        bg={bgColor}
      >
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="blue" 
          size="sm" 
          w="100%"
          onClick={() => console.log('Create new project')}
        >
          Create new project
        </Button>
      </Box>
    </Box>
  );
};

export default AccessSidebar;