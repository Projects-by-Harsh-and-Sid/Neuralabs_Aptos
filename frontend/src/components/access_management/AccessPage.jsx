// src/components/access_management/AccessPage.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import AccessSidebar from './AccessSidebar';
import AccessMainContent from './AccessMainContent';
import AccessDetailPanel from './AccessDetailPanel';
import { accessManagementApi } from '../../utils/access-api';

const AccessPage = () => {
  const [accessLevels, setAccessLevels] = useState([]);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flowsData, setFlowsData] = useState([]);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [flowAccessDetails, setFlowAccessDetails] = useState(null);
  
  const toast = useToast();

  // Fetch access levels data
  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        const response = await accessManagementApi.getAccessLevels();
        setAccessLevels(response.data.levels);
      } catch (err) {
        console.error('Error fetching access levels:', err);
        // Set default levels if API fails
        setAccessLevels([
          { id: 6, name: "Access Level 6", flows: [] },
          { id: 5, name: "Access Level 5", flows: [] },
          { id: 4, name: "Access Level 4", flows: [] },
          { id: 3, name: "Access Level 3", flows: [] },
          { id: 2, name: "Access Level 2", flows: [] },
          { id: 1, name: "Access Level 1", flows: [] },
          { id: 0, name: "Flows Under Development", flows: [] }
        ]);
      }
    };
    
    fetchAccessLevels();
  }, []);

  // Fetch flows data
  useEffect(() => {
    const fetchFlowsData = async () => {
      try {
        // Make sure we're calling getAllFlows, not relying on marketplace data
        const response = await accessManagementApi.getAllFlows();
        setFlowsData(response.data);
      } catch (err) {
        console.error('Error fetching flows data:', err);
        setFlowsData([]); // Set empty array to prevent undefined errors
      }
    };
    
    fetchFlowsData();
  }, []);

  // Handle selection of an access level in the sidebar
  const handleAccessLevelSelect = (type, id) => {
    if (type === 'flow') {
      // If a flow was selected directly from the sidebar
      handleFlowSelect(id);
    } else {
      // If an access level was selected
      setSelectedAccessLevel(id);
      setDetailPanelOpen(false);
      setSelectedFlow(null);
    }
  };

  // Handle selection of a flow in the main content
  const handleFlowSelect = async (flowId) => {
    try {
      const response = await accessManagementApi.getFlowAccess(flowId);
      setFlowAccessDetails(response.data);
      setSelectedFlow(flowId);
      setDetailPanelOpen(true);
    } catch (err) {
      console.error('Error fetching flow access details:', err);
      toast({
        title: "Error",
        description: "Failed to load flow access details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle closing the detail panel
  const handleCloseDetailPanel = () => {
    setDetailPanelOpen(false);
    setSelectedFlow(null);
  };

  // Filter flows based on selected access level
  const getFilteredFlows = () => {
    if (!flowsData || flowsData.length === 0) {
      return [];
    }
    
    if (selectedAccessLevel === 'all') {
      return flowsData;
    }
    
    const level = accessLevels.find(level => level.id === selectedAccessLevel);
    if (!level) return [];
    
    return flowsData.filter(flow => level.flows.includes(flow.id));
  };

  return (
    <Flex h="100%" w="100%" overflow="hidden">
      <AccessSidebar 
        accessLevels={accessLevels}
        selectedAccessLevel={selectedAccessLevel}
        onSelectAccessLevel={handleAccessLevelSelect}
        flowsData={flowsData}
      />
      
      {!detailPanelOpen ? (
        <AccessMainContent 
          flows={getFilteredFlows()}
          selectedAccessLevel={selectedAccessLevel}
          onSelectFlow={handleFlowSelect}
          selectedFlow={selectedFlow}
          accessLevels={accessLevels}
        />
      ) : (
        <AccessDetailPanel 
          flowDetails={flowAccessDetails}
          onClose={handleCloseDetailPanel}
        />
      )}
    </Flex>
  );
};

export default AccessPage;