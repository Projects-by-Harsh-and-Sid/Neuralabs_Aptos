// src/components/access_management/AccessMainContent.jsx - Fixed version
import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import FlowCard from './FlowCard';

const AccessMainContent = ({ flows, selectedAccessLevel, onSelectFlow, selectedFlow, accessLevels }) => {
  const bgColor = useColorModeValue('canvas.body.light', 'canvas.body.dark');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  // Get heading based on selected access level
  const getHeading = () => {
    if (selectedAccessLevel === 'all') {
      return 'All';
    }
    if (selectedAccessLevel === 0) {
      return 'Flows Under Development';
    }
    return `Access ${selectedAccessLevel}:`;
  };
  
  // Group flows by access level (for All view)
  const getGroupedFlows = () => {
    if (!flows || flows.length === 0) {
      return {};
    }
    
    if (selectedAccessLevel !== 'all' || !accessLevels) {
      return { [selectedAccessLevel]: flows };
    }
    
    // Group flows by their access level
    const grouped = {};
    
    if (accessLevels && accessLevels.length > 0) {
      // Initialize groups for each access level
      accessLevels.forEach(level => {
        if (level.id !== undefined && level.id !== null) {
          grouped[level.id] = [];
        }
      });
    }
    
    // Put each flow in the appropriate group
    flows.forEach(flow => {
      if (flow && flow.accessLevel !== undefined && flow.accessLevel !== null) {
        if (!grouped[flow.accessLevel]) {
          grouped[flow.accessLevel] = [];
        }
        grouped[flow.accessLevel].push(flow);
      }
    });
    
    return grouped;
  };
  
  // Get the name of an access level by id
  const getAccessLevelName = (levelId) => {
    if (!accessLevels) return `Access Level ${levelId}`;
    
    const levelIdNum = parseInt(levelId);
    const level = accessLevels.find(l => l.id === levelIdNum);
    return level ? level.name : `Access Level ${levelId}`;
  };
  
  const groupedFlows = getGroupedFlows();
  
  return (
    <Box 
      flex="1" 
      h="100%" 
      overflow="auto" 
      bg={bgColor} 
      p={6}
    >
      <Heading 
        as="h1" 
        size="2xl" 
        mb={2} 
        color={headingColor}
      >
        Flow Access
      </Heading>
      
      <Text fontSize="lg" opacity={0.7} mb={6}>
        Blah wlash ifjewr ojrfwnvwjp niwferijf ijwrfvrwen
      </Text>
      
      <Heading as="h2" size="lg" mb={6} color={headingColor}>
        {getHeading()}
      </Heading>
      
      {Object.keys(groupedFlows).length === 0 ? (
        <Text>No flows available.</Text>
      ) : (
        Object.entries(groupedFlows).map(([levelId, levelFlows]) => (
          levelFlows && levelFlows.length > 0 && (
            <Box key={levelId} mb={10}>
              {selectedAccessLevel === 'all' && (
                <>
                  <Heading as="h3" size="md" mb={4} color={headingColor}>
                    {getAccessLevelName(levelId)}
                  </Heading>
                  <Divider mb={4} />
                </>
              )}
              
              <SimpleGrid 
                    columns={{ base: 2, sm: 3, md: 4, lg: 5 }} 
                    spacing={4} // Reduced spacing from 6 to 4
                    >
                    {levelFlows.map(flow => (
                        <FlowCard 
                        key={flow.id} 
                        flow={flow} 
                        onSelect={() => onSelectFlow(flow.id)} 
                        isSelected={selectedFlow === flow.id}
                        size="sm" // Add a size prop to make cards smaller
                        />
                    ))}
                    </SimpleGrid>
            </Box>
          )
        ))
      )}
    </Box>
  );
};

export default AccessMainContent;