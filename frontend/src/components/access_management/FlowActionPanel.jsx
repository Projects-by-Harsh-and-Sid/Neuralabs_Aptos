// src/components/access_management/FlowActionPanel.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  FiHome,
  FiMessageSquare,
  FiKey,
  FiEdit,
  FiTag,
  FiClock,
  FiUpload,
  FiSettings,
  FiLayout,
  FiLink,
  FiBarChart2,
  FiDownload,
  FiDollarSign,
  FiCreditCard,
  FiGitBranch,
  FiUsers,
  FiSend, // Added for Publish icon
} from "react-icons/fi";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useWallet } from "../../contexts/WalletContext";
import { useExecuteContractFunction } from "../../utils/transaction";
import flowIcons from "../../utils/my-flow-icons.json";
import PublishModal from "./Popup/PublishModal"; // Import the new modal

const FlowActionPanel = ({ toggleSidebar, sidebarOpen }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [contractValue, setContractValue] = useState("0");
  const { signAndSubmitTransaction, connected, wallet, account } = useWallet();
  const toast = useToast();

  const executeContract = useExecuteContractFunction(
    signAndSubmitTransaction,
    account,
    connected,
    wallet
  );

  const bgColor = useColorModeValue("white", "#18191b");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("black", "gray.400");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const activeColor = useColorModeValue("blue.600", "blue.300");

  const iconMapping = {
    FiHome: FiHome,
    FiMessageSquare: FiMessageSquare,
    FiKey: FiKey,
    FiEdit: FiEdit,
    FiTag: FiTag,
    FiClock: FiClock,
    FiUpload: FiUpload,
    FiSettings: FiSettings,
    FiLayout: FiLayout,
    FiLink: FiLink,
    FiBarChart2: FiBarChart2,
    FiDownload: FiDownload,
    FiDollarSign: FiDollarSign,
    FiCreditCard: FiCreditCard,
    FiGitBranch: FiGitBranch,
    FiUsers: FiUsers,
    FiSend: FiSend,
  };

  const getButtonStyle = (actionName = null) => ({
    w: "100%",
    h: "50px",
    justifyContent: "center",
    borderRadius: 0,
    bg: actionName === activeAction ? hoverBgColor : "transparent",
    color: actionName === activeAction ? activeColor : iconColor,
    _hover: { bg: hoverBgColor },
  });

  const handleActionClick = (actionName) => {
    setActiveAction(actionName);
    console.log(`Action clicked: ${actionName}`);
    if (actionName === "Publish") {
      setModalOpen(true); // Open the modal instead of directly publishing
    }
  };

  const handlePublish = async ({ versionName, versionNumber, allPreviews }) => {
    try {
      // Replace with your contract details
      const contractAddress = "0x48b3475fd2c5d2ae55b80154ea006e6ed6ffb78c8e7dbfd14288168d7da3f7e6"; // Your contract address
      const moduleName = "NFT"; // Your module name
      const functionName = "create_nft"; // Your function name
      const address = account.address; // The address of the account
      console.log("Account Address:", address); // Log the account address
      const name = "My NFT 2";
      const levelofOwnership = 6;
    

      if (!connected || !account) {
        toast({
          title: "Wallet Error",
          description: "Please connect wallet first",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Log the modal inputs (for debugging or further use)
      console.log("Version Name:", versionName);
      console.log("Version Number:", versionNumber);
      console.log("All Previews:", allPreviews);

      // Execute the contract
      await executeContract(
        contractAddress,
        moduleName,
        functionName,
        [], // type_arguments
        [name, levelofOwnership], // args
        // { maxGasAmount: "2000", gasUnitPrice: "100" } // options
      );
    // await executeContract(
    //     contractAddress,
    //     moduleName,
    //     "initialize",
    //     [], // type_arguments
    //     [], // args
    //     // { maxGasAmount: "2000", gasUnitPrice: "100" } // options
    //   );

      toast({
        title: "Contract Executed",
        description: "Transaction submitted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Publish failed:", error);
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="56px"
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
      <VStack spacing={0} align="center" w="100%" h="100%" justify="flex-start">
        {/* Toggle Sidebar Button */}
        <Box w="100%">
          <Tooltip
            label={sidebarOpen ? "Close Flow Panel" : "Open Flow Panel"}
            placement="left"
            bg={"gray.900"}
            hasArrow
          >
            <Button
              {...getButtonStyle()}
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close Flow Panel" : "Open Flow Panel"}
            >
              {sidebarOpen ? (
                <Flex alignItems="center" justifyContent="center">
                  <Box as={FaAngleDoubleRight} size="24px" ml="-7px" />
                </Flex>
              ) : (
                <Flex alignItems="center" justifyContent="center">
                  <Box as={FaAngleDoubleLeft} size="24px" ml="-7px" />
                </Flex>
              )}
            </Button>
          </Tooltip>
        </Box>

        {/* Flow Action Icons */}
        {flowIcons.sidebarOptions.map((option, index) => (
          <Box w="100%" key={index}>
            <Tooltip
              label={option.newName}
              placement="right"
              bg={"gray.900"}
              hasArrow
            >
              <Button
                {...getButtonStyle(option.newName)}
                onClick={() => handleActionClick(option.newName)}
                aria-label={option.newName}
              >
                {iconMapping[option.icon] && (
                  <Box as={iconMapping[option.icon]} size="24px" />
                )}
              </Button>
            </Tooltip>
          </Box>
        ))}
      </VStack>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onPublish={handlePublish}
      />
    </Box>
  );
};

export default FlowActionPanel;