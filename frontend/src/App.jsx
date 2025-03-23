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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
    </ChakraProvider>
  );
}

export default App;