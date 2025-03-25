// src/components/flow_builder/VisualizePanel/ExportModal.jsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { FiImage, FiFileText } from "react-icons/fi";

const ExportModal = ({ isOpen, onClose, onExportFlow, onExportFlowJSON }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#18191b" color="white" borderRadius="md">
        <ModalHeader fontSize="lg" fontWeight="bold">
          Export Flow
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Prerequisites Section */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Prerequisites
              </Text>
              <Text fontSize="xs" color="gray.400">
                Exporting your flow requires sufficient permissions and access to
                the project. Ensure you have the necessary rights to export data.
                More information can be found in the{" "}
                <Text as="span" color="blue.400" textDecor="underline">
                  documentation
                </Text>
                .
              </Text>
            </Box>

            {/* Disclaimer Section */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Disclaimer
              </Text>
              <Text fontSize="xs" color="gray.400">
                Exported flows may contain sensitive data. Ensure you handle the
                exported files securely and share them only with authorized
                parties.
              </Text>
            </Box>

            {/* Export Options */}
            <Box>
              <Text fontSize="xs" color="gray.400" mb={2}>
                Select an export format below.
              </Text>
              <VStack spacing={2}>
                <Button
                  leftIcon={<FiImage />}
                  width="100%"
                  size="sm"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.600" }}
                  onClick={() => {
                    onExportFlow();
                    onClose();
                  }}
                >
                  Export as PNG
                </Button>
                <Button
                  leftIcon={<FiFileText />}
                  width="100%"
                  size="sm"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.600" }}
                  onClick={() => {
                    onExportFlowJSON();
                    onClose();
                  }}
                  mb={4}
                >
                  Export as JSON
                </Button>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        {/* <ModalFooter>
          <Button
            variant="outline"
            colorScheme="gray"
            mr={3}
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;