
// src/components/flow_builder/VisualizePanel/VisualizePanel.jsx
import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  VStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  IconButton,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiBarChart2, 
  FiType, 
  FiEye, 
  FiGrid, 
  FiPackage, 
  FiMaximize2,
  FiZoomIn,
  FiZoomOut,
  FiCamera,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
  FiDownload
} from 'react-icons/fi';



const VisualizePanel = ({ 
  hideTextLabels, 
  onToggleHideTextLabels,
  viewOnlyMode,
  onToggleViewOnlyMode,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleOrientation,
  onScreenshot,
  onExportFlow,
  toggleSidebar,
  sidebarOpen
}) => {
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const iconColor = useColorModeValue('black', 'white');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('gray.200', 'gray.600');
  const activeColor = useColorModeValue('blue.600', 'blue.300');
  
  // Style for buttons similar to NavPanel
  const getButtonStyle = (isActive = false) => ({
    w: "100%",
    h: "56px",
    justifyContent: "center",
    borderRadius: 0,
    bg: isActive ? hoverBgColor : "transparent",
    color: isActive ? activeColor : iconColor,
    _hover: { 
      bg: hoverBgColor,
    }
  });
  
  return (
    <Box
      w="80px"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="0"
      zIndex={2}
    >
      <VStack spacing={0} align="center" w="100%" h="100%">
        {/* Header */}
        {/* <Heading as="h3" size="xs" color={textColor} py={4}>Visualize</Heading> */}
        
        {/* Toggle Sidebar Button */}
        <Box w="100%">
          <Tooltip 
            label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
  <Button
    {...getButtonStyle()}
    onClick={toggleSidebar}
    aria-label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"}
    justifyContent="center"
  >
    {sidebarOpen ? (
      <Flex alignItems="center" justifyContent="center">
        <Box as={FiChevronLeft} size="18px" mr="-7px" />
        <Box as={FiChevronLeft} size="22px" mr="-7px" />
        <Box as={FiChevronLeft} size="26px" />
      </Flex>
    ) : (
      <Flex alignItems="center" justifyContent="center">
        <Box as={FiChevronRight} size="26px" ml="-7px" />
        <Box as={FiChevronRight} size="22px" ml="-7px" />
        <Box as={FiChevronRight} size="18px" />
      </Flex>
    )}
  </Button>
          </Tooltip>
        </Box>
        
        {/* <Divider /> */}
        
        {/* View Only Mode Button */}
        <Box w="100%">
          <Tooltip 
            label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle(viewOnlyMode)}
              onClick={onToggleViewOnlyMode}
              aria-label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"}
            >
              <FiEye size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        {/* Hide Text Labels Button */}
        <Box w="100%">
          <Tooltip 
            label={hideTextLabels ? "Show Labels" : "Hide Labels"} 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle(hideTextLabels)}
              onClick={onToggleHideTextLabels}
              aria-label={hideTextLabels ? "Show Labels" : "Hide Labels"}
            >
              <FiType size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        {/* <Divider my={2} /> */}

        <Box flex="1" minH="20px" />
        
        {/* Zoom Controls */}
        <Box w="100%" textAlign="center">
          <Text fontSize="lm" color={textColor} py={2}>
            {Math.round(zoomLevel * 100)}%
          </Text>
        </Box>
        
        {/* <Box w="100%">
          <Tooltip 
            label="Zoom In" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onZoomIn}
              aria-label="Zoom In"
            >
              <FiZoomIn size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        <Box w="100%">
          <Tooltip 
            label="Zoom Out" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onZoomOut}
              aria-label="Zoom Out"
            >
              <FiZoomOut size={24} />
            </Button>
          </Tooltip>
        </Box> */}

<Box w="100%">
  <Tooltip 
    label="Zoom In" 
    placement="right" 
    bg={useColorModeValue("gray.900", "gray.900")} 
    hasArrow
  >
    <Button
      {...getButtonStyle()}
      onClick={onZoomIn}
      aria-label="Zoom In"
    >
      <Box fontSize="35px" fontWeight="bold">+</Box>
    </Button>
  </Tooltip>
</Box>

<Box w="100%">
  <Tooltip 
    label="Zoom Out" 
    placement="right" 
    bg={useColorModeValue("gray.900", "gray.900")} 
    hasArrow
  >
    <Button
      {...getButtonStyle()}
      onClick={onZoomOut}
      aria-label="Zoom Out"
    >
      <Box fontSize="35px" fontWeight="bold">−</Box>
    </Button>
  </Tooltip>
