// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    // Neutral colors in grayscale
    gray: {
      50: '#f9f9f9',
      100: '#ebebeb',
      200: '#d9d9d9',
      300: '#c4c4c4',
      400: '#9d9d9d',
      500: '#7b7b7b',
      600: '#555555',
      700: '#333333',
      800: '#1f1f1f',
      900: '#141414',
    },
    // Blue is still needed for selection states
    blue: {
      300: '#4d4d4d',
      500: '#2b2b2b',
      700: '#1a1a1a',
    },
    // Green for task nodes
    green: {
      300: '#4d4d4d',
      500: '#2b2b2b',
      700: '#1a1a1a',
    },
    // Purple for parameter nodes
    purple: {
      300: '#4d4d4d',
      500: '#2b2b2b',
      700: '#1a1a1a',
    },
    // Yellow for logo
    yellow: {
      300: '#7b7b7b',
      500: '#555555',
      700: '#333333',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        navButton: {
          width: '100%',
          height: '56px',
          justifyContent: 'center',
          borderRadius: 0,
          bg: 'transparent',
          color: 'white',
          _hover: {
            bg: (props) => props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          },
        },
        solid: {
          bg: 'gray.600',
          color: 'white',
          _hover: {
            bg: 'gray.700',
          },
        },
        outline: {
          borderColor: 'gray.500',
          color: (props) => props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: 'transparent',
            borderColor: 'gray.600',
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'gray.800',
        color: 'white',
      },
    },
  },
});

export default theme;