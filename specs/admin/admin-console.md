# Admin Console Documentation

## Overview
The admin console provides a secure interface for administrators to manage the marketplace, users, and content. Access is restricted to authorized administrators based on the email address, which must match the `VITE_ADMIN_EMAIL` environment variable.

## Configuration

### Constants and Defaults
All default values and configuration constants are centralized in `src/lib/constants.ts`:
- **Marketplace Defaults**
  - Default name: "Marketplace"
  - Default logo: "/placeholder-logo.png"
- **Language Settings**
  - Default language: Spanish (es)
  - Supported languages: English (en), Spanish (es)
  - Storage key for language preference: "i18nextLng"

## Components

### 1. AdminAuth Component
Located in `src/admin/auth/AdminAuth.tsx`

#### Features
- Handles both admin login and registration
- Validates admin email against `VITE_ADMIN_EMAIL`
- Creates admin user documents in Firestore under `/users` collection
- Supports i18n for multilingual interface

#### Authentication Flow
1. User enters email and password
2. System validates if email matches `VITE_ADMIN_EMAIL`
3. On successful authentication:
   - For registration: Creates new admin user document
   - For login: Verifies credentials
4. Redirects to admin console on success

### 2. AdminRoute Component
Located in `src/admin/auth/AdminRoute.tsx`

#### Features
- Protects admin routes from unauthorized access
- Verifies admin status using Firebase auth
- Redirects to login if not authenticated
- Supports i18n for loading states
- Renders protected content if authorized

### 3. AdminConsole Component
Located in `src/admin/console/AdminConsole.tsx`

#### Features
- Dashboard interface for admin operations
- Three main management sections:
  - Marketplace Management
  - User Management
  - Content Management
- Sign out functionality
- Fully internationalized UI

#### Management Sections
1. **Marketplace Management**
   - Configure marketplace settings
   - Manage marketplace properties

2. **User Management**
   - View and manage user accounts
   - Set user permissions

3. **Content Management**
   - Manage pages and content
   - Control content visibility

### TopNav
The top navigation bar provides user and language controls:
- **User Menu**: Displays the current user's profile picture (or fallback icon) and email
  - Profile: Navigate to user profile settings
  - Sign Out: Log out of the admin console
- **Language Toggle**: Switch between available languages
  - Uses Headless UI Menu component for accessibility
  - Shows current language with globe icon
  - Persists selection in localStorage
  - Supports all languages defined in SUPPORTED_LANGUAGES

### Marketplace Branding
The sidebar displays marketplace branding:
- Shows marketplace logo when available
- Falls back to placeholder image if:
  - No logo is set in marketplace configuration
  - Logo URL is invalid or fails to load
- Maintains aspect ratio using `object-contain`
- Consistent 2rem (32px) height

### Sidebar Navigation
The collapsible sidebar provides access to all administrative functions:
- **Manage Section**
  - Users
  - Listings
  - Transactions
  - Reviews
- **Configuration Section**
  - General Settings
  - Content Management
  - Design Customization
  - User Management
  - Listing Configuration
  - Transaction Settings

## Internationalization
The admin console supports multiple languages through i18next:
- Translation files in `src/locales/{lang}/admin.json`
- Default language: Spanish (es)
- Language selection persists in localStorage
- All UI elements use translation keys
- Fallback handling for missing translations

## State Management
- Marketplace data managed through `useMarketplace` hook
- Language preference stored in localStorage
- User authentication state through Firebase
- Navigation state (expanded/collapsed sections) managed locally

## Security
- Initial access requires email matching `VITE_ADMIN_EMAIL`
- Firebase Authentication for session management
- Protected routes ensure authenticated access

## File Structure
```
src/
├── admin/
│   └── console/
│       ├── AdminConsole.tsx    # Main admin interface
│       └── TopNav.tsx         # Top navigation component
├── lib/
│   ├── constants.ts          # Centralized constants
│   ├── hooks/               # Custom hooks
│   │   └── useMarketplace.ts
│   └── utils.ts            # Utility functions
├── locales/                # Translation files
│   ├── en/
│   │   └── admin.json
│   └── es/
│       └── admin.json
└── i18n.ts                # i18n configuration
```

## Environment Variables
Required environment variables in `.env`:
- `VITE_ADMIN_EMAIL`: Authorized admin email

## Future Enhancements
1. **Role-based Access Control**
   - Implement multiple admin roles
   - Granular permissions system

2. **Audit Logging**
   - Track admin actions
   - Maintain activity history

3. **Enhanced Security**
   - Two-factor authentication
   - IP-based access restrictions

## Components Structure

### 1. AdminAuth Component (`src/admin/auth/AdminAuth.tsx`)
Handles authentication for the admin interface.

#### Features:
- Handles both admin login and registration
- Validates admin email against `VITE_ADMIN_EMAIL`
- Creates admin user documents in Firestore under `/users` collection
- Supports i18n for multilingual interface