</Box>
        
        <Box w="100%">
          <Tooltip 
            label="Fit to View" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onFitView}
              aria-label="Fit to View"
            >
              <FiMaximize2 size={24} />
            </Button>
          </Tooltip>
        </Box>
        
        {/* <Divider my={2} /> */}
        
        {/* Additional Controls */}
        {/* <Box w="100%">
          <Tooltip 
            label="Toggle Orientation" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onToggleOrientation}
              aria-label="Toggle Orientation"
            >
              <FiRotateCcw size={24} />
            </Button>
          </Tooltip>
        </Box>
         */}
        {/* <Box w="100%">
          <Tooltip 
            label="Screenshot" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onScreenshot}
              aria-label="Screenshot"
            >
              <FiCamera size={24} />
            </Button>
          </Tooltip>
        </Box> */}
        
        {/* Export Button */}
        <Box w="100%" mt="auto">
          <Tooltip 
            label="Export Flow" 
            placement="right" 
            bg={useColorModeValue("gray.900", "gray.900")} 
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={onExportFlow}
              aria-label="Export Flow"
            >
              <FiDownload size={24} />
            </Button>
          </Tooltip>
        </Box>
      </VStack>
    </Box>
  );
};

export default VisualizePanel;



// ------------------------------------------------------------------------------------------------

// for animation


// import React, { useRef, useEffect } from 'react';
// import { 
//   Box, 
//   Flex, 
//   Button, 
//   VStack,
//   Text,
//   Tooltip,
//   useColorModeValue
// } from '@chakra-ui/react';
// import { 
//   FiType, 
//   FiEye, 
//   FiMaximize2,
//   FiChevronLeft,
//   FiChevronRight,
//   FiDownload
// } from 'react-icons/fi';
// import { motion, useAnimationControls } from 'framer-motion';

// // Create motion components
// const MotionFlex = motion(Flex);
// const MotionBox = motion(Box);




// const VisualizePanel = ({ 
//   hideTextLabels, 
//   onToggleHideTextLabels,
//   viewOnlyMode,
//   onToggleViewOnlyMode,
//   zoomLevel,
//   onZoomIn,
//   onZoomOut,
//   onFitView,
//   onToggleOrientation,
//   onScreenshot,
//   onExportFlow,
//   toggleSidebar,
//   sidebarOpen
// }) => {
//   const bgColor = useColorModeValue('white', 'black');
//   const borderColor = useColorModeValue('gray.200', 'gray.800');
//   const textColor = useColorModeValue('gray.700', 'gray.300');
//   const iconColor = useColorModeValue('black', 'white');
//   const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
//   const activeBgColor = useColorModeValue('gray.200', 'gray.600');
//   const activeColor = useColorModeValue('blue.600', 'blue.300');
  
//   // Use animation controls for more precise timing
//   const controls = useAnimationControls();
  
//   // Update animation when sidebar state changes
//   useEffect(() => {
//     // Calculate the left position based on sidebar state
//     const xPosition = sidebarOpen ? 400 : 80; // 320px when sidebar is open
    
//     // Animate the panel to the new position
//     controls.start({
//       left: `${xPosition}px`,
//       transition: {
//         duration: 0.3,
//         ease: "easeInOut"
//       }
//     });
//   }, [sidebarOpen, controls]);
  
//   // Style for buttons similar to NavPanel
//   const getButtonStyle = (isActive = false) => ({
//     w: "100%",
//     h: "56px",
//     justifyContent: "center",
//     borderRadius: 0,
//     bg: isActive ? hoverBgColor : "transparent",
//     color: isActive ? activeColor : iconColor,
//     _hover: { 
//       bg: hoverBgColor,
//     }
//   });
  
