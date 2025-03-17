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
    // Blue for data nodes
    blue: {
      300: '#63B3ED',
      500: '#3182CE',
      700: '#2C5282',
    },
    // Green for task nodes
    green: {
      300: '#68D391',
      500: '#38A169',
      700: '#276749',
    },
    // Purple for parameter nodes
    purple: {
      300: '#B794F4',
      500: '#805AD5',
      700: '#553C9A',
    },
    // Yellow for logo
    yellow: {
      300: '#F6E05E',
      500: '#D69E2E',
      700: '#975A16',
    },
    // Red for destructive actions
    red: {
      300: '#FC8181',
      500: '#E53E3E',
      700: '#9B2C2C',
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