// src/theme.js
import { extendTheme, Icon } from "@chakra-ui/react";
import { hover } from "framer-motion";


import colors from "./color";

const themes_dict = {
  
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  colors: colors,

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },

  components: {
    Button: {
      variants: {
        navButton: {
          width: "100%",
          height: "56px",
          justifyContent: "center",
          borderRadius: 0,
          bg: "transparent",
          color: "white",
          _hover: {
            bg: (props) =>
              props.colorMode === "dark" ? "gray.700" : "gray.200",
          },
        },
        solid: {
          bg: "gray.600",
          color: "white",
          _hover: {
            bg: "gray.700",
          },
        },
        outline: {
          borderColor: "gray.500",
          color: (props) => (props.colorMode === "dark" ? "white" : "gray.800"),
          _hover: {
            bg: "transparent",
            borderColor: "gray.600",
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: "gray.800",
        color: "white",
      },
    },
  },
};

const theme = extendTheme(themes_dict);

export default theme;
