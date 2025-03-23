import BlocksPanel from "./components/flow_builder/BlocksPanel/BlocksPanel";

const colors = {
  // Neutral colors in grayscale
  gray: {
    50: "#f9f9f9",
    100: "#ebebeb",
    200: "#d9d9d9",
    300: "#c4c4c4",
    400: "#9d9d9d",
    500: "#7b7b7b",
    600: "#555555",
    700: "#333333",
    800: "#1f1f1f",
    900: "#141414",
  },

  // Blue for data nodes
  blue: {
    300: "#63B3ED",
    500: "#3182CE",
    700: "#2C5282",
  },

  // Green for task nodes
  green: {
    300: "#68D391",
    500: "#38A169",
    700: "#276749",
  },

  // Purple for parameter nodes
  purple: {
    300: "#B794F4",
    500: "#805AD5",
    700: "#553C9A",
  },

  // Yellow for logo
  yellow: {
    300: "#F6E05E",
    500: "#D69E2E",
    700: "#975A16",
  },

  // Red for destructive actions
  red: {
    300: "#FC8181",
    500: "#E53E3E",
    700: "#9B2C2C",
  },

  navbar: {
    body: {
      dark: "#0F0F11",
      light: "#F9F9FA",
    },
    border: {
      dark: "#0F0F11",
      light: "#e0e2e4",
    },
    selected: {
      dark: "#1e1f21",
      light: "#fdfdfd",
    },
    icon: {
      dark: "#ffffff",
      light: "#202020",
    },
    hover: {
      dark: "#1e1f21",
      light: "#fdfdfd",
    },
    text: {},
  },

  // format is useColorModeValue('light', 'dark')
  // const borderColor = useColorModeValue('gray.200', 'gray.700');
  // const itemBgColor = useColorModeValue('white', '#131313');
  // const headingColor = useColorModeValue('gray.800', 'white');
  // const textColor = useColorModeValue('gray.600', 'gray.300');
  // const tagColor = useColorModeValue('black', 'white');
  // const tagTextColor = useColorModeValue('white', 'black');
  // const activeTabColor = useColorModeValue('black', 'white');
  // const activeTabBorderColor = useColorModeValue('black', 'white');

  marketplace: {
    body: {
      // dark: "#18191b"
      // light: "#F9F9FA"
      dark: "#0f0f11",
      light: "#f2f3f4",
    },
    border: {
      dark: "#3e4045",
      light: "#e0e2e4",
    },
    item: {
      dark: "#131313",
      light: "#fdfdfd",
    },
    heading: {
      dark: "white",
      light: "#202020",
    },
    text: {
      dark: "#c4c4c4",
      light: "#555555",
    },
    tag: {
      dark: "#2b2d2f",
      light: "#f2f3f4",
    },
    tagText: {
      dark: "#ffffff",
      light: "#000000",
    },
    activeTab: {
      dark: "#ffffff",
      light: "#000000",
    },
    activeTabBorder: {
      dark: "#ffffff",
      light: "#000000",
    },
    hoverBorder: {
      dark: "#3e4045",
      light: "#3e4045",
    },
    marketplaceCardbg: {
      dark: "#18191b",
      light: "#F9F9FA",
    },

  },

  sidepanel: {
    body: {
      dark: "#18191b",
      light: "#F9F9FA",
    },
    itemBgColor: {
      dark: "#131313",
      light: "",
    },
    border: {
      dark: "#d9d9d9",
      light: "#333333",
    },
    headingColor: {
      dark: "#ffffff",
      light: "#333333",
    },
    accordionBgColor: {},
    layerHeaderBg: {
      dark: "#141516",
      light: "#fdfdfd",
    },
    layerHeaderColor: {},
    emptyStateIconColor: {},
    selected: {
      dark: "",
      light: "",
    },
    icon: {
      dark: "",
      light: "",
    },
    hover: {
      dark: "",
      light: "",
    },
    text: {},
  },

  vizpanel: {
    body: {
      dark: "#141516",
      light: "#fdfdfd",
    },
    border: {
      dark: "#0F0F11",
      light: "#e0e2e4",
    },
    selected: {
      dark: "#141516",
      light: "#fdfdfd",
    },
    icon: {
      dark: "#b8b9b9",
      light: "#4c4c4c",
    },
    hover: {
      dark: "#1e1f21",
      light: "#fdfdfd",
    },
  },

  blockpanel: {
    icon: {
      dark: "#ffffff",
      light: "#000000",
    },
    itemBg: {
      dark: "#0f0f11",
      light: "#ffffff",
    },
    layerHeader: {
      dark: "#ffffff",
      light: "#000000",
    },
    layerHeadertext: {
      dark: "#ffffff", 
      light: "#000000",
    },
    listhoverBg: {
      dark: "#242526",
      light: "#ffffff",
    }
  },

  detailpanel : {

    body: {
      dark: "#141516",
      light: "#fdfdfd",
    },
    border: {
      dark: "#0F0F11",
      light: "#e0e2e4",
    },
    selected: {
      dark: "#141516",
      light: "#fdfdfd",
    },
    icon: {
      dark: "#b8b9b9",
      light: "#4c4c4c",
    },
    hover: {
      dark: "#1e1f21",
      light: "#fdfdfd",
    },

  },

  canvas: {
    body: {
      dark: "#0f0f11",
      light: "#f2f3f4",
    },
    // border: {
    //   dark: "#0F0F11",
    //   light: "#e0e2e4",
    // },
    // selected: {
    //   dark: "#1e1f21",
    //   light: "#fdfdfd",
    // },
    // icon: {
    //   dark: "#ffffff",
    //   light: "#202020",
    // },
    // hover: {
    //   dark: "#1e1f21",
    //   light: "#fdfdfd",
    // },
  },
  chat: {
    // Background colors
    bgPrimary: {
      light: "#FFFFFF", 
      dark: "#121212"
    },
    bgSecondary: {
      light: "#F9F9F9", 
      dark: "#1E1E1E"
    },
    bgTertiary: {
      light: "#F3F4F6", 
      dark: "#252525"
    },
    bgInput: {
      light: "white", 
      dark: "rgba(40, 40, 40, 0.5)"
    },
    bgHover: {
      light: "gray.100", 
      dark: "gray.700"
    },
    bgSelected: {
      light: "blue.50", 
      dark: "#333"
    },
    bgSource: {
      light: "gray.50", 
      dark: "gray.800"
    },
    bgButton: {
      light: "white", 
      dark: "#333"
    },
    bgButtonHover: {
      light: "gray.100", 
      dark: "#444"
    },
    
    // Text colors
    textPrimary: {
      light: "gray.800", 
      dark: "white"
    },
    textSecondary: {
      light: "gray.600", 
      dark: "gray.400"
    },
    textMuted: {
      light: "gray.500", 
      dark: "gray.500"
    },
    
    // Border colors
    borderColor: {
      light: "gray.200", 
      dark: "gray.700"
    },
    borderLight: {
      light: "gray.100", 
      dark: "#333"
    },
    
    // UI element colors
    iconColor: {
      light: "gray.500", 
      dark: "gray.400"
    },
    linkColor: {
      light: "blue.500", 
      dark: "blue.300"
    },
    checkmarkBgColor: {
      light: "green.500", 
      dark: "green.400"
    },
    spinnerBgColor: {
      light: "gray.200", 
      dark: "gray.700"
    },
    spinnerColor: {
      light: "gray.500", 
      dark: "gray.300"
    },
    
    // Chat message colors
    userMessageBg: {
      light: "gray.200", 
      dark: "gray.700"
    },
    assistantMessageBg: {
      light: "white", 
      dark: "transparent"
    }
  }
};


export default colors;