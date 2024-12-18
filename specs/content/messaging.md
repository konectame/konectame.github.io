# Messaging Templates

## Overview
Template management system for handling email, SMS, and WhatsApp messages in the Konectame marketplace platform.

## Template Structure

### Base Template
```typescript
interface MessageTemplate {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  name: string;
  description: string;
  category: 'transactional' | 'marketing' | 'system';
  trigger: string;
  content: {
    [language: string]: TemplateContent;
  };
  variables: TemplateVariable[];
  settings: TemplateSettings;
  status: 'active' | 'inactive' | 'draft';
  version: number;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

### Template Content
```typescript
interface TemplateContent {
  subject?: string;  // Email only
  body: string;
  preheader?: string;  // Email only
  attachments?: {
    name: string;
    type: string;
    content: string;
  }[];
}
```

### Template Variable
```typescript
interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'object' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: any[];
  };
}
```

### Template Settings
```typescript
interface TemplateSettings {
  scheduling?: {
    delay?: number;
    timezone?: string;
    blackoutPeriods?: {
      start: string;
      end: string;
    }[];
  };
  delivery?: {
    priority: 'high' | 'normal' | 'low';
    retryCount: number;
    retryDelay: number;
  };
  tracking?: {
    enabled: boolean;
    clickTracking: boolean;
    openTracking: boolean;  // Email only
  };
}
```

## Template Categories

### Transactional Messages
1. User Management
   - Welcome
   - Email verification
   - Password reset
   - Account updates

2. Order Flow
   - Order confirmation
   - Payment receipt
   - Shipping updates
   - Delivery confirmation

3. Booking Flow
   - Booking confirmation
   - Reminder
   - Cancellation
   - Rescheduling

### Marketing Messages
1. Promotional
   - Special offers
   - New listings
   - Events
   - Newsletters

2. Engagement
   - Welcome series
   - Abandoned cart
   - Review requests
   - Recommendations

### System Messages
1. Notifications
   - Status updates
   - System alerts
   - Security notices
   - Maintenance updates

2. Reports
   - Analytics
   - Performance
   - Activity summaries
   - Error reports

## Firebase Structure

### Templates
```typescript
// Collection: marketplaces/{marketplaceId}/message_templates/{templateId}
interface TemplateDoc extends MessageTemplate {
  marketplace: string;
  usage: {
    sent: number;
    lastUsed: string;  // ISO 8601
    performance?: {
      delivery: number;
      open?: number;
      click?: number;
    };
  };
}
```

### Template Versions
```typescript
// Collection: marketplaces/{marketplaceId}/template_versions/{versionId}
interface TemplateVersion {
  templateId: string;
  version: number;
  content: {
    [language: string]: TemplateContent;
  };
  variables: TemplateVariable[];
  settings: TemplateSettings;
  author: string;
  timestamp: string;  // ISO 8601
  comment?: string;
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/message_templates/{templateId} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/template_versions/{versionId} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow write: if isAuthenticated() && hasRole('admin');
}
```

## Template Service

### Template Management
```typescript
class TemplateManager {
  async createTemplate(
    template: Omit<MessageTemplate, 'id' | 'version'>
  ): Promise<string> {
    // Validate template
    // Create template
    // Return ID
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<MessageTemplate>
  ): Promise<void> {
    // Validate updates
    // Create version
    // Update template
  }

  async renderTemplate(
    templateId: string,
    language: string,
    variables: {[key: string]: any}
  ): Promise<string> {
    // Get template
    // Validate variables
    // Render content
  }
}
```

### Version Control
```typescript
class TemplateVersionControl {
  async createVersion(
    templateId: string,
    content: {[language: string]: TemplateContent},
    comment?: string
  ): Promise<number> {
    // Create version
    // Update template
    // Return version
  }

  async revertToVersion(
    templateId: string,
    version: number
  ): Promise<void> {
    // Validate version
    // Create new version
    // Update content
  }

  async compareVersions(
    templateId: string,
    version1: number,
    version2: number
  ): Promise<Difference[]> {
    // Get versions
    // Compare content
    // Return differences
  }
}
```

## Message Sending

### Send Options
```typescript
interface SendOptions {
  templateId: string;
  recipient: {
    id?: string;
    email?: string;
    phone?: string;
  };
  variables: {[key: string]: any};
  language: string;
  metadata?: {
    campaign?: string;
    source?: string;
    [key: string]: any;
  };
}
```

### Send Service
```typescript
class MessageSender {
  async send(
    options: SendOptions
  ): Promise<string> {
    // Validate options
    // Render template
    // Send message
    // Track delivery
  }

  async schedule(
    options: SendOptions,
    sendAt: string
  ): Promise<string> {
    // Validate schedule
    // Create job
    // Return job ID
  }

  async cancel(
    jobId: string
  ): Promise<void> {
    // Cancel job
    // Update status
    // Log action
  }
}
```

## Analytics Integration

### Message Analytics
```typescript
interface MessageAnalytics {
  templateId: string;
  sent: number;
  delivered: number;
  failed: number;
  opened?: number;  // Email only
  clicked?: number;
  bounced: number;
  complaints: number;
  performance: {
    deliveryRate: number;
    openRate?: number;
    clickRate?: number;
  };
}
```

### Analytics Collection
```typescript
class MessageAnalytics {
  async trackEvent(
    type: 'send' | 'delivery' | 'open' | 'click' | 'bounce' | 'complaint',
    messageId: string,
    metadata?: any
  ): Promise<void> {
    // Record event
    // Update analytics
    // Store data
  }

  async getTemplateAnalytics(
    templateId: string,
    dateRange?: {
      start: string;
      end: string;
    }
  ): Promise<MessageAnalytics> {
    // Get analytics
    // Calculate metrics
    // Return data
  }
}
```
