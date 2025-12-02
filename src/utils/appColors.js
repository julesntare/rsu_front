/**
 * Application Color Palette
 * Professional color system for consistent theming across the application
 */

const appColors = {
  // Primary Colors - Main brand colors
  primary: {
    main: "#2563eb", // Blue 600
    light: "#3b82f6", // Blue 500
    dark: "#1d4ed8", // Blue 700
    darker: "#1e40af", // Blue 800
    contrast: "#ffffff", // White text on primary
  },

  // Secondary Colors - Supporting brand colors
  secondary: {
    main: "#64748b", // Slate 500
    light: "#94a3b8", // Slate 400
    dark: "#475569", // Slate 600
    darker: "#334155", // Slate 700
    contrast: "#ffffff",
  },

  // Success Colors - Positive actions and states
  success: {
    main: "#10b981", // Emerald 500
    light: "#34d399", // Emerald 400
    dark: "#059669", // Emerald 600
    darker: "#047857", // Emerald 700
    bg: "#d1fae5", // Emerald 100
    contrast: "#ffffff",
  },

  // Error Colors - Errors, warnings, and destructive actions
  error: {
    main: "#ef4444", // Red 500
    light: "#f87171", // Red 400
    dark: "#dc2626", // Red 600
    darker: "#b91c1c", // Red 700
    bg: "#fee2e2", // Red 100
    contrast: "#ffffff",
  },

  // Warning Colors - Caution states
  warning: {
    main: "#f59e0b", // Amber 500
    light: "#fbbf24", // Amber 400
    dark: "#d97706", // Amber 600
    darker: "#b45309", // Amber 700
    bg: "#fef3c7", // Amber 100
    contrast: "#000000",
  },

  // Info Colors - Informational messages
  info: {
    main: "#3b82f6", // Blue 500
    light: "#60a5fa", // Blue 400
    dark: "#2563eb", // Blue 600
    darker: "#1d4ed8", // Blue 700
    bg: "#dbeafe", // Blue 100
    contrast: "#ffffff",
  },

  // Neutral/Gray Scale - Text, borders, backgrounds
  neutral: {
    50: "#f8fafc", // Slate 50
    100: "#f1f5f9", // Slate 100
    200: "#e2e8f0", // Slate 200
    300: "#cbd5e1", // Slate 300
    400: "#94a3b8", // Slate 400
    500: "#64748b", // Slate 500
    600: "#475569", // Slate 600
    700: "#334155", // Slate 700
    800: "#1e293b", // Slate 800
    900: "#0f172a", // Slate 900
  },

  // Text Colors - Consistent text hierarchy
  text: {
    primary: "#0f172a", // Slate 900
    secondary: "#475569", // Slate 600
    tertiary: "#64748b", // Slate 500
    disabled: "#94a3b8", // Slate 400
    inverse: "#ffffff", // White
  },

  // Background Colors
  background: {
    default: "#ffffff",
    paper: "#f8fafc", // Slate 50
    dark: "#0f172a", // Slate 900
    overlay: "rgba(15, 23, 42, 0.5)",
  },

  // Border Colors
  border: {
    light: "#e2e8f0", // Slate 200
    main: "#cbd5e1", // Slate 300
    dark: "#94a3b8", // Slate 400
  },

  // Common Colors
  common: {
    black: "#000000",
    white: "#ffffff",
    transparent: "transparent",
  },

  // Action Colors - Interactive elements
  action: {
    active: "#2563eb",
    hover: "#eff6ff", // Blue 50
    selected: "#dbeafe", // Blue 100
    disabled: "#e2e8f0", // Slate 200
    disabledText: "#94a3b8", // Slate 400
    focus: "#3b82f6",
  },

  // Status Colors - Application-specific states
  status: {
    available: "#10b981", // Emerald 500
    occupied: "#ef4444", // Red 500
    pending: "#f59e0b", // Amber 500
    inactive: "#64748b", // Slate 500
  },
};

/**
 * Helper function to get color with opacity
 * @param {string} color - Hex color code
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
export const withOpacity = (color, opacity) => {
  // Remove # if present
  const hex = color.replace("#", "");

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Helper function to get contrasting text color
 * @param {string} backgroundColor - Hex color code
 * @returns {string} Either black or white hex color
 */
export const getContrastText = (backgroundColor) => {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? appColors.common.black : appColors.common.white;
};

export default appColors;
