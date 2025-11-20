// Velosta Brand Colors - New Palette
export const COLORS = {
  // Primary Brand Colors
  primary: '#FF792A',           // Main Orange
  primaryStart: '#FFE5D1',       // Gradient Start (Peach)
  primaryDark: '#E65100',
  primaryLight: '#FFA366',
  
  // Background Colors
  background: '#FFF9ED',         // Light Cream Background
  backgroundSecondary: '#FFF9ED', // Light Cream Background
  backgroundGray: '#FFF9ED',     // Light Cream for consistency
  surface: '#FFFFFF',            // White surface
  
  // Status Colors
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',
  
  // Card Backgrounds
  activeBookings: '#FFF9ED',     // Light Cream
  pendingReturns: '#FFF9ED',     // Light Cream
  newLeads: '#FFF9ED',           // Light Cream
  revenue: '#FFF9ED',            // Light Cream
  
  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  
  // Border Colors
  border: '#E5E5E5',              // Light gray for visibility on yellowish surfaces
  borderLight: '#F5F5F5',        // Very light gray for subtle borders
  
  // Lead Status
  leadNew: '#059669',
  leadInProgress: '#FF792A',
  leadClosed: '#9E9E9E',
  
  // Source Colors
  whatsapp: '#25D366',
  call: '#2196F3',
  
  // Bike Status
  available: '#059669',
  booked: '#FF792A',
};

// Gradient helper function
export const getGradient = (startColor = COLORS.primaryStart, endColor = COLORS.primary) => {
  return {
    colors: [startColor, endColor],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  };
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
