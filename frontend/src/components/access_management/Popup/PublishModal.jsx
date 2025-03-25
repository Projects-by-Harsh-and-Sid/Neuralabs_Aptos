// src/components/access_management/PublishModal.jsx
import React, { useState } from "react";
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
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";

const PublishModal = ({ isOpen, onClose, onPublish }) => {
  const [versionName, setVersionName] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [allPreviews, setAllPreviews] = useState(false);

  const handlePublish = () => {
    onPublish({ versionName, versionNumber, allPreviews });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#18191b" color="white" borderRadius="md">
        <ModalHeader fontSize="lg" fontWeight="bold">
          Publish and Share Kedro-Viz
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Prerequisites Section */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Prerequisites
              </Text>
              <Text fontSize="xs" color="gray.400">
                Deploying and hosting Kedro-Viz requires access keys or user
                credentials, depending on the chosen service provider. To use
                this feature, please add your ACCESS KEYS or credentials as
                environment variables in your project. More information can be
                found in the{" "}
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
                Kedro-Viz contains preview data for multiple datasets. You can
                enable or disable all previews when publishing Kedro-Viz.
              </Text>
            </Box>

            {/* Form Fields */}
            <Box>
              <Text fontSize="xs" color="gray.400" mb={2}>
                Please enter the required information below.
              </Text>

              <FormControl mb={3}>
                <FormLabel fontSize="sm">Hosting platform</FormLabel>
                <Select
                  placeholder="Select a hosting platform"
                  size="sm"
                  bg="gray.700"
                  borderColor="gray.600"
                >
                  <option value="aws">AWS</option>
                  <option value="gcp">GCP</option>
                  <option value="azure">Azure</option>
                </Select>
              </FormControl>

              <FormControl mb={3}>
                <FormLabel fontSize="sm">Version name</FormLabel>
                <Input
                  placeholder="Enter name"
                  size="sm"
                  bg="gray.700"
                  borderColor="gray.600"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel fontSize="sm">Version number</FormLabel>
                <Input
                  placeholder="Enter number"
                  size="sm"
                  bg="gray.700"
                  borderColor="gray.600"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel fontSize="sm" mb={0}>
                  All dataset previews
                </FormLabel>
                <Switch
                  isChecked={allPreviews}
                  onChange={(e) => setAllPreviews(e.target.checked)}
                />
                <Text fontSize="sm" ml={2}>
                  {allPreviews ? "On" : "Off"}
                </Text>
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            colorScheme="gray"
            mr={3}
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handlePublish} size="sm">
            Publish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublishModal;