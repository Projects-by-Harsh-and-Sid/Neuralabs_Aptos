// src/utils/uiColors.js
import { useColorModeValue } from '@chakra-ui/react';

export const useUiColors = () => {
  // Background colors
  const bgPrimary = useColorModeValue("#FFFFFF", "#121212");
  const bgSecondary = useColorModeValue("#F9F9F9", "#1E1E1E");
  const bgTertiary = useColorModeValue("#F3F4F6", "#252525");
  const bgInput = useColorModeValue("white", "rgba(40, 40, 40, 0.5)");
  const bgHover = useColorModeValue("gray.100", "gray.700");
  const bgSelected = useColorModeValue("blue.50", "#333");
  const bgSource = useColorModeValue("gray.50", "gray.800");
  const bgButton = useColorModeValue("white", "#333");
  const bgButtonHover = useColorModeValue("gray.100", "#444");
  
  // Text colors
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const textMuted = useColorModeValue("gray.500", "gray.500");
  
  // Border colors
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const borderLight = useColorModeValue("gray.100", "#333");
  
  // UI element colors
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const checkmarkBgColor = useColorModeValue("green.500", "green.400");
  const spinnerBgColor = useColorModeValue("gray.200", "gray.700");
  const spinnerColor = useColorModeValue("gray.500", "gray.300");
  
  // Chat message colors
  const userMessageBg = useColorModeValue("gray.200", "gray.700");
  const assistantMessageBg = useColorModeValue("white", "transparent");
  
  return {
    // Backgrounds
    bgPrimary,
    bgSecondary,
    bgTertiary,
    bgInput,
    bgHover,
    bgSelected,
    bgSource,
    bgButton,
    bgButtonHover,
    
    // Text
    textPrimary,
    textSecondary,
    textMuted,
    
    // Borders
    borderColor,
    borderLight,
    
    // UI Elements
    iconColor,
    linkColor,
    checkmarkBgColor,
    spinnerBgColor,
    spinnerColor,
    
    // Chat Messages
    userMessageBg,
    assistantMessageBg
  };
};

export default useUiColors;