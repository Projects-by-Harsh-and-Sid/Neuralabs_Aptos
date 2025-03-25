import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Flex,
  Button,
  HStack,
  Grid,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Icon,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiBarChart2,
  FiPieChart,
  FiActivity
} from "react-icons/fi";
import { accessManagementApi } from "../../utils/access-api";
import templateImage1 from "../../assets/template.png";
// import templateImage2 from '../../assets/templates/template2.jpg';
// import templateImage3 from '../../assets/templates/template3.jpg';
// import templateImage4 from '../../assets/templates/template4.jpg';
// import templateImage5 from '../../assets/templates/template5.jpg';

// import AccessLevelBadge from './AccessLevelBadge';

const TemplateCard = ({ title, hasButton = false, onClick, imageUrl }) => {


      

    const bgColor = useColorModeValue("white", "gray.800");
    const hoverBgColor = useColorModeValue("gray.50", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const hoverBorderColor = useColorModeValue("blue.400", "blue.400");
    const overlayBgColor = useColorModeValue("rgba(255,255,255,0.8)", "rgba(7, 3, 3, 0.6)");
    const overlayTextColor = useColorModeValue("gray.800", "white");

  return (
    <Box
      w="100%"
      h="160px" // Increased height from 120px to 160px
      bg={bgColor}
      borderRadius="md"
      position="relative"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s ease"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        bg: hoverBgColor,
        borderColor: hoverBorderColor,
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {hasButton ? (
        // Create New button card
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          p={4}
          color={textColor}
        >
          <Icon as={FiPlus} boxSize={10} mb={4} /> {/* Increased icon size */}
          <Text fontWeight="bold" fontSize="xl">
            Create New
          </Text>{" "}
          {/* Increased text size */}
        </Flex>
      ) : (
        // Template card with image
        <>
          {/* Image background filling the entire card */}
          <Box
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bgImage={`url(${imageUrl})`}
              bgSize="cover"
              bgPosition="center"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                bgGradient: "linear(to-r, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                backdropFilter: "blur(1.5px)",
                WebkitBackdropFilter: "blur(1.5px)",
                mixBlendMode: "overlay",
              }}
              _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')",
                opacity: 0.2,
                mixBlendMode: "multiply",
                pointerEvents: "none"
              }}
            />

          {/* Text overlay at the bottom */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="rgba(0,0,0,0.7)"
            p={4} // Increased padding
          >
            <Text
              color={textColor}
              fontWeight="medium"
              fontSize="md" // Increased font size
              textAlign="center"
            >
              {title || "Template"}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

const QuickAccessTab = ({ label, isActive, count, onClick }) => {

    const activeBg = useColorModeValue("blue.50", "gray.700");
    const inactiveBg = useColorModeValue("gray.100", "gray.800");
    const activeTextColor = useColorModeValue("blue.600", "white");
    const inactiveTextColor = useColorModeValue("gray.600", "gray.400");


  return (
    <Button
      bg={isActive ? activeBg : inactiveBg}
      color={isActive ? activeTextColor : inactiveTextColor}
      borderRadius="full"
      size="sm"
      fontWeight={isActive ? "semibold" : "normal"}
      onClick={onClick}
      _hover={{ bg: activeBg }}
    >
      {label} {count > 0 && `(${count})`}
    </Button>
  );
};

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
    const buttonBg = useColorModeValue("gray.100", "gray.800");
    const activeBg = useColorModeValue("blue.50", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedTextColor = useColorModeValue("gray.400", "gray.400");

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page buttons
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Determine range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page button
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          size="sm"
          bg={buttonBg}
          color={textColor}
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );

      // Add ellipsis if needed
      if (startPage > 2) {
        buttons.push(
          <Box key="ellipsis1" px={2} color={mutedTextColor}>
            ...
          </Box>
        );
      }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          bg={i === currentPage ? activeBg : buttonBg}
          color={textColor}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add last page button
    if (endPage < totalPages) {
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        buttons.push(
          <Box key="ellipsis2" px={2} color={mutedTextColor}>
            ...
          </Box>
        );
      }

      buttons.push(
        <Button
          key="last"
          size="sm"
          bg={buttonBg}
          color={textColor}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Flex justify="space-between" align="center" w="100%" py={3} px={4}>
      <Button
        size="sm"
        leftIcon={<FiChevronLeft />}
        bg={buttonBg}
        color={currentPage === 1 ? mutedTextColor : textColor}
        onClick={handlePrevious}
        isDisabled={currentPage === 1}
        _hover={{ bg: activeBg }}
      >
        Previous
      </Button>

      {/* <HStack spacing={1}>
          {renderPageButtons()}
        </HStack> */}

      <Button
        size="sm"
        rightIcon={<FiChevronRight />}
        bg={buttonBg}
        color={currentPage === totalPages ? mutedTextColor : textColor}
        onClick={handleNext}
        isDisabled={currentPage === totalPages}
        _hover={{ bg: activeBg }}
      >
        Next
      </Button>
    </Flex>
  );
};

const AccessHomePage = ({ onSelectFlow }) => {
  const [flows, setFlows] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 10 rows at a time

  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const theadBgColor = useColorModeValue("gray.100", "#1f1f1f");
  const inputBgColor = useColorModeValue("white", "#1f1f1f");
  const hoverBgColor = useColorModeValue("gray.50", "gray.800");
  const activeTabBg = useColorModeValue("blue.50", "gray.700");
  const inactiveTabBg = useColorModeValue("gray.100", "gray.800");
  const buttonBgColor = useColorModeValue("gray.100", "gray.800");
  const activeBgColor = useColorModeValue("blue.50", "gray.700");
  // Reset to first page when search query or active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Add some dummy creation dates to flows
  const addCreationDates = (flowList) => {
    const currentDate = new Date();

    return flowList.map((flow, index) => {
      // Create dates ranging from 2 days to 60 days ago
      const daysAgo = 2 + ((index * 5) % 60);
      const date = new Date();
      date.setDate(currentDate.getDate() - daysAgo);

      return {
        ...flow,
        creationDate: date.toISOString().split("T")[0], // YYYY-MM-DD format
      };
    });
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [flowsResponse, levelsResponse] = await Promise.all([
          accessManagementApi.getAllFlows(),
          accessManagementApi.getAccessLevels(),
        ]);

        // Add creation dates to flows
        const flowsWithDates = addCreationDates(flowsResponse.data);

        setFlows(flowsWithDates);
        setAccessLevels(levelsResponse.data.levels);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter flows based on search and active tab
  const filteredFlows = flows.filter((flow) => {
    // Search filter
    const matchesSearch =
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeTab === "recent") {
      return matchesSearch;
    } else if (activeTab === "development") {
      return matchesSearch && flow.accessLevel === 0;
    } else if (activeTab === "published") {
      return matchesSearch && flow.accessLevel > 0;
    } else if (activeTab === "shared") {
      return matchesSearch && flow.accessLevel >= 4; // Just for demo purposes
    }

    return matchesSearch;
  });

  // Get paginated data
  const paginatedFlows = filteredFlows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFlows.length / itemsPerPage)
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Create template cards
  const templateCards = [
    <TemplateCard
      key={0}
      hasButton={true}
      onClick={() => console.log("Create new template")}
    />,
    <TemplateCard
      key={1}
      title="Read Aptos Balance"
      imageUrl={templateImage1}
      onClick={() => console.log("Selected template 1")}
    />,
    <TemplateCard
      key={2}
      title="X-Twitter Post API "
      imageUrl={templateImage1}
      onClick={() => console.log("Selected template 2")}
    />,
    <TemplateCard
      key={3}
      title="API Integration"
      imageUrl={templateImage1}
      onClick={() => console.log("Selected template 3")}
    />,
    <TemplateCard
      key={4}
      title="Database ETL"
      imageUrl={templateImage1}
      onClick={() => console.log("Selected template 4")}
    />,
    <TemplateCard
      key={5}
      title="Analytics Dashboard"
      imageUrl={templateImage1}
      onClick={() => console.log("Selected template 5")}
    />,
  ];

  const getFlowIcon = (accessLevel) => {
    // Rotate between different graph icons based on access level
    switch (accessLevel % 3) {
      case 0:
        return FiBarChart2;
      case 1:
        return FiPieChart;
      case 2:
        return FiActivity;
      default:
        return FiBarChart2;
    }
  };

  return (
    <Box bg={bgColor} minH="100%" width={"100%"} maxW="1400px" mx="auto">
      {/* Project title */}
      <Center pt={8} pb={6} marginTop={"30px"}>
        <Heading size="lg" color={textColor}>
          Welcome to Neuralabs
        </Heading>
      </Center>

      {/* Search bar */}
      <Box maxW="600px" mx="auto" mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search Projects and Templates"
            bg="#1f1f1f"
            color={textColor}
            borderColor="gray.700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _placeholder={{ color: "gray.500" }}
            _hover={{ borderColor: "gray.600" }}
            _focus={{ borderColor: "blue.500", boxShadow: "none" }}
          />
        </InputGroup>
      </Box>

      {/* Template section */}
      {/* <Box px={6} mb={8}>
          <Text color={textColor}  mb={4} fontSize="sm">Create new or choose a template</Text>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
            {templateCards}
          </SimpleGrid>
        </Box>
         */}

      <Box px={6} mb={10}>
        {" "}
        {/* Increased horizontal padding from 6 to 8 */}
        <Text color={textColor} mb={5} fontSize="xl" fontWeight="medium">
          Create new
        </Text>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 6 }}
          spacing={9} // Increased spacing from 4 to 6
          // maxW="1300px" // Added explicit max width
          // mx="auto" // Center the grid
          
          //justifyContent="center" // Center the grid items
        >
          {templateCards}
        </SimpleGrid>
      </Box>
      {/* Quick access section */}
      <Box px={6} mb={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text color={textColor} fontWeight="medium">
            Quick access
          </Text>
        </Flex>

        <Flex justify="space-between" mb={4}>
          <HStack spacing={3} overflowX="auto" pb={2}>
            <QuickAccessTab
              label="Recently opened"
              isActive={activeTab === "recent"}
              count={flows.length}
              onClick={() => setActiveTab("recent")}
            />
            <QuickAccessTab
              label="Under Development"
              isActive={activeTab === "development"}
              count={flows.filter((f) => f.accessLevel === 0).length}
              onClick={() => setActiveTab("development")}
            />
            <QuickAccessTab
              label="Published"
              isActive={activeTab === "published"}
              count={flows.filter((f) => f.accessLevel > 0).length}
              onClick={() => setActiveTab("published")}
            />
            <QuickAccessTab
              label="Shared"
              isActive={activeTab === "shared"}
              count={flows.filter((f) => f.accessLevel >= 4).length}
              onClick={() => setActiveTab("shared")}
            />
          </HStack>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
                leftIcon={<FiUpload />}
                size="sm"
                colorScheme="gray"
                variant="ghost" 
                onClick={() => console.log("Upload clicked")}
                mr={2}
                >
                Upload
                </Button>
            <Box 
                height="24px" 
                width="1px" 
                bg={useColorModeValue("gray.300", "gray.600")} 
                mx={1}
                my={1} 
            />
            
            <IconButton
              aria-label="List view"
              icon={<FiList />}
              variant="ghost" 
              colorScheme={viewMode === "list" ? "blue" : "gray"}
              onClick={() => setViewMode("list")}
            />
            <IconButton
              aria-label="Grid view"
              icon={<FiGrid />}
              variant="ghost" 
              colorScheme={viewMode === "grid" ? "blue" : "gray"}
              onClick={() => setViewMode("grid")}
            />
          </ButtonGroup>
        </Flex>
      </Box>

      {/* Flow list */}
      <Box
        mx={6}
        mb={6}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
      >
        <Table variant="simple" size="sm">
          {/* <Thead bg="#1f1f1f">
            <Tr h="10px">
              {" "}
      
              <Th color={mutedTextColor} width="60px" py={2} fontSize="sm">
              </Th>
              <Th color={mutedTextColor} py={2} fontSize="sm">
                Name
              </Th>
              <Th color={mutedTextColor} width="150px" py={2} fontSize="sm">
                Creation date
              </Th>
              <Th color={mutedTextColor} width="150px" py={2} fontSize="sm">
                Access level
              </Th>
            </Tr>
          </Thead> */}
          <Tbody>
            {paginatedFlows.map((flow) => (
              <Tr
                key={flow.id}
                _hover={{ bg: "gray.800", cursor: "pointer" }}
                onClick={() => onSelectFlow && onSelectFlow(flow)}
              >
                <Td width={"10px"}>
                <Box
                    p={2}
                    borderRadius="md"
                    bg={`black.${(flow.accessLevel * 100) % 900 || 500}`}
                    color="white"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    maxWidth={"30px"}
                >
                    <Icon 
                    as={getFlowIcon(flow.accessLevel)} 
                    boxSize={4} 
                    maxWidth={"30px"}

                    />
                </Box>
                </Td>
                <Td color={textColor}>
                  <Text fontWeight="medium">{flow.name}</Text>
                </Td>
                <Td color={mutedTextColor}>{flow.creationDate}</Td>
                <Td>Access {flow.accessLevel}</Td>
              </Tr>
            ))}
            {filteredFlows.length === 0 && (
              <Tr>
                <Td
                  colSpan={4}
                  textAlign="center"
                  py={4}
                  color={mutedTextColor}
                >
                  No flows found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Only show pagination if needed */}
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default AccessHomePage;