#### Authentication Flow:
1. User enters email and password
2. System validates if email matches `VITE_ADMIN_EMAIL`
3. On successful authentication:
   - For registration: Creates new admin user document
   - For login: Verifies credentials
4. Redirects to admin console on success

### 2. AdminRoute Component (`src/admin/auth/AdminRoute.tsx`)
Protects admin routes from unauthorized access.

#### Features:
- Verifies admin status using Firebase auth
- Redirects to login if not authenticated
- Supports i18n for loading states
- Renders protected content if authorized

### 3. TopNav Component (`src/components/TopNav.tsx`)
A reusable navigation component that appears at the top of the admin interface.

#### Features:
- User profile display with image/avatar
- Dropdown menu with profile and logout options
- Responsive design (collapses on smaller screens)
- Click-outside behavior for dropdown

#### Usage:
```tsx
import { TopNav } from '@/components/TopNav';

// Inside your component
<TopNav />
```

### 4. AdminConsole Component (`src/admin/console/AdminConsole.tsx`)
The main admin interface component that provides navigation and layout structure.

#### Features:
- Collapsible sidebar navigation
- Two-level navigation hierarchy
- Icon-only mode when collapsed
- Smooth transitions and animations

#### Navigation Structure:
1. **Manage Section** (LayoutDashboard icon)
   - Users
   - Listings
   - Transactions
   - Reviews

2. **Configuration Section** (Wrench icon)
   - General
     - Email Configuration
     - Localization
     - Access Control
   - Content
     - Nav Bar
     - Footer
     - Pages
     - Texts
     - Messaging Templates
   - Design
     - Branding
     - Layout
   - Users
     - User Types
     - User Fields
   - Listings
     - Listing Types
     - Listing Categories
     - Listing Fields
     - Listing Search
   - Transactions
     - Commissions
     - Minimum Size

## Internationalization

The admin console uses i18next for translations. Translation files are located in:
- `src/locales/en/admin.json` (English)
- `src/locales/es/admin.json` (Spanish)

### Translation Structure:
```json
{
  "auth": {
    "login": "Admin Login",
    "register": "Admin Registration"
  },
  "console": {
    "signOut": "Sign Out",
    "profile": "Profile",
    "user": "User",
    "manage": {
      "title": "Manage",
      // ... management translations
    },
    "configuration": {
      "title": "Configuration",
      // ... configuration translations
    }
  }
}
```

## UI/UX Features

### Sidebar Navigation
- Expandable/collapsible with hamburger menu
- Shows icons only when collapsed
- Tooltips for icons in collapsed state
- Smooth transitions between states
- Maintains hierarchy visibility

### Top Navigation
- User profile section
- Dropdown menu
- Responsive design
- Clean, modern styling

### Visual Hierarchy
- Clear section differentiation
- Consistent icon usage
- Proper spacing and indentation
- Visual feedback on hover/active states

## Routes
- `/admin/auth`: Authentication page (public)
- `/admin/console`: Admin dashboard (protected)

## Security

### 1. Route Protection
- All admin routes are protected by `AdminRoute`
- Requires valid Firebase authentication
- Email must match `VITE_ADMIN_EMAIL`

### 2. Data Security
- Admin users stored in `/users` collection
- Regular users stored in `marketplaces/{marketplaceId}/users/{userId}`
- Firestore security rules should be configured accordingly

## Environment Variables
Required environment variables in `.env`:
```
VITE_ADMIN_EMAIL=alexander.ramirez@konectame.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Dependencies

- React Router for navigation
- Firebase Auth for authentication
- i18next for translations
- Lucide Icons for iconography
- Tailwind CSS for styling

## Future Considerations

1. **Role-based Access Control**
   - Implement multiple admin roles
   - Granular permissions system

2. **Audit Logging**
   - Track admin actions
   - Maintain activity history

3. **Enhanced Security**
   - Two-factor authentication
   - IP-based access restrictions

4. **Performance Optimization**
   - Implement code splitting for large admin sections
   - Lazy loading for routes
   - Caching strategies for frequently accessed data

5. **Feature Additions**
   - Search functionality in the admin panel
   - Bulk actions for list views
   - Advanced filtering options
   - Export/import capabilities

6. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Screen reader support
   - Focus management

## Best Practices Implemented

1. **Component Architecture**
   - Reusable components (TopNav)
   - Clear separation of concerns
   - Proper prop typing with TypeScript

2. **State Management**
   - Local state for UI elements
   - Context for user authentication
   - Proper state initialization

3. **Code Organization**
   - Consistent file structure
   - Clear naming conventions
   - Modular component design

4. **User Experience**
   - Intuitive navigation
   - Consistent behavior
   - Clear visual feedback
   - Smooth transitions

## Getting Started

To work with the admin console:

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Configure environment variables as shown above

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the admin console at `/admin` route

## Contributing

When contributing to the admin console:

1. Follow the established component patterns
2. Maintain TypeScript typing
3. Add appropriate translations
4. Test responsive behavior
5. Ensure accessibility standards
6. Document new features or changes
