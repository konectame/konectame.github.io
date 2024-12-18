# Navigation Management

## Overview
Navigation management system for handling top bar, footer, and other navigation elements in the Konectame marketplace platform.

## Navigation Structure

### Menu Definition
```typescript
interface Menu {
  id: string;
  name: string;
  type: 'topbar' | 'footer' | 'sidebar';
  items: MenuItem[];
  status: 'active' | 'inactive';
  visibility: {
    roles?: string[];
    authenticated?: boolean;
  };
  metadata?: {
    [key: string]: any;
  };
  updatedAt: string;  // ISO 8601
}
```

### Menu Item
```typescript
interface MenuItem {
  id: string;
  type: 'link' | 'dropdown' | 'button' | 'separator';
  label: string;
  icon?: string;
  url?: string;
  items?: MenuItem[];  // For dropdown
  action?: string;  // For button
  order: number;
  visibility: {
    roles?: string[];
    authenticated?: boolean;
  };
  style?: {
    [key: string]: string;
  };
}
```

## Navigation Types

### Top Bar
- Logo
- Main menu
- Search bar
- User menu
- Language selector
- Notifications

### Footer
- Company info
- Quick links
- Legal links
- Social media
- Newsletter
- Contact info

### Mobile Navigation
- Hamburger menu
- Bottom tabs
- Quick actions
- Back button
- Search access

## Firebase Structure

### Navigation Configuration
```typescript
// Collection: marketplaces/{marketplaceId}/navigation
interface NavigationConfig {
  menus: {
    [menuId: string]: Menu;
  };
  settings: {
    sticky: boolean;
    transparent: boolean;
    collapseBreakpoint: number;
  };
  mobile: {
    enabled: boolean;
    type: 'drawer' | 'bottom' | 'fullscreen';
    items: MenuItem[];
  };
  updatedAt: string;  // ISO 8601
}
```

### Menu Items
```typescript
// Collection: marketplaces/{marketplaceId}/menu_items/{itemId}
interface MenuItemDoc extends MenuItem {
  menuId: string;
  analytics: {
    clicks: number;
    lastClicked: string;  // ISO 8601
  };
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/navigation/{document=**} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/menu_items/{itemId} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Navigation Service

### Menu Management
```typescript
class MenuManager {
  async createMenu(
    menu: Omit<Menu, 'id'>
  ): Promise<string> {
    // Validate menu
    // Create menu
    // Return ID
  }

  async updateMenu(
    menuId: string,
    updates: Partial<Menu>
  ): Promise<void> {
    // Validate updates
    // Update menu
    // Refresh cache
  }

  async getMenu(
    menuId: string,
    context: {
      roles?: string[];
      authenticated?: boolean;
    }
  ): Promise<Menu> {
    // Get menu
    // Filter items
    // Apply context
  }
}
```

### Item Management
```typescript
class MenuItemManager {
  async addItem(
    menuId: string,
    item: Omit<MenuItem, 'id'>
  ): Promise<string> {
    // Validate item
    // Add to menu
    // Return ID
  }

  async updateItem(
    itemId: string,
    updates: Partial<MenuItem>
  ): Promise<void> {
    // Validate updates
    // Update item
    // Refresh menu
  }

  async reorderItems(
    menuId: string,
    itemOrder: string[]
  ): Promise<void> {
    // Validate order
    // Update items
    // Refresh menu
  }
}
```

## Cache Management

### Cache Structure
```typescript
interface NavigationCache {
  menus: {
    [menuId: string]: Menu;
  };
  timestamp: string;  // ISO 8601
  version: number;
}
```

### Cache Operations
```typescript
class NavigationCache {
  async get(): Promise<NavigationCache | null> {
    // Get cached navigation
  }

  async set(cache: NavigationCache): Promise<void> {
    // Update cache
  }

  async invalidate(): Promise<void> {
    // Clear cache
  }
}
```

## Analytics Integration

### Click Tracking
```typescript
interface MenuItemClick {
  itemId: string;
  menuId: string;
  userId?: string;
  timestamp: string;  // ISO 8601
  metadata?: {
    device?: string;
    location?: string;
  };
}
```

### Analytics Collection
```typescript
class NavigationAnalytics {
  async trackClick(
    itemId: string,
    userId?: string,
    metadata?: any
  ): Promise<void> {
    // Record click
    // Update analytics
    // Store event
  }

  async getItemAnalytics(
    itemId: string,
    dateRange?: {
      start: string;
      end: string;
    }
  ): Promise<{
    clicks: number;
    uniqueUsers: number;
    devices: {[key: string]: number};
  }> {
    // Get analytics
    // Calculate metrics
    // Return data
  }
}
```

## Mobile Optimization

### Responsive Design
```typescript
interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  behavior: {
    mobile: 'drawer' | 'bottom' | 'fullscreen';
    tablet: 'drawer' | 'collapsed';
    desktop: 'expanded';
  };
  animations: {
    type: string;
    duration: number;
  };
}
```

### Mobile Navigation
```typescript
class MobileNavigation {
  async toggle(): Promise<void> {
    // Toggle menu
    // Animate transition
    // Update state
  }

  async adaptToScreen(
    width: number
  ): Promise<void> {
    // Check breakpoints
    // Update layout
    // Refresh display
  }
}
```
