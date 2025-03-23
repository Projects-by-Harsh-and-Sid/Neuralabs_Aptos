import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Flex,
  Image,
  useColorModeValue,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '../../../contexts/WalletContext';

const WalletModal = ({ isOpen, onClose }) => {
  const { connect, wallets, connecting } = useWallet();
  const [connectingWalletName, setConnectingWalletName] = useState(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', '#18191b');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleConnectWallet = async (walletName) => {
    setConnectingWalletName(walletName);
    try {
      await connect(walletName);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setConnectingWalletName(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} color={textColor}>
        <ModalHeader>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" pb={4}>
            {wallets.map(wallet => (
              <Button
                key={wallet.name}
                variant="outline"
                onClick={() => handleConnectWallet(wallet.name)}
                justifyContent="flex-start"
                h="60px"
                borderColor={borderColor}
              >
                <Flex align="center" width="100%" justifyContent="space-between">
                  <Flex align="center">
                    {wallet.icon ? (
                      <Image 
                        src={wallet.icon} 
                        alt={`${wallet.name} icon`} 
                        boxSize="24px" 
                        mr={3}
                      />
                    ) : (
                      <Text fontSize="lg" fontWeight="bold" mr={3}>
                        {wallet.name.charAt(0)}
                      </Text>
                    )}
                    <Text>{wallet.name}</Text>
                  </Flex>
                  {(connecting && connectingWalletName === wallet.name) && <Spinner size="sm" />}
                </Flex>
              </Button>
            ))}
            
            <Text fontSize="sm" color="gray.500" mt={2}>
              Don't have an Aptos wallet? We recommend installing{' '}
              <Button 
                as="a" 
                href="https://chromewebstore.google.com/detail/pontem-crypto-wallet-eth/phkbamefinggmakgklpkljjmgibohnba?hl=en" 
                target="_blank" 
                variant="link" 
                colorScheme="blue"
                fontSize="sm"
              >
                Pontem Wallet
              </Button>
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;