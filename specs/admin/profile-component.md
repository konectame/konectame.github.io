# Profile Component Documentation

## Overview
The Profile component is a key part of the Admin Console, allowing users to manage their personal information, profile picture, and security settings. It's integrated with Firebase Authentication and Firestore for data persistence.

## Components

### 1. Profile Component (`src/admin/profile/Profile.tsx`)
The main component that handles user profile management.

#### Features
- Basic Information Management
  - Display Name updates
  - Real-time validation
  - Synchronized with Firebase Auth and Firestore

- Profile Picture Management
  - Image upload functionality
  - Automatic resizing and optimization
  - Storage in Firebase Storage
  - Real-time preview updates

- Password Management
  - Current password verification
  - New password validation
  - Secure password updates through Firebase Auth

#### State Management
- Uses React state for form management
- Implements ProfileContext for sharing profile data across components
- Integrates with Firebase for persistent storage

### 2. Notification Component (`src/components/ui/Notification.tsx`)
A reusable notification system for providing feedback to users.

#### Features
- Types: Success and Error notifications
- Auto-dismissal after 3 seconds
- Manual dismissal option
- Smooth animations
- Consistent styling with the admin theme

#### Usage
```typescript
import { showNotification } from '@/components/ui/Notification';

// Show success notification
showNotification('Profile updated successfully', 'success');

// Show error notification
showNotification('Error updating profile', 'error');
```

### 3. Profile Context (`src/contexts/profile.tsx`)
Manages global profile state across components.

#### Features
- Shares profile image URL
- Updates TopNav automatically
- Provides consistent state across the application

## Data Flow

1. User Updates Profile
   ```mermaid
   graph TD
   A[User Input] --> B[Profile Component]
   B --> C{Update Type}
   C -->|Basic Info| D[Firebase Auth]
   C -->|Basic Info| E[Firestore]
   C -->|Profile Picture| F[Firebase Storage]
   C -->|Profile Picture| G[Profile Context]
   G --> H[TopNav Update]
   ```

2. Notification Flow
   ```mermaid
   graph TD
   A[User Action] --> B[API Call]
   B -->|Success| C[Success Notification]
   B -->|Error| D[Error Notification]
   C --> E[Auto Dismiss]
   D --> E[Auto Dismiss]
   ```

## Firebase Integration

### Authentication
- Uses Firebase Authentication for user management
- Handles password updates securely
- Maintains session state

### Firestore
```typescript
// User Document Structure
interface UserDocument {
  name: string;
  updatedAt: string;
  // Additional fields as needed
}
```

### Storage
- Profile images stored in: `${VITE_ROOT_FOLDER}/${VITE_MARKETPLACE_ID}/users/${userId}/profile`
- Implements secure access rules

## Styling

### Layout
- Centered within AdminConsole
- Full-width background
- Responsive design for all screen sizes

### Components
- Uses Tailwind CSS for styling
- Consistent with admin theme
- Accessible color schemes
- Responsive input fields and buttons

## Error Handling

### Validation
- Client-side validation for all inputs
- Server-side validation through Firebase
- Descriptive error messages

### Recovery
- Automatic retry for failed uploads
- Fallback UI states
- Graceful error handling

## Future Improvements

1. Additional Features
   - Email verification
   - Two-factor authentication
   - Social media links
   - Profile visibility settings

2. Performance
   - Image optimization
   - Lazy loading
   - Caching strategies

3. Security
   - Enhanced password requirements
   - Session management
   - Activity logging

## Testing

### Unit Tests
- Component rendering
- Form validation
- Context updates

### Integration Tests
- Firebase interactions
- State management
- Navigation flow

### E2E Tests
- Profile update workflow
- Image upload process
- Password change procedure
