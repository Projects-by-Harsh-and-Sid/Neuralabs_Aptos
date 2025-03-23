import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AptosWalletAdapterProvider, 
  useWallet as useAptosWallet 
} from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { AptosClient } from 'aptos';

// Create context for additional wallet-related state
const WalletContext = createContext(null);

// Create provider component
export const WalletContextProvider = ({ children, rpcUrl }) => {
  // Initialize wallets
  const wallets = [
    new PetraWallet(),
    new MartianWallet(),
    new PontemWallet(),
    new RiseWallet(),
    new FewchaWallet()
  ];

  

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.error('Wallet error:', error);
      }}
    >
      <InnerWalletContextProvider rpcUrl={rpcUrl}>
        {children}
      </InnerWalletContextProvider>
    </AptosWalletAdapterProvider>
  );
};

// Inner provider that has access to the Aptos wallet context
const InnerWalletContextProvider = ({ children, rpcUrl }) => {
  const { 
    connect, 
    disconnect, 
    account, 
    wallets, 
    wallet, 
    connected, 
    connecting,
    disconnecting,
    network,
    signAndSubmitTransaction,
    signTransaction,
    signMessage
  } = useAptosWallet();

  const [client, setClient] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [isConnected, setConnected] = useState(false);
  const [currentNetwork, setNetwork] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(null);

  const safeConnect = async (connect, walletName) => {
    try {
      // Add a small delay to ensure wallet state is reset properly
      await new Promise(resolve => setTimeout(resolve, 100));
      return await connect(walletName);
    } catch (error) {
      // Handle ANS-related errors
      if (error.message && (
        error.message.includes("Cannot read properties of undefined") ||
        error.message.includes("toString")
      )) {
        console.warn("Handled wallet connection ANS error:", error);
        // Still consider this a successful connection if we have an account
        return true;
      }
      // Re-throw other errors
      throw error;
    }
  };

  // Initialize Aptos client when RPC URL is provided
  useEffect(() => {
    if (rpcUrl) {
      const newClient = new AptosClient(rpcUrl);
      setClient(newClient);
    }
  }, [rpcUrl]);

  // Update wallet address when account changes
  useEffect(() => {
    if (account) {
      setWalletAddress(account.address);
      
      // Fetch balance if client and account are available
      if (client && account.address) {
        fetchBalance(account.address);
      }
    } else {
      setWalletAddress('');
      setBalance(null);
    }
  }, [account, client]);

  const disconnectWallet = () => {
    if (connected) {
      disconnect();
    } else if (isConnected) {
      // Manual disconnect for custom connections
      setWalletAddress('');
      setBalance(null);
      setConnected(false);
      setConnectedWallet(null);
    }
  };

//   const connectPetra = async () => {
//     if (!window.aptos) {
//       throw new Error('Petra Wallet not installed');
//     }
//     try {
//       // Check Petra's network
//       if (window.aptos.getNetwork) {
//         const petraNetwork = await window.aptos.getNetwork();
//         setNetwork(petraNetwork);
        
//         // if (petraNetwork !== 'Testnet') {
//         //   throw new Error('Petra Wallet is not on Testnet. Please switch to Testnet in the Petra Wallet extension.');
//         // }
//       }

//       const response = await window.aptos.connect();
//       setWalletAddress(response.address);
//       setConnected(true);
//       setConnectedWallet('Petra');
//       if (client && response.address) {
//         fetchBalance(response.address);
//       }
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

  // Fetch account balance
  const fetchBalance = async (address) => {
    try {
      const resources = await client.getAccountResources(address);
      const aptosCoinResource = resources.find(
        (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );
      
      if (aptosCoinResource) {
        const coinBalance = aptosCoinResource.data.coin.value;
        // Convert from octas (10^8) to APT
        setBalance(parseInt(coinBalance) / 100000000);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        connect, 
        disconnect, 
        account, 
        wallets, 
        wallet, 
        connected, 
        connecting,
        disconnecting,
        network,
        walletAddress,
        balance,
        client,
        signAndSubmitTransaction,
        signTransaction,
        signMessage,
        fetchBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }
  return context;
};

export default WalletContext;