//   return (
//     <MotionBox
//       w="80px"
//       h="100%"
//       bg={bgColor}
//       borderRight="1px solid"
//       borderColor={borderColor}
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       padding="0"
//       zIndex={2}
//       // Use fixed positioning to avoid layout shifts
//       position="fixed"
//       top={0}
//       left={sidebarOpen ? "320px" : "0px"} // Initial position based on current state
//       bottom={0}
//       animate={controls}
//     >
//       <VStack spacing={0} align="center" w="100%" h="100%">
//         {/* Toggle Sidebar Button */}
//         <Box w="100%">
//           <Tooltip 
//             label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"} 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle()}
//               onClick={toggleSidebar}
//               aria-label={sidebarOpen ? "Close Blocks Panel" : "Open Blocks Panel"}
//               justifyContent="center"
//               position="relative"
//               overflow="hidden"
//             >
//               <MotionFlex
//                 alignItems="center"
//                 justifyContent="center"
//                 initial={false}
//                 animate={sidebarOpen ? "open" : "closed"}
//                 variants={{
//                   open: { opacity: 1, x: 0 },
//                   closed: { opacity: 0, x: 20 }
//                 }}
//                 transition={{ 
//                   duration: 0.3, 
//                   ease: "easeInOut" 
//                 }}
//                 position="absolute"
//               >
//                 <Box as={FiChevronLeft} size="18px" mr="-7px" />
//                 <Box as={FiChevronLeft} size="22px" mr="-7px" />
//                 <Box as={FiChevronLeft} size="26px" />
//               </MotionFlex>
              
//               <MotionFlex
//                 alignItems="center"
//                 justifyContent="center"
//                 initial={false}
//                 animate={sidebarOpen ? "open" : "closed"}
//                 variants={{
//                   open: { opacity: 0, x: -20 },
//                   closed: { opacity: 1, x: 0 }
//                 }}
//                 transition={{ 
//                   duration: 0.3, 
//                   ease: "easeInOut" 
//                 }}
//                 position="absolute"
//               >
//                 <Box as={FiChevronRight} size="26px" ml="-7px" />
//                 <Box as={FiChevronRight} size="22px" ml="-7px" />
//                 <Box as={FiChevronRight} size="18px" />
//               </MotionFlex>
//             </Button>
//           </Tooltip>
//         </Box>
        
//         {/* Rest of the component remains the same */}
//         {/* View Only Mode Button */}
//         <Box w="100%">
//           <Tooltip 
//             label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"} 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle(viewOnlyMode)}
//               onClick={onToggleViewOnlyMode}
//               aria-label={viewOnlyMode ? "Exit View Mode" : "Enter View Mode"}
//             >
//               <FiEye size={24} />
//             </Button>
//           </Tooltip>
//         </Box>
        
//         {/* Hide Text Labels Button */}
//         <Box w="100%">
//           <Tooltip 
//             label={hideTextLabels ? "Show Labels" : "Hide Labels"} 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle(hideTextLabels)}
//               onClick={onToggleHideTextLabels}
//               aria-label={hideTextLabels ? "Show Labels" : "Hide Labels"}
//             >
//               <FiType size={24} />
//             </Button>
//           </Tooltip>
//         </Box>

//         <Box flex="1" minH="20px" />
        
//         {/* Zoom Controls */}
//         <Box w="100%" textAlign="center">
//           <Text fontSize="sm" color={textColor} py={2}>
//             {Math.round(zoomLevel * 100)}%
//           </Text>
//         </Box>

//         <Box w="100%">
//           <Tooltip 
//             label="Zoom In" 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle()}
//               onClick={onZoomIn}
//               aria-label="Zoom In"
//             >
//               <Box fontSize="35px" fontWeight="bold">+</Box>
//             </Button>
//           </Tooltip>
//         </Box>

//         <Box w="100%">
//           <Tooltip 
//             label="Zoom Out" 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle()}
//               onClick={onZoomOut}
//               aria-label="Zoom Out"
//             >
//               <Box fontSize="35px" fontWeight="bold">−</Box>
//             </Button>
//           </Tooltip>
//         </Box>
        
//         <Box w="100%">
//           <Tooltip 
//             label="Fit to View" 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle()}
//               onClick={onFitView}
//               aria-label="Fit to View"
//             >
//               <FiMaximize2 size={24} />
//             </Button>
//           </Tooltip>
//         </Box>
        
//         {/* Export Button */}
//         <Box w="100%" mb={4}>
//           <Tooltip 
//             label="Export Flow" 
//             placement="right" 
//             bg={useColorModeValue("gray.900", "gray.900")} 
//             hasArrow
//           >
//             <Button
//               {...getButtonStyle()}
//               onClick={onExportFlow}
//               aria-label="Export Flow"
//             >
//               <FiDownload size={24} />
//             </Button>
//           </Tooltip>
//         </Box>
//       </VStack>
//     </MotionBox>
//   );
// };

// export default VisualizePanel;