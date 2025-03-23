import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/layout';
import FlowBuilderPage from './pages/flow_builder_page';
import DashboardPage from './pages/home_page';
import MarketplacePage from './pages/marketplace_page';
import ChatInterfacePage from './pages/chat_interface_page';
import AccessManagementPage from './pages/access_management_page';
import theme from './theme';
import { WalletContextProvider } from './contexts/WalletContext';
import api_key from './api_key.json';
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;


const API_URL = api_key.api_key;


function App() {

  const aptosRpcUrl = API_URL;
  // console.log("API_URL", aptosRpcUrl);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <WalletContextProvider rpcUrl={aptosRpcUrl}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <Layout>
              <DashboardPage />
            </Layout>
          } />
          <Route path="/flow-builder" element={
            <Layout>
              <FlowBuilderPage />
            </Layout>
          } />
          <Route path="/marketplace" element={
            <Layout>
              <MarketplacePage />
            </Layout>
          } />
          <Route path="/chat" element={
            <Layout>
              <ChatInterfacePage />
            </Layout>
          } />
          <Route path="/access-management" element={
        <Layout>
          <AccessManagementPage />
        </Layout>
          } />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
      </WalletContextProvider>
    </ChakraProvider>
  );
}

export default App;