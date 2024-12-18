# Access Control Configuration

## Overview
Role-based access control (RBAC) system for managing permissions and access rights in the Konectame marketplace platform.

## Role Management

### Role Definition
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: string[];  // Inherited role IDs
  metadata?: {
    [key: string]: any;
  };
  status: 'active' | 'inactive';
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

### Permission Structure
```typescript
interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: {
    [key: string]: any;
  };
}
```

## Default Roles

### Administrator
- Full system access
- Configuration management
- User management
- Content management
- Analytics access

### Provider
- Listing management
- Transaction handling
- Content creation
- Limited analytics

### Customer
- Profile management
- Transaction participation
- Review creation
- Basic access

### Guest
- Public content access
- Listing viewing
- Search functionality
- Registration

## Resource Types

### System Resources
1. Configuration
   - System settings
   - Email templates
   - Localization
   - Access control

2. User Management
   - User accounts
   - Roles
   - Permissions
   - Profiles

3. Content Management
   - Pages
   - Templates
   - Media
   - Navigation

### Business Resources
1. Listings
   - Products
   - Services
   - Categories
   - Media

2. Transactions
   - Orders
   - Payments
   - Refunds
   - Disputes

3. Communication
   - Messages
   - Notifications
   - Reviews
   - Reports

## Firebase Structure

### Configuration
```typescript
// Collection: marketplaces/{marketplaceId}/access_control
interface AccessControlConfig {
  roles: Role[];
  defaultRole: string;
  superAdmins: string[];  // User IDs
  settings: {
    maxRoleAssignments: number;
    requireMFA: boolean;
    sessionTimeout: number;
  };
  updatedAt: string;  // ISO 8601
}
```

### Role Assignments
```typescript
// Collection: marketplaces/{marketplaceId}/role_assignments/{assignmentId}
interface RoleAssignment {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;  // ISO 8601
  expiresAt?: string;  // ISO 8601
  metadata?: {
    [key: string]: any;
  };
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/access_control/{document=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && (
    hasRole('admin') ||
    isSuperAdmin()
  );
}

match /marketplaces/{marketplaceId}/role_assignments/{assignmentId} {
  allow read: if isAuthenticated() && (
    resource.data.userId == request.auth.uid ||
    hasRole('admin')
  );
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Access Control Service

### Permission Checking
```typescript
interface CheckOptions {
  userId: string;
  resource: string;
  action: string;
  context?: any;
}

async function checkPermission(
  options: CheckOptions
): Promise<boolean> {
  // Get user roles
  // Check permissions
  // Evaluate conditions
  // Return result
}
```

### Role Management
```typescript
class RoleManager {
  async assignRole(
    userId: string,
    roleId: string,
    options?: {
      expiresAt?: string;
      metadata?: any;
    }
  ): Promise<void> {
    // Validate role
    // Create assignment
    // Update user
  }

  async removeRole(
    userId: string,
    roleId: string
  ): Promise<void> {
    // Remove assignment
    // Update user
  }

  async getUserRoles(
    userId: string
  ): Promise<Role[]> {
    // Get assignments
    // Resolve roles
    // Include inherited
  }
}
```

## Audit Logging

### Audit Entry
```typescript
interface AuditEntry {
  id: string;
  timestamp: string;  // ISO 8601
  userId: string;
  action: string;
  resource: string;
  details: {
    before?: any;
    after?: any;
    metadata?: any;
  };
  status: 'success' | 'failure';
  error?: string;
}
```

### Audit Service
```typescript
class AuditService {
  async logAction(
    entry: Omit<AuditEntry, 'id' | 'timestamp'>
  ): Promise<void> {
    // Validate entry
    // Store in Firebase
    // Handle alerts
  }

  async queryAudit(
    filters: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<AuditEntry[]> {
    // Query audit logs
    // Apply filters
    // Return results
  }
}
```

## Session Management

### Session Structure
```typescript
interface Session {
  id: string;
  userId: string;
  roles: string[];
  permissions: Permission[];
  created: string;  // ISO 8601
  expires: string;  // ISO 8601
  metadata: {
    ip: string;
    userAgent: string;
    device?: string;
  };
}
```

### Session Operations
```typescript
class SessionManager {
  async createSession(
    userId: string,
    metadata: any
  ): Promise<Session> {
    // Create session
    // Set expiration
    // Store in Firebase
  }

  async validateSession(
    sessionId: string
  ): Promise<boolean> {
    // Check existence
    // Verify expiration
    // Update last access
  }

  async revokeSession(
    sessionId: string
  ): Promise<void> {
    // Remove session
    // Log action
  }
}
```

## MFA Configuration

### MFA Settings
```typescript
interface MFAConfig {
  enabled: boolean;
  requiredFor: string[];  // Role IDs
  methods: {
    totp: boolean;
    email: boolean;
    sms: boolean;
  };
  recovery: {
    codesCount: number;
    codeLength: number;
  };
}
```

### MFA Operations
```typescript
class MFAManager {
  async setupMFA(
    userId: string,
    method: string
  ): Promise<SetupResult> {
    // Generate secrets
    // Store configuration
    // Return setup data
  }

  async verifyMFA(
    userId: string,
    code: string
  ): Promise<boolean> {
    // Validate code
    // Update verification
    // Log result
  }
}
```
