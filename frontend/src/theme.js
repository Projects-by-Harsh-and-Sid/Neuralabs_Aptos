// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    // Primary colors
    blue: {
      300: '#00bcff',
      500: '#0084b2',
      700: '#005c7d',
    },
    green: {
      300: '#31e27b',
      500: '#229e56',
      700: '#186f3c',
    },
    purple: {
      300: '#a000bc',
      500: '#700084',
      700: '#4e005c',
    },
    yellow: {
      300: '#ffbc00',
      500: '#b28400',
      700: '#7d5c00',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
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
          _hover: {
            bg: (props) => props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
        },
      },
    },
  },
});

export default theme;