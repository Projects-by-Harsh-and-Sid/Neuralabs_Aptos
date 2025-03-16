// src/contexts/ThemeContext.js
import React, { createContext } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ThemeContext.Provider;
export default ThemeContext;