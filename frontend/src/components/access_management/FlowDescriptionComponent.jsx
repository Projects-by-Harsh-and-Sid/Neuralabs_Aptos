// src/components/access_management/FlowDescriptionComponent.jsx
import React from 'react';
import { 
  Box, 
Flex,
  Text, 
  Heading, 
  VStack, 
  Badge, 
  Button,
  Divider,
  useColorModeValue 
} from '@chakra-ui/react';
import { FiPlus, FiInfo } from 'react-icons/fi';



// Descriptions for all possible flow detail elements
const descriptions = {
  default: "Default text. Hover on specific detail to know more about it.",
  flowName: "The name of the flow. This is used to identify the flow in the Neuralabs ecosystem.",
  generalWorkflow: "This section provides a high-level overview of what the flow does and how it's categorized.",
  description: "A brief description of what the flow does, its purpose, and its capabilities.",
  tags: "Keywords that categorize this flow to make it easier to find. Tags help users discover your flow when searching.",
  creationDate: "The date when this flow was first created in the Neuralabs system.",
  owner: "The wallet address of the owner who created this flow. The owner has full control over the flow.",
  lastEdited: "The most recent date when changes were made to this flow, with the time period since then.",
  license: "The license under which this flow is released. This determines how others can use, modify, and distribute it.",
  fork: "Indicates if this flow is original or derived from another flow (a fork). If it's a fork, a link to the original will be provided.",
  socials: "Links to social media accounts or community channels related to this flow.",
  actions: "Common operations you can perform on this flow such as editing, accessing the chat interface, visualizing the flow, or duplicating it.",
  deploymentSummary: "This section provides details about how and when the flow was deployed to the network.",
  deploymentStatus: "The current status of the flow deployment. 'Active' means it's currently running, 'Error' indicates issues with the deployment.",
  md5: "A cryptographic hash of the flow's code that ensures integrity and can be used to verify the flow hasn't been modified.",
  version: "The current version number of the flow, following semantic versioning (major.minor.patch).",
  publishedDate: "The date when this version of the flow was published to the network.",
  publishHash: "The transaction hash or identifier for the publication transaction, often linked to the NFT creation.",
  blockchainSummary: "This section provides details about the blockchain where the flow is deployed and how to access it.",
  chain: "The blockchain network where this flow is deployed, including its symbol and name.",
  chainId: "The unique identifier for the blockchain network where the flow is deployed.",
  chainStatus: "Indicates whether the blockchain network is active and functioning properly.",
  chainExplorer: "Link to view the flow's on-chain data in a blockchain explorer.",
  contractName: "The name of the smart contract that powers this flow.",
  contractVersion: "The version of the smart contract being used.",
  contractId: "The unique identifier for the contract on the blockchain, with a link to view its deployment.",
  nftId: "The unique identifier for the NFT that represents ownership of this flow.",
  nftMintHash: "The transaction hash from when the NFT was created/minted on the blockchain.",
  myAccess: "Your current permission level for this flow, determining what actions you can perform.",
  noOfAccess: "The total number of users who have been granted access to this flow.",
  monetization: "The methods by which this flow can be monetized, including subscription options, sales, and partner platforms."
};

const FlowDescriptionComponent = ({ flowDetails, currentHoveredItem }) => {
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const infoIconColor = useColorModeValue('blue.500', 'blue.300');
  
  // Get the description for the currently hovered item or use default
  const currentDescription = currentHoveredItem ? 
    descriptions[currentHoveredItem] || descriptions.default :
    descriptions.default;
  
  return (
    <Box>
      {/* Description for hovered element */}
      <Box
        p={4}
        bg={bgColor}
        borderRadius="md"
        mb={6}
        minH="100px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Flex align="center" mb={2}>
          <Box as={FiInfo} color={infoIconColor} mr={2} />
          <Text fontWeight="bold" color={textColor}>
            {currentHoveredItem ? currentHoveredItem.charAt(0).toUpperCase() + currentHoveredItem.slice(1) : "Information"}
          </Text>
        </Flex>
        <Text color={mutedTextColor}>
          {currentDescription}
        </Text>
      </Box>
      
      {/* <Divider my={6} /> */}
    </Box>
  );
};

export default FlowDescriptionComponent;