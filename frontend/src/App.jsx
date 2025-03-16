import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import FlowBuilderPage from './pages/flow_builder_page';
import './App.scss';

function App() {
  return (
    <ThemeProvider value={{ theme: 'light' }}>
      <div className="app">
        <FlowBuilderPage />
      </div>
    </ThemeProvider>
  );
}

export default App;