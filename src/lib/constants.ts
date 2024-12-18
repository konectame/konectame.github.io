export const DEFAULT_MARKETPLACE = {
  name: 'Marketplace',
  logo: '/placeholder-logo.png'
} as const;

export const DEFAULT_LANGUAGE = 'es' as const;

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;

export const STORAGE_KEYS = {
  LANGUAGE: 'i18nextLng'
} as const;

// Theme Constants
export const THEME = {
  fonts: {
    primary: 'Poppins'
  },
  colors: {
    primary: {
      dark: '#073D42',
      light: '#96D1DC',
      white: '#FFFFFF'
    },
    secondary: {
      yellow: '#F7EA78',
      green: '#BCFBC6',
      purple: '#958EDA',
      lightPurple: '#B9ABED',
      gray: '#515151'
    }
  }
} as const;
