# Users

## Overview
User management system for the Konectame marketplace platform.

## User Types

### Individual User
- Personal account for marketplace customers
- Can browse listings
- Make purchases/bookings
- Leave reviews
- Manage personal profile

### Individual Provider
- Personal service/product provider
- Personal identification details
- Professional qualifications
- Service/product listings
- Transaction management

### Company Provider
- Business entity provider
- Company registration details
- Multiple user accounts
- Business verification
- Enhanced analytics

### Admin
- Platform management
- User management
- Content moderation
- System configuration
- Analytics access

## System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last login (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- Account status (active, suspended, deleted)
- Email verification status
- Role (admin, provider, user)

## Field Management
See [Field Management](../internal/fields.md) for detailed field configuration.

### Default System Fields
1. Email
   - Type: Email input
   - Validation: RFC 5322 standard
   - Required: Yes
   - When: Signup
   - Unique: Yes

2. Name
   - Type: Text
   - Validation: Letters and spaces
   - Min length: 2
   - Max length: 50
   - Required: Yes
   - When: Signup

3. Last Name
   - Type: Text
   - Validation: Letters and spaces
   - Min length: 2
   - Max length: 50
   - Required: Yes
   - When: Signup

4. Password
   - Type: Password
   - Validation: Complex password rules
   - Required: Yes
   - When: Signup
   - Storage: Hashed

5. Phone Number
   - Type: Text
   - Validation: E.164 format
   - Required: Yes
   - When: Signup

6. Country of Residence
   - Type: Selection
   - Validation: ISO 3166-1
   - Required: Yes
   - When: Signup

## Provider-Specific Fields

### Individual Provider
- Personal ID/Document number
- Date of birth (ISO 8601)
- Professional qualifications
- Personal bio
- Portfolio/Previous work
- Service areas
- Operating hours

### Company Provider
- Company name
- Registration number
- Tax ID
- Legal representative
- Company size
- Year established
- Company description
- Business address
- Service locations

## Common Provider Fields
- Business contact info
- Bank account details
- Insurance information
- Rating average
- Review count
- Verification status
- Social media profiles

## Firebase Structure
```typescript
// Collection: marketplaces/{marketplaceId}/users/{userId}
interface User {
  id: string;
  type: 'individual' | 'company';
  role: 'admin' | 'provider' | 'user';
  email: string;
  profile: {
    // Common fields
    name: string;
    lastName: string;
    phone: string;
    country: string;
    
    // Provider-specific fields
    provider?: {
      type: 'individual' | 'company';
      // Fields based on provider type
      [key: string]: any;
    };
    
    // Custom fields
    customFields?: {
      [key: string]: any;
    };
  };
  status: 'active' | 'suspended' | 'deleted';
  emailVerified: boolean;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
  lastLogin: string;  // ISO 8601
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/users/{userId} {
  allow read: if isAuthenticated() && (
    resource.data.id == request.auth.uid ||
    hasRole('admin')
  );
  allow write: if isAuthenticated() && (
    resource.data.id == request.auth.uid ||
    hasRole('admin')
  ) && isValidUser();
}

function isValidUser() {
  let user = request.resource.data;
  return user.email is string
    && user.email.matches('^[^@]+@[^@]+\\.[^@]+$')
    && user.type in ['individual', 'company']
    && user.role in ['admin', 'provider', 'user']
    && user.status in ['active', 'suspended', 'deleted'];
}
```
