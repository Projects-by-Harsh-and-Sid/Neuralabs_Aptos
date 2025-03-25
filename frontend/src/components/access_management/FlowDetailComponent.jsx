// src/components/FlowDetailComponent.jsx
import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const FlowDetailComponent = ({ flowDetails, onHoverItem, onLeaveItem }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("black", "black");
  const sectionTitleColor = useColorModeValue("black", "white");
  const rowBgColor = useColorModeValue("gray.50", "#1e1e1e");
  const tagBgColor = useColorModeValue("gray.600", "gray.600");

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
    md5: "479d52457ff6ed1fbb885da368cf2e91",
    version: "v1.2",
    publishedDate: "2025-03-25 (0 days ago)",
    publishHash: "0x1234...abcd",
    chain: "APT APTOS",
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
    monetization: "Subscription ($10/month) | One-time sale ($100)",
  };

  const data = defaultFlowData;

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
      <Heading
        as="h1"
        size="xl"
        color={textColor}
        mb={4}
        onMouseEnter={() => handleHover("flowName")}
        onMouseLeave={handleLeave}
      >
        {data.name}
      </Heading>

      <Heading
        as="h2"
        size="md"
        color={sectionTitleColor}
        mb={3}
        onMouseEnter={() => handleHover("generalWorkflow")}
        onMouseLeave={handleLeave}
      >
        General Workflow Summary
      </Heading>

      <VStack align="start" spacing={3} mb={4}>
        <Flex w="100%" onMouseEnter={() => handleHover("description")} onMouseLeave={handleLeave}>
          <Text fontWeight="medium" mr={2} color={mutedTextColor}>
            Description:
          </Text>
          <Text color={textColor}>{data.description}</Text>
        </Flex>

        <Flex
          w="100%"
          onMouseEnter={() => handleHover("tags")}
          onMouseLeave={handleLeave}
          align="center"
        >
          <Text fontWeight="medium" mr={2} color={mutedTextColor}>
            Tags:
          </Text>
          <Flex gap={2} wrap="wrap">
            {data.tags &&
              data.tags.map((tag, index) => (
                <Badge
                  key={index}
                  bg={tagBgColor}
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  textTransform="uppercase"
                  fontSize="xs"
                >
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
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("creationDate")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Creation Date:
              </Text>
              <Text color={textColor}>{data.creationDate}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("owner")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Owner:
              </Text>
              <Text color={textColor}>{data.owner}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("lastEdited")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Last Edited:
              </Text>
              <Text color={textColor}>{data.lastEdited}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* License Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("license")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                License:
              </Text>
              <Text color={textColor}>{data.license}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("fork")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Fork of:
              </Text>
              <Text color={textColor}>{data.fork}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Socials */}
          <Flex
            w="100%"
            align="start"
            onMouseEnter={() => handleHover("socials")}
            onMouseLeave={handleLeave}
          >
            <Text fontWeight="medium" w="180px" color={mutedTextColor}>
              Socials:
            </Text>
            <Text color={textColor}>{data.socials}</Text>
          </Flex>

          <Divider borderColor="gray.600" />

          {/* Actions */}
          <Flex
            w="100%"
            align="start"
            onMouseEnter={() => handleHover("actions")}
            onMouseLeave={handleLeave}
          >
            <Text fontWeight="medium" w="180px" color={mutedTextColor}>
              Actions:
            </Text>
            <Text color={textColor}>{data.actions}</Text>
          </Flex>
        </VStack>
      </Box>

      <Divider my={4} borderColor="gray.600" />

      {/* Deployment Summary Section */}
      <Heading
        as="h2"
        size="md"
        color={sectionTitleColor}
        mb={3}
        onMouseEnter={() => handleHover("deploymentSummary")}
        onMouseLeave={handleLeave}
      >
        Deployment Summary
      </Heading>

      <Box w="100%" py={3} px={4} bg={rowBgColor} borderRadius="md" mb={3}>
        <VStack align="start" spacing={4}>
          {/* Deployment Details */}
          <VStack align="start" spacing={2} w="100%">
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("deploymentStatus")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Status:
              </Text>
              <Text color={textColor}>{data.deploymentStatus}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("md5")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                MD5:
              </Text>
              <Text color={textColor}>{data.md5}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("version")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Version:
              </Text>
              <Text color={textColor}>{data.version}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("publishedDate")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Published Date:
              </Text>
              <Text color={textColor}>{data.publishedDate}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("publishHash")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Publish Hash:
              </Text>
              <Text color={textColor}>{data.publishHash}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Chain Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("chain")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Chain:
              </Text>
              <Text color={textColor}>{data.chain}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("chainId")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Chain ID:
              </Text>
              <Text color={textColor}>{data.chainId}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("chainStatus")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Chain Status:
              </Text>
              <Text color={textColor}>{data.chainStatus}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("chainExplorer")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Chain Explorer:
              </Text>
              <Text color={textColor}>{data.chainExplorer}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Contract Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("contractName")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Contract Name:
              </Text>
              <Text color={textColor}>{data.contractName}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("contractVersion")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Contract Version:
              </Text>
              <Text color={textColor}>{data.contractVersion}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("contractId")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                Contract ID:
              </Text>
              <Text color={textColor}>{data.contractId}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* NFT Info */}
          <VStack align="start" spacing={2} w="100%">
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("nftId")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                NFT ID:
              </Text>
              <Text color={textColor}>{data.nftId}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("nftMintHash")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                NFT Mint Hash:
              </Text>
              <Text color={textColor}>{data.nftMintHash}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("myAccess")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                My Access:
              </Text>
              <Text color={textColor}>{data.myAccess}</Text>
            </Flex>
            <Flex
              w="100%"
              align="start"
              onMouseEnter={() => handleHover("noOfAccess")}
              onMouseLeave={handleLeave}
            >
              <Text fontWeight="medium" w="180px" color={mutedTextColor}>
                No of Access:
              </Text>
              <Text color={textColor}>{data.noOfAccess}</Text>
            </Flex>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Monetization */}
          <Flex
            w="100%"
            align="start"
            onMouseEnter={() => handleHover("monetization")}
            onMouseLeave={handleLeave}
          >
            <Text fontWeight="medium" w="180px" color={mutedTextColor}>
              Monetization:
            </Text>
            <Text color={textColor}>{data.monetization}</Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default FlowDetailComponent;