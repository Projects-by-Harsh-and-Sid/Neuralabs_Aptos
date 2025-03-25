import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Heading, 
  VStack, 
  Badge, 
  Divider,
  useColorModeValue 
} from '@chakra-ui/react';



const FlowDetailComponent = ({ flowDetails, onHoverItem, onLeaveItem }) => {
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('black', 'black');
  const sectionTitleColor = useColorModeValue('black', 'white');
  const rowBgColor = useColorModeValue('gray.50', '#1e1e1e');
  const tagBgColor = useColorModeValue('gray.600', 'gray.600');
  

  const defaultFlowData = {
    name: "Image Classification Workflow",
    description: "Classifies images into 10 categories using deep learning",
    tags: ["AI", "Computer Vision", "Deep Learning"],
    creationDate: "2025-02-10",
    owner: "John Doe (0xABC123...)",
    lastEdited: "2025-03-24 (1 day ago)",
    license: "MIT",
    fork: "Original",
    socials: "Twitter: @john_doe | GitHub: johndoe",
    actions: "Edit | Chat | Visualize | Duplicate",
    deploymentStatus: "Active",
    md5: "a1b2c3d4e5f6g7h8",
    version: "v1.2",
    publishedDate: "2025-03-25 (0 days ago)",
    publishHash: "0x1234...abcd",
    chain: "ETH Ethereum",
    chainId: "1",
    chainStatus: "Active",
    chainExplorer: "etherscan.io",
    contractName: "NeuraSynthesis",
    contractVersion: "v0.01",
    contractId: "0x9876...xyz",
    nftId: "NFT-001",
    nftMintHash: "0x5678...def",
    myAccess: "Level 6",
    noOfAccess: "25",
    monetization: "Subscription ($10/month) | One-time sale ($100)"
  };
  
  const data = defaultFlowData
  
  const handleHover = (itemKey) => {
    if (onHoverItem) {
      onHoverItem(itemKey);
    }
  };

  const handleLeave = () => {
    if (onLeaveItem) {
      onLeaveItem();
    }
  };
  
  return (
    <Box>
      <Heading as="h1" size="xl" color={textColor} mb={4} onMouseEnter={() => handleHover('flowName')} onMouseLeave={handleLeave}>
        {data.name}
      </Heading>
      
      <Heading as="h2" size="md" color={sectionTitleColor} mb={3} onMouseEnter={() => handleHover('generalWorkflow')} onMouseLeave={handleLeave}>
        General Workflow Summary
      </Heading>
      
      <VStack align="start" spacing={3} mb={4}>
      <Flex 
            w="100%" 
            onMouseEnter={() => handleHover('description')} 
            onMouseLeave={handleLeave}
            >
            <Text fontWeight="medium" mr={2}>Description:</Text>
            <Text>{data.description}</Text>
            </Flex>
        
        <Flex 
            w="100%" 
            onMouseEnter={() => handleHover('tags')} 
            onMouseLeave={handleLeave}
            align="center"
            >
            <Text fontWeight="medium" mr={2}>Tags:</Text>
            <Flex gap={2} wrap="wrap">
                {data.tags && data.tags.map((tag, index) => (
                <Badge key={index} bg={tagBgColor} color="white" px={2} py={1} borderRadius="md">
                    {tag}
                </Badge>
                ))}
            </Flex>
            </Flex>
      </VStack>
      
      {/* Creation & Related Info Section */}
      <Box w="100%" py={3} px={4} bg={rowBgColor} borderRadius="md" mb={3}>
        <VStack align="start" spacing={4}>
          {/* Creation Details */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('creationDate')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Creation Date:</Text>
              <Text>{data.creationDate}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('owner')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Owner:</Text>
              <Text>{data.owner}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('lastEdited')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Last Edited:</Text>
              <Text>{data.lastEdited}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* License Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('license')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>License:</Text>
              <Text>{data.license}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('fork')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Fork of:</Text>
              <Text>{data.fork}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* Socials */}
          <Flex w="100%" onMouseEnter={() => handleHover('socials')} onMouseLeave={handleLeave}>
            <Text fontWeight="medium" mr={2}>Socials:</Text>
            <Text>{data.socials}</Text>
          </Flex>

          <Divider />

          {/* Actions */}
          <Flex w="100%" onMouseEnter={() => handleHover('actions')} onMouseLeave={handleLeave}>
            <Text fontWeight="medium" mr={2}>Actions:</Text>
            <Text>{data.actions}</Text>
          </Flex>
        </VStack>
      </Box>

      <Divider my={4} />
      
      {/* Deployment Summary Section */}
      <Heading as="h2" size="md" color={sectionTitleColor} mb={3} onMouseEnter={() => handleHover('deploymentSummary')} onMouseLeave={handleLeave}>
        Deployment Summary
      </Heading>
      
      <Box w="100%" py={3} px={4} bg={rowBgColor} borderRadius="md" mb={3}>
        <VStack align="start" spacing={4}>
          {/* Deployment Details */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('deploymentStatus')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Status:</Text>
              <Text>{data.deploymentStatus}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('md5')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>MD5:</Text>
              <Text>{data.md5}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('version')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Version:</Text>
              <Text>{data.version}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('publishedDate')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Published Date:</Text>
              <Text>{data.publishedDate}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('publishHash')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Publish Hash:</Text>
              <Text>{data.publishHash}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* Chain Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('chain')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Chain:</Text>
              <Text>{data.chain}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('chainId')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Chain ID:</Text>
              <Text>{data.chainId}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('chainStatus')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Chain Status:</Text>
              <Text>{data.chainStatus}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('chainExplorer')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Chain Explorer:</Text>
              <Text>{data.chainExplorer}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* Contract Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('contractName')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Contract Name:</Text>
              <Text>{data.contractName}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('contractVersion')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Contract Version:</Text>
              <Text>{data.contractVersion}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('contractId')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>Contract ID:</Text>
              <Text>{data.contractId}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* NFT Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex w="100%" onMouseEnter={() => handleHover('nftId')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>NFT ID:</Text>
              <Text>{data.nftId}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('nftMintHash')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>NFT Mint Hash:</Text>
              <Text>{data.nftMintHash}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('myAccess')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>My Access:</Text>
              <Text>{data.myAccess}</Text>
            </Flex>
            <Flex w="100%" onMouseEnter={() => handleHover('noOfAccess')} onMouseLeave={handleLeave}>
              <Text fontWeight="medium" mr={2}>No of Access:</Text>
              <Text>{data.noOfAccess}</Text>
            </Flex>
          </VStack>

          <Divider />

          {/* Monetization */}
          <Flex w="100%" onMouseEnter={() => handleHover('monetization')} onMouseLeave={handleLeave}>
            <Text fontWeight="medium" mr={2}>Monetization:</Text>
            <Text>{data.monetization}</Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default FlowDetailComponent;