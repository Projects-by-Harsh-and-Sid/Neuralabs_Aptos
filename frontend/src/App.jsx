// src/App.jsx
import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import FlowBuilderPage from './pages/flow_builder_page';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <FlowBuilderPage />
    </ChakraProvider>
  );
}

export default App;