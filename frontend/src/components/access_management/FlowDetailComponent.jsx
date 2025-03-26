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
    name: "Portfolio Manager",
    description: "An AI Blockchain driven portfolio management system that optimizes asset allocation and risk management in Aptos.",
    tags: ["AI", "Blockchain", "Deep Learning"],
    creationDate: "8 day ago (March-16-2025 07:15:39 UTC)",
    owner: "0x22b7e94bb08eb07d59d1a56345e572a5b4409563bc0c0c8fd3eec0ec0bea8d46",
    lastEdited: "1 day ago (March-23-2025 06:47:59 UTC)",
    license: "MIT",
    fork: "Original",
    socials: "X: @harshp_16 | GitHub: harshpoddar03",
    actions: "Edit | Chat | Visualize | Duplicate",
    deploymentStatus: "Active",
    md5: "e67044f2cc088c8f5c359faf3c21e7e1",
    version: "v0.2",
    publishedDate: "1 day ago (March-23-2025 04:24:29 UTC)",
    publishHash: "0x20dd388a619f40aaabc36da3314278d0ad763ceb814d838e9853cbe944159af3",
    chain: "APTOS Testnet",
    chainId: "0x1",
    chainStatus: "Active",
    chainExplorer: "explorer.aptoslabs.com/?network=testnet",
    contractName: "NeuraSynthesis",
    contractVersion: "v0.01",
    contractId: "0x48b3475fd2c5d2ae55b80154ea006e6ed6ffb78c8e7dbfd14288168d7da3f7e6",
    nftId: "NFT-001",
    nftMintHash: "0x20dd388a619f40aaabc36da3314278d0ad763ceb814d838e9853cbe944159af3",
    myAccess: "Level 6",
    noOfAccess: "2",
    monetization: "None",
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
    Workflow Summary
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