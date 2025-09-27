/**
 * College ERP - Design System Theme Configuration
 * 
 * This file contains the complete theme specification for consistent styling
 * across all components in the College ERP application.
 * 
 * Usage:
 * import { theme, getThemeClasses } from '../styles/theme';
 * 
 * Apply classes directly:
 * className={theme.colors.primary.main}
 * 
 * Or use utility functions:
 * className={getThemeClasses('button', 'primary')}
 */

export const theme = {
  // 🎨 Primary Theme Colors
  colors: {
    // Main Brand Color - Indigo
    primary: {
      main: 'indigo-500',      // #6366f1 - Primary brand color, logo, selection indicators
      active: 'indigo-600',    // #4f46e5 - Active states, button backgrounds  
      hover: 'indigo-700',     // #4338ca - Button hover states, darker gradients
      light: 'indigo-400',     // #818cf8 - Accent lines, glows, lighter elements
      bg: 'indigo-500/20',     // Background with opacity
      border: 'indigo-500/30', // Border with opacity
    },

    // Success/Positive - Emerald
    success: {
      main: 'emerald-500',     // #10b981 - Icon backgrounds, success states
      light: 'emerald-400',    // #34d399 - Success text, positive metrics
      bg: 'emerald-500/10',    // Background with opacity
      border: 'emerald-500/30', // Border with opacity
    },

    // Neutral Professional - Slate  
    neutral: {
      500: 'slate-500',        // #64748b - User profile button hover
      600: 'slate-600',        // #475569 - User profile button, neutral actions
      700: 'slate-700',        // #334155 - Button hover states
      400: 'slate-400',        // Secondary text, descriptions
      300: 'slate-300',        // Primary text on dark backgrounds
    },

    // Accent Colors
    accent: {
      warning: 'amber-500',    // #f59e0b - Notifications, warnings
      warningHover: 'amber-400', // #fbbf24 - Notification hover state
    },

    // Status Colors
    status: {
      error: 'red-400',        // #f87171 - Error states, 0% attendance
      inactive: 'gray-300',    // #d1d5db - Neutral text, inactive states  
      secondary: 'gray-400',   // #9ca3af - Secondary text, descriptions
      tertiary: 'gray-500',    // #6b7280 - Tertiary text, placeholders
    },

    // Background Colors
    background: {
      primary: 'gray-900',     // #111827 - Main background
      secondary: 'gray-800',   // #1f2937 - Sidebar, cards
      tertiary: 'gray-700',    // #374151 - Form inputs, hover states
    }
  },

  // 🏗️ Component Patterns
  components: {
    // Sidebar Styling
    sidebar: {
      background: 'bg-gradient-to-b from-gray-900 to-gray-800',
      border: 'border-r border-slate-700/30',
      header: {
        background: 'bg-gray-800/50',
        border: 'border-b border-slate-700/30',
      },
      navigation: {
        item: {
          base: 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
          active: 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white shadow-lg border border-indigo-500/30',
          inactive: 'text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-600/10 hover:text-white',
        },
        icon: {
          active: 'text-indigo-400',
          inactive: 'text-slate-400 group-hover:text-indigo-400',
        }
      }
    },

    // TopNav Styling  
    topNav: {
      background: 'bg-gray-800/95 backdrop-blur-md',
      border: 'border-b border-slate-700/30',
      button: {
        base: 'p-2 rounded-xl transition-all duration-300',
        primary: 'hover:bg-indigo-500/20 text-indigo-400',
        neutral: 'hover:bg-slate-600/20 text-slate-400',
      }
    },

    // Card Components
    card: {
      base: 'bg-gray-800 border border-slate-700 rounded-xl shadow-sm',
      padding: 'p-6',
      title: 'text-white font-semibold',
      description: 'text-slate-400',
    },

    // Button Components
    button: {
      primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg',
      secondary: 'bg-slate-600/20 text-slate-300 hover:bg-slate-600/30 hover:text-white transition-all duration-300',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300',
      warning: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300',
    },

    // Form Elements
    form: {
      input: 'bg-gray-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
      label: 'text-slate-300 font-medium text-sm',
      error: 'text-red-400 text-xs mt-1',
    },

    // Notification/Alert Components
    notification: {
      background: 'bg-gray-800 border border-slate-700/50 rounded-xl shadow-lg',
      item: {
        base: 'w-full px-4 py-3 text-left hover:bg-gray-700/50 border-b border-slate-700/30 last:border-b-0',
        unread: 'bg-indigo-500/10',
      }
    },

    // Modal Components
    modal: {
      backdrop: 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm',
      container: 'bg-gray-800 border border-slate-700 rounded-2xl shadow-2xl',
      header: 'text-white font-bold',
      description: 'text-slate-300',
    },

    // Stats/Metrics Cards
    stats: {
      card: 'bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm',
      title: 'text-slate-400 text-sm',
      value: 'text-2xl font-bold text-white',
      icon: {
        primary: 'bg-indigo-500',
        success: 'bg-emerald-500', 
        warning: 'bg-amber-500',
        neutral: 'bg-slate-500',
      }
    }
  },

  // 🎭 Animation & Transitions
  animations: {
    transition: 'transition-all duration-300',
    transitionSlow: 'transition-all duration-700',
    hover: 'hover:scale-105 transition-transform duration-200',
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
  },

  // 📏 Spacing & Layout
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    sidebar: {
      width: 'w-72',
      widthCollapsed: 'w-20',
      marginExpanded: 'md:ml-72',
      marginCollapsed: 'md:ml-20',
    },
    padding: {
      page: 'px-4 py-6 md:p-6',
      card: 'p-6',
      button: 'px-6 py-3',
    },
    gap: {
      small: 'gap-2',
      medium: 'gap-4', 
      large: 'gap-6',
    }
  }
};

// 🛠️ Utility Functions
export const getThemeClasses = (component, variant = 'base', state = '') => {
  const componentTheme = theme.components[component];
  if (!componentTheme) return '';
  
  let classes = componentTheme[variant] || componentTheme.base || '';
  
  if (state && componentTheme[state]) {
    classes += ` ${componentTheme[state]}`;
  }
  
  return classes;
};

// Pre-built class combinations for common patterns
export const themeClasses = {
  // Page layouts
  pageBackground: 'min-h-screen bg-gradient-to-br from-gray-900 to-gray-800',
  pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Dashboard components
  dashboardLayout: 'flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-x-hidden',
  mainContent: 'flex-1 transition-all duration-300 md:duration-700 ml-0',
  
  // Common card patterns
  primaryCard: 'bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm',
  welcomeCard: 'bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white',
  
  // Text styles
  primaryHeading: 'text-2xl font-bold text-white',
  secondaryHeading: 'text-xl font-semibold text-white',
  bodyText: 'text-slate-300',
  mutedText: 'text-slate-400',
  
  // Interactive elements
  primaryButton: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg',
  secondaryButton: 'px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 hover:text-white rounded-lg transition-colors duration-200',
  
  // Loading states
  loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500',
  loadingText: 'text-slate-300',
};

// 🎨 Icon patterns with theme colors
export const iconClasses = {
  primary: 'text-indigo-400',
  success: 'text-emerald-400', 
  warning: 'text-amber-400',
  danger: 'text-red-400',
  neutral: 'text-slate-400',
  muted: 'text-slate-500',
};

export default theme;