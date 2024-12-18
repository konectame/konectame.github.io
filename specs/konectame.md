

## Data Standards

### Date and Time Format
All dates and timestamps in the system must follow ISO 8601 format:
- Date format: YYYY-MM-DD
- DateTime format: YYYY-MM-DDThh:mm:ss.sssZ
- Time zones: Must include UTC offset
- Example: 2024-12-17T16:00:59-04:00

## Core Entities

### 1. Users
#### System Metadata (All Users)
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last login (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- Account status (active, suspended, deleted)
- Email verification status
- Role (admin, provider, user)

#### Admin Profile
- Default system fields
- Analytics access level
- Administrative permissions

#### Provider Profile
- Provider type (individual/company)
- **Individual Provider Fields**
  - Full name
  - Personal ID/Document number
  - Date of birth (ISO 8601 date)
  - Professional qualifications
  - Personal bio

- **Company Provider Fields**
  - Company name
  - Company registration number
  - Tax ID
  - Legal representative information
  - Company size
  - Year established (ISO 8601 date)
  - Company description

- **Common Provider Fields**
  - Business contact information
  - Service areas/locations
  - Operating hours
  - Availability settings
  - Professional certifications
  - Bank account information
  - Insurance information (if applicable)
  - Rating average
  - Total reviews count
  - Verification status
  - Portfolio/Previous work
  - Social media profiles

#### User Profile
- Shopping preferences
- Saved payment methods
- Favorite listings
- Purchase history

#### Profile Management
- **Fields Management**
  - Dynamic field configuration system allowing admins to define custom fields per user role
  - **Field Properties**:
    - Unique identifier (id)
    - Display name
    - Associated user role(s)
    - Field type options:
      - Text
      - Number
      - Password
      - Keys
      - Yes/No toggle
      - Single selection dropdown
      - Multiple selection
      - URL input
      - Email input
      - YouTube URL
      - Checkbox
    - Validation rules:
      - Built-in regex patterns for common validations
      - Custom regex pattern support
      - String constraints (min/max length)
      - Numeric constraints (min/max value)
    - Form placement:
      - Option to include in signup form
      - Post-registration collection
    - Field requirements:
      - Optional/Mandatory setting
  
  - **Default System Fields**:
    1. Email
       - Type: Email input
       - Validation: RFC 5322 standard email format
       - Required: Yes
       - When: Signup
       - Unique: Yes
       - Example: user@domain.com
       - Additional: Must be verified before full access

    2. Name
       - Type: Text
       - Validation: Letters and spaces only
       - Min length: 2
       - Max length: 50
       - Required: Yes
       - When: Signup
       - Example: John
       - Additional: First character must be uppercase

    3. Last Name
       - Type: Text
       - Validation: Letters and spaces only
       - Min length: 2
       - Max length: 50
       - Required: Yes
       - When: Signup
       - Example: Smith
       - Additional: First character must be uppercase

    4. Password
       - Type: Password
       - Validation: 
         - Minimum 8 characters
         - At least one uppercase letter
         - At least one lowercase letter
         - At least one number
         - At least one special character
       - Required: Yes
       - When: Signup
       - Storage: Hashed (never stored in plain text)
       - Additional: Strength indicator during input

    5. Phone Number
       - Type: Text
       - Validation: E.164 format
       - Required: Yes
       - When: Signup
       - Example: +1234567890
       - Additional: 
         - Country code required
         - Optional SMS verification

    6. Country of Residence
       - Type: Single selection dropdown
       - Validation: ISO 3166-1 alpha-2 country codes
       - Required: Yes
       - When: Signup
       - Example: US, GB, FR
       - Additional: 
         - Affects available payment methods
         - Determines default currency
         - Sets default timezone

    7. Terms and Conditions
       - Type: Checkbox
       - Required: Yes
       - When: Signup
       - Default: Unchecked
       - Additional:
         - Must link to current terms document
         - Stores version accepted
         - Stores acceptance timestamp (ISO 8601)

    8. Profile Picture (Optional)
       - Type: Image upload
       - Format: JPG, PNG
       - Max size: 5MB
       - Required: No
       - When: Post-signup
       - Dimensions: 
         - Minimum: 200x200px
         - Maximum: 2000x2000px
       - Storage: Firebase Storage
       - Additional:
         - Auto-cropping to square
         - Thumbnail generation
         - EXIF data removal

    9. Language Preference
       - Type: Single selection dropdown
       - Default: Browser language or English
       - Required: No
       - When: Post-signup
       - Format: ISO 639-1 language codes
       - Example: en, es, fr

### Field Validation Regular Expressions

```typescript
const VALIDATION_PATTERNS = {
  // Email - RFC 5322 Official Standard
  EMAIL: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,

  // Name and Last Name - Letters, spaces, and common special characters
  NAME: /^[A-ZÀ-Ú][a-zA-ZÀ-ÿ'.\s-]{1,49}$/,

  // Password - Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Phone Number - E.164 format
  PHONE: /^\+[1-9]\d{1,14}$/,

  // Country Code - ISO 3166-1 alpha-2
  COUNTRY: /^[A-Z]{2}$/,

  // Language Code - ISO 639-1
  LANGUAGE: /^[a-z]{2}$/,

  // URL validation for social media and other links
  URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,

  // YouTube URL
  YOUTUBE_URL: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/,

  // Image file extensions
  IMAGE_FILE: /\.(jpg|jpeg|png)$/i,

  // Document file extensions
  DOCUMENT_FILE: /\.(pdf|doc|docx)$/i,

  // Date format - ISO 8601
  ISO_DATE: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,

  // DateTime format - ISO 8601 with timezone
  ISO_DATETIME: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-][01]\d:[0-5]\d)$/
} as const;

// Additional Validation Rules
const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128
  },
  PROFILE_PICTURE: {
    MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    MIN_DIMENSIONS: {
      WIDTH: 200,
      HEIGHT: 200
    },
    MAX_DIMENSIONS: {
      WIDTH: 2000,
      HEIGHT: 2000
    }
  }
} as const;

// Error Messages
const VALIDATION_ERRORS = {
  EMAIL: {
    INVALID: 'Please enter a valid email address',
    REQUIRED: 'Email is required',
    UNIQUE: 'This email is already registered'
  },
  NAME: {
    INVALID: 'Name must start with a capital letter and contain only letters, spaces, and hyphens',
    REQUIRED: 'Name is required',
    TOO_SHORT: 'Name must be at least 2 characters long',
    TOO_LONG: 'Name cannot exceed 50 characters'
  },
  PASSWORD: {
    INVALID: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
    REQUIRED: 'Password is required',
    TOO_WEAK: 'Password is too weak'
  },
  PHONE: {
    INVALID: 'Please enter a valid phone number with country code (e.g., +1234567890)',
    REQUIRED: 'Phone number is required'
  },
  COUNTRY: {
    INVALID: 'Please select a valid country',
    REQUIRED: 'Country is required'
  },
  TERMS: {
    REQUIRED: 'You must accept the Terms and Conditions'
  },
  PROFILE_PICTURE: {
    INVALID_TYPE: 'Only JPG and PNG files are allowed',
    TOO_LARGE: 'Image size must not exceed 5MB',
    INVALID_DIMENSIONS: 'Image dimensions must be between 200x200 and 2000x2000 pixels'
  }
} as const;
```

### 2. Listings
#### System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- Provider ID (reference)
- Status (active, inactive, pending review)
- View count
- Favorite count
- Average rating

#### Listing Types
1. **Reservation-based**
   - Date and time slot selection
   - Location mapping
   - Virtual meeting integration
   - Capacity management
   - Booking window settings

2. **Product-based**
   - Inventory tracking
   - SKU management
   - Variant handling
   - Stock status
   - Shipping options

3. **Service-based**
   - Quote request system
   - Service customization options
   - Availability calendar
   - Pricing calculator
   - Service area

4. **Event-based**
   - Event date and time (ISO 8601 datetime)
   - Ticket types and pricing
   - Capacity management
   - Waitlist functionality
   - Event series support
   - Registration deadline (ISO 8601 date)

### 3. Transactions
#### System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- User ID (reference)
- Provider ID (reference)
- Listing ID (reference)
- Status (pending, confirmed, completed, cancelled, refunded)
- Payment status
- Total amount
- Platform fee
- Payment method

#### Transaction Types
- **Reservation Transaction**
  - Booking time slot
  - Attendee information
  - Special requirements

- **Product Purchase**
  - Quantity
  - Selected variants
  - Shipping details
  - Tracking information

- **Service Booking**
  - Service customizations
  - Delivery preferences
  - Additional requirements

- **Event Registration**
  - Ticket quantity
  - Attendee details
  - Special accommodations

### 4. Reviews
#### System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- User ID (reference)
- Provider ID (reference)
- Listing ID (reference)
- Transaction ID (reference)
- Status (pending, published, flagged, removed)
- Rating score
- Helpful votes count

#### Review Content
- Rating (1-5 stars)
- Written review
- Media attachments
- Provider response
- Review tags
- Verification status (verified purchase)

## Database Structure

### Firebase Firestore Collections

```
marketplaces (VITE_ROOT_COLLECTION)
└── konectame (VITE_MARKETPLACE_ID)
    ├── users
    │   ├── {userId}
    │   │   ├── profile
    │   │   │   ├── type: "individual" | "company"
    │   │   │   ├── role: "admin" | "provider" | "user"
    │   │   │   └── [other profile fields]
    │   │   ├── listings
    │   │   │   └── {listingId}
    │   │   ├── transactions
    │   │   │   └── {transactionId}
    │   │   └── reviews
    │   │       └── {reviewId}
    │   └── [other users]
    ├── listings
    │   └── {listingId}
    │       ├── type: "reservation" | "product" | "service" | "event"
    │       ├── providerId
    │       └── [listing specific fields]
    ├── transactions
    │   └── {transactionId}
    │       ├── type: "reservation" | "product" | "service" | "event"
    │       ├── userId
    │       ├── providerId
    │       └── [transaction specific fields]
    └── reviews
        └── {reviewId}
            ├── userId
            ├── providerId
            ├── listingId
            └── [review specific fields]

```

### Firebase Storage Structure

```
marketplaces (VITE_ROOT_FOLDER)
└── konectame (VITE_MARKETPLACE_ID)
    ├── users
    │   └── {userId}
    │       ├── images/
    │       │   ├── profile/
    │       │   └── portfolio/
    │       └── docs/
    │           ├── verification/
    │           └── certificates/
    ├── listings
    │   └── {listingId}
    │       └── images/
    └── reviews
        └── {reviewId}
            └── media/
```

### Collection References
- All timestamps follow ISO 8601 format
- All document IDs are automatically generated by Firebase
- Cross-collection references use document IDs
- Nested collections maintain referential integrity
- Each marketplace is isolated in its own namespace

### Security Rules
- Access control based on user roles and document ownership
- Storage path validation matches Firestore structure
- Rate limiting for write operations
- Size limits for uploaded files
- Validation of file types and metadata

## System Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Firebase Services
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Cloud Storage
- **AI**: OpenAI API

## Core Features

### 1. Platform Management
- **Branding**
  - Platform color scheme
  - Logo management
  - Typography settings
  
- **Landing Page**
  - SEO optimization
  - Mobile-responsive design
  - Conversion tracking
  - A/B testing capability

### 2. User Management System

#### Authentication
- Firebase Authentication integration
- Email verification
- Password recovery
- Two-factor authentication (optional)
- Change password

#### User Roles & Permissions
- **Admin**
  - Platform configuration
  - User management
  - Content moderation
  - Analytics dashboard access
  
- **Provider**
  - Listing management
  - Order fulfillment
  - Analytics access
  - Profile management
  
- **User**
  - Profile management
  - Booking/purchasing
  - Review submission

### 3. Listing Management

#### Listing Features
- Advanced search with filters
- Geolocation support
- Category management
- Custom fields per listing type
- Media gallery (images, videos, documents)
- SEO optimization

### 4. Transaction System

#### Payment Processing
- Secure payment gateway integration
- Multiple payment methods
- Automated refund processing
- Transaction fee management

#### Booking System
- Real-time availability checking
- Instant booking option
- Quote request workflow
- Cancellation management
- Booking modification

#### Order Management
- Order tracking
- Status updates
- Invoice generation
- Receipt management
- Dispute resolution

### 5. Review & Rating System
- Post-transaction reviews
- Rating categories
- Photo/video attachments
- Response management
- Review moderation
- Rating analytics

## Technical Requirements

### Development Guidelines
1. **Component Architecture**
   - Reusable component library
   - Isolated data services
   - Clean separation of concerns
   - Type-safe implementations

2. **State Management**
   - Centralized state store
   - Real-time data sync
   - Optimistic updates
   - Offline support

3. **Security Implementation**
   - Firebase security rules
   - Data validation
   - Rate limiting
   - DDOS protection

4. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

### Quality Assurance
- Unit testing
- Integration testing
- E2E testing
- Performance monitoring
- Error tracking

### Documentation
- API documentation
- Component documentation
- Deployment guides
- User manuals

## Implementation Phases

### Phase 1: Foundation
- Core authentication
- Basic platform setup
- Essential user management
- Simple listing management

### Phase 2: Enhanced Features
- Advanced listing types
- Payment processing
- Review system
- Custom domain support

### Phase 3: Advanced Features
- Analytics dashboard
- Advanced search
- Mobile optimization
- API integrations

## Development Approach
- Agile methodology
- Two-week sprint cycles
- Continuous integration/deployment
- Regular security audits
- Performance benchmarking
