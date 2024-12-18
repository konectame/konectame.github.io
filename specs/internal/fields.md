# Field Management

## Overview
Dynamic field management system for handling custom fields across different entities in the Konectame marketplace.

## Field Types

### Text Input
- Single line text
- Multi-line text
- Rich text editor
- Character limits
- Input patterns

### Numeric Input
- Integer
- Decimal
- Currency
- Percentage
- Range limits

### Selection
- Single select
- Multi-select
- Dropdown
- Radio buttons
- Checkboxes

### Date & Time
- Date picker
- Time picker
- DateTime picker
- Range selection
- Timezone handling

### Media
- Image upload
- Video upload
- File upload
- Size limits
- Format restrictions

### Location
- Address input
- Map selection
- Coordinates
- Service area
- Geocoding

### Custom
- JSON input
- Code editor
- Formula field
- Calculated field
- Reference field

## Field Configuration

### Basic Properties
```typescript
interface FieldConfig {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  required: boolean;
  visible: boolean;
  editable: boolean;
  order: number;
}
```

### Validation Rules
```typescript
interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customValidation?: string;  // JavaScript function
  errorMessage?: string;
}
```

### Display Options
```typescript
interface FieldDisplay {
  component?: string;
  style?: {
    [key: string]: string;
  };
  className?: string;
  responsive?: {
    mobile?: DisplayOptions;
    tablet?: DisplayOptions;
    desktop?: DisplayOptions;
  };
}

interface DisplayOptions {
  visible: boolean;
  columns: number;
  order: number;
}
```

## Entity-specific Fields

### User Fields
```typescript
interface UserField extends FieldConfig {
  scope: 'individual' | 'company' | 'both';
  visibility: 'public' | 'private' | 'admin';
  verification?: {
    required: boolean;
    method: 'document' | 'api' | 'manual';
    expiration?: number;  // days
  };
}
```

### Listing Fields
```typescript
interface ListingField extends FieldConfig {
  category?: string[];
  listingType?: string[];
  searchable: boolean;
  filterable: boolean;
  aggregatable: boolean;
  displayInCard: boolean;
  displayInDetail: boolean;
}
```

### Transaction Fields
```typescript
interface TransactionField extends FieldConfig {
  transactionType?: string[];
  stage?: string[];
  partyAccess: {
    buyer: boolean;
    seller: boolean;
    admin: boolean;
  };
  workflow?: {
    triggerActions?: string[];
    requiredForStatus?: string[];
  };
}
```

## Firebase Structure
```typescript
// Collection: marketplaces/{marketplaceId}/fields/{fieldId}
interface Field {
  id: string;
  entity: 'user' | 'listing' | 'transaction';
  config: FieldConfig;
  validation: FieldValidation;
  display: FieldDisplay;
  entitySpecific: UserField | ListingField | TransactionField;
  status: 'active' | 'inactive' | 'deprecated';
  version: number;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/fields/{fieldId} {
  allow read: if true;  // Public read access
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Field Management API

### Field Creation
```typescript
function createField(
  entity: string,
  config: FieldConfig,
  validation: FieldValidation,
  display: FieldDisplay,
  entitySpecific: any
): Promise<Field> {
  // Validate configuration
  // Generate unique ID
  // Create field document
  // Return created field
}
```

### Field Update
```typescript
function updateField(
  fieldId: string,
  updates: Partial<Field>
): Promise<Field> {
  // Validate updates
  // Check field existence
  // Update field document
  // Return updated field
}
```

### Field Migration
```typescript
interface FieldMigration {
  fieldId: string;
  version: number;
  changes: {
    type?: 'rename' | 'transform' | 'merge' | 'split';
    config: any;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

function migrateField(
  fieldId: string,
  migration: FieldMigration
): Promise<void> {
  // Validate migration config
  // Create migration document
  // Schedule migration job
  // Execute migration
  // Update field version
}
```

## Field Validation

### Custom Validation
```typescript
interface CustomValidator {
  name: string;
  function: string;  // JavaScript function
  errorMessage: string;
  async: boolean;
  timeout?: number;  // milliseconds
}

function registerValidator(
  validator: CustomValidator
): Promise<void> {
  // Validate function syntax
  // Register validator
  // Make available for field config
}
```

### Dependency Validation
```typescript
interface FieldDependency {
  field: string;
  type: 'visibility' | 'requirement' | 'value';
  condition: {
    operator: string;
    value: any;
  };
  action: {
    type: string;
    config: any;
  };
}

function validateDependencies(
  fields: Field[],
  dependencies: FieldDependency[]
): boolean {
  // Check circular dependencies
  // Validate conditions
  // Return validation result
}
```
