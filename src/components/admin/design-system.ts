// Admin Design System Constants

export const adminTheme = {
  // Border radius - consistent throughout
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl', 
    lg: 'rounded-2xl',
    full: 'rounded-full'
  },
  
  // Spacing - consistent padding/margins
  spacing: {
    card: 'p-6',
    section: 'p-4 sm:p-6',
    gap: 'gap-6',
    gapSm: 'gap-4'
  },
  
  // Glass effects
  glass: {
    // Light glass for cards
    card: 'bg-white/8 dark:bg-white/5 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20',
    
    // Medium glass for panels
    panel: 'bg-white/10 dark:bg-white/8 backdrop-blur-2xl border border-gray-200/30 dark:border-gray-700/30',
    
    // Heavy glass for navigation
    nav: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/20 dark:border-gray-700/20',
    
    // Hover effects
    hover: 'hover:bg-white/12 dark:hover:bg-white/8 transition-colors duration-200'
  },
  
  // Text colors - better contrast
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    tertiary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500'
  },
  
  // Icon colors - subtle accent colors
  icon: {
    default: 'text-gray-600 dark:text-gray-400',
    active: 'text-gray-900 dark:text-white',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400'
  },
  
  // Consistent shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md', 
    lg: 'shadow-lg shadow-gray-200/20 dark:shadow-black/20'
  }
};