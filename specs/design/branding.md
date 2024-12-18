# Branding Configuration

## Overview
Branding and theme management system for the Konectame marketplace platform.

## Brand Identity

### Brand Assets
```typescript
interface BrandAssets {
  logos: {
    primary: {
      light: string;  // URL
      dark: string;   // URL
    };
    secondary?: {
      light: string;
      dark: string;
    };
    favicon: string;
    mobile: string;
  };
  images: {
    hero?: string;
    background?: string;
    pattern?: string;
    [key: string]: string;
  };
  icons: {
    [name: string]: string;
  };
}
```

### Color Scheme
```typescript
interface ColorScheme {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  accent: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  neutral: {
    white: string;
    black: string;
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
```

### Typography
```typescript
interface Typography {
  fontFamilies: {
    primary: string;
    secondary?: string;
    monospace?: string;
  };
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}
```

## Theme Configuration

### Theme Structure
```typescript
interface Theme {
  id: string;
  name: string;
  colors: ColorScheme;
  typography: Typography;
  spacing: {
    unit: number;
    scale: number[];
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  transitions: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    timing: {
      ease: string;
      linear: string;
      easeIn: string;
      easeOut: string;
    };
  };
}
```

## Firebase Structure

### Brand Configuration
```typescript
// Collection: marketplaces/{marketplaceId}/branding
interface BrandingConfig {
  assets: BrandAssets;
  themes: {
    [themeId: string]: Theme;
  };
  activeTheme: string;
  settings: {
    darkMode: {
      enabled: boolean;
      auto: boolean;
      schedule?: {
        start: string;  // HH:mm
        end: string;    // HH:mm
      };
    };
    responsive: {
      enabled: boolean;
      adaptiveImages: boolean;
      mobileFirst: boolean;
    };
  };
  updatedAt: string;  // ISO 8601
}
```

### Theme Overrides
```typescript
// Collection: marketplaces/{marketplaceId}/theme_overrides/{overrideId}
interface ThemeOverride {
  selector: string;
  properties: {
    [property: string]: string;
  };
  media?: string;
  priority: number;
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/branding/{document=**} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/theme_overrides/{overrideId} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Theme Service

### Theme Management
```typescript
class ThemeManager {
  async setActiveTheme(
    themeId: string
  ): Promise<void> {
    // Validate theme
    // Update active theme
    // Refresh styles
  }

  async createTheme(
    theme: Omit<Theme, 'id'>
  ): Promise<string> {
    // Validate theme
    // Create theme
    // Return ID
  }

  async updateTheme(
    themeId: string,
    updates: Partial<Theme>
  ): Promise<void> {
    // Validate updates
    // Update theme
    // Refresh styles
  }

  async generateCSS(
    theme: Theme
  ): Promise<string> {
    // Generate CSS variables
    // Apply overrides
    // Return CSS
  }
}
```

### Dark Mode
```typescript
class DarkModeManager {
  async toggle(
    enabled: boolean
  ): Promise<void> {
    // Update setting
    // Switch theme
    // Save preference
  }

  async autoDetect(): Promise<void> {
    // Check system preference
    // Set theme accordingly
  }

  async scheduleSwitch(
    schedule: {
      start: string;
      end: string;
    }
  ): Promise<void> {
    // Validate schedule
    // Set up timer
    // Update theme
  }
}
```

## Asset Management

### Asset Service
```typescript
class AssetManager {
  async uploadAsset(
    type: 'logo' | 'image' | 'icon',
    file: File,
    options?: {
      variant?: string;
      optimize?: boolean;
    }
  ): Promise<string> {
    // Validate file
    // Process image
    // Upload to storage
    // Return URL
  }

  async optimizeImage(
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    }
  ): Promise<string> {
    // Process image
    // Generate variants
    // Return URL
  }

  async generateFavicon(
    logo: string
  ): Promise<string> {
    // Process logo
    // Create favicon
    // Return URL
  }
}
```

## Style Generation

### CSS Variables
```typescript
interface CSSVariables {
  colors: {[key: string]: string};
  typography: {[key: string]: string};
  spacing: {[key: string]: string};
  shadows: {[key: string]: string};
  borderRadius: {[key: string]: string};
}

function generateVariables(
  theme: Theme
): CSSVariables {
  // Generate CSS variables
  // Format values
  // Return object
}
```

### Utility Classes
```typescript
interface UtilityClasses {
  [className: string]: {
    [property: string]: string;
  };
}

function generateUtilities(
  theme: Theme
): UtilityClasses {
  // Generate utility classes
  // Apply theme values
  // Return object
}
```

## Responsive Design

### Breakpoint Management
```typescript
class BreakpointManager {
  async getCurrentBreakpoint(): Promise<string> {
    // Get window width
    // Match breakpoint
    // Return name
  }

  async addBreakpoint(
    name: string,
    value: number
  ): Promise<void> {
    // Validate value
    // Add breakpoint
    // Update styles
  }
}
```

### Media Queries
```typescript
function generateMediaQueries(
  breakpoints: Theme['breakpoints']
): {[key: string]: string} {
  // Generate queries
  // Format conditions
  // Return object
}
```
