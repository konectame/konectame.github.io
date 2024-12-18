# Localization Configuration

## Overview
Localization system for managing multi-language support across the Konectame marketplace platform.

## Language Configuration

### Supported Languages
```typescript
interface LanguageConfig {
  id: string;  // e.g., 'en-US'
  name: string;  // e.g., 'English (US)'
  native: string;  // e.g., 'English'
  direction: 'ltr' | 'rtl';
  status: 'active' | 'inactive';
  fallback?: string;  // Fallback language ID
}
```

### Regional Settings
```typescript
interface RegionalConfig {
  timezone: string;  // IANA timezone
  dateFormat: string;  // e.g., 'MM/DD/YYYY'
  timeFormat: string;  // '12h' | '24h'
  currency: {
    code: string;  // ISO 4217
    symbol: string;
    position: 'prefix' | 'suffix';
    decimals: number;
  };
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
}
```

## Translation Management

### Translation Structure
```typescript
interface Translation {
  key: string;
  module: string;
  context?: string;
  translations: {
    [languageId: string]: {
      value: string;
      status: 'approved' | 'pending' | 'needs_review';
      lastUpdated: string;  // ISO 8601
    };
  };
  metadata?: {
    maxLength?: number;
    variables?: string[];
    notes?: string;
  };
}
```

### Translation Modules
1. UI Elements
   - Navigation
   - Buttons
   - Form labels
   - Error messages

2. Content
   - Pages
   - Emails
   - Notifications
   - Help text

3. System Messages
   - Errors
   - Confirmations
   - Status updates
   - Notifications

## Firebase Structure

### Configuration
```typescript
// Collection: marketplaces/{marketplaceId}/localization_config
interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: LanguageConfig[];
  regional: RegionalConfig;
  status: 'active' | 'maintenance';
  updatedAt: string;  // ISO 8601
}
```

### Translations
```typescript
// Collection: marketplaces/{marketplaceId}/translations/{translationId}
interface TranslationDoc extends Translation {
  marketplace: string;
  usage: {
    count: number;
    lastUsed: string;  // ISO 8601
  };
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/localization_config/{document=**} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/translations/{translationId} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Translation Service

### Translation Loading
```typescript
interface LoadOptions {
  language: string;
  modules?: string[];
  forceRefresh?: boolean;
}

async function loadTranslations(
  options: LoadOptions
): Promise<{[key: string]: string}> {
  // Load translations from cache/Firebase
  // Apply fallback language if needed
  // Return translation map
}
```

### Translation Updates
```typescript
interface UpdateOptions {
  key: string;
  language: string;
  value: string;
  status?: 'approved' | 'pending' | 'needs_review';
}

async function updateTranslation(
  options: UpdateOptions
): Promise<void> {
  // Validate translation
  // Update in Firebase
  // Invalidate cache
  // Log change
}
```

## Cache Management

### Cache Structure
```typescript
interface TranslationCache {
  language: string;
  translations: {[key: string]: string};
  timestamp: string;  // ISO 8601
  version: number;
}
```

### Cache Operations
```typescript
class TranslationCache {
  async get(language: string): Promise<TranslationCache | null> {
    // Get cached translations
  }

  async set(cache: TranslationCache): Promise<void> {
    // Update cache
  }

  async invalidate(language?: string): Promise<void> {
    // Clear specific or all languages
  }
}
```

## Import/Export

### Export Format
```typescript
interface TranslationExport {
  version: number;
  timestamp: string;  // ISO 8601
  languages: LanguageConfig[];
  translations: Translation[];
}
```

### Import/Export Functions
```typescript
async function exportTranslations(
  languages?: string[]
): Promise<TranslationExport> {
  // Export translations
}

async function importTranslations(
  data: TranslationExport
): Promise<ImportResult> {
  // Validate import data
  // Update translations
  // Return results
}
```

## Missing Translation Handling

### Detection
```typescript
interface MissingTranslation {
  key: string;
  language: string;
  module: string;
  context?: string;
  timestamp: string;  // ISO 8601
  count: number;
}
```

### Reporting
```typescript
async function reportMissingTranslation(
  key: string,
  language: string
): Promise<void> {
  // Log missing translation
  // Update statistics
  // Notify if threshold reached
}
```
