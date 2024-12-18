# Email Configuration

## Overview
Email configuration and template management system for the Konectame marketplace platform.

## SMTP Configuration

### Gmail SMTP
```typescript
interface SMTPConfig {
  host: 'smtp.gmail.com';
  port: 587;
  secure: true;
  auth: {
    user: string;  // Gmail address
    pass: string;  // App Password
  };
}
```

### Security
- Use of App Passwords
- Encrypted storage
- Access control
- Rate limiting
- Error handling

## Template System

### Template Structure
```typescript
interface EmailTemplate {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  name: string;
  description: string;
  subject?: string;  // Email only
  content: string;  // Handlebars template
  variables: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  attachments?: {
    filename: string;
    path: string;
    cid?: string;  // For inline images
  }[];
  version: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

### Template Categories
1. User Management
   - Welcome email
   - Email verification
   - Password reset
   - Account updates

2. Transaction Flow
   - Order confirmation
   - Payment receipt
   - Shipping updates
   - Booking confirmation

3. Provider Communication
   - New order notification
   - Message received
   - Review notification
   - Account status

4. Marketing
   - Promotional emails
   - Newsletter
   - Feature updates
   - Event announcements

## Email Service

### Send Email
```typescript
interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  templateId: string;
  variables: {
    [key: string]: any;
  };
  attachments?: {
    filename: string;
    content: Buffer | string;
    path?: string;
  }[];
}

async function sendEmail(options: EmailOptions): Promise<void> {
  // Validate email options
  // Load template
  // Compile template
  // Send email
  // Log result
}
```

### Bulk Email
```typescript
interface BulkEmailOptions {
  recipients: {
    to: string;
    variables: {
      [key: string]: any;
    };
  }[];
  templateId: string;
  batchSize: number;
  delayBetweenBatches: number;  // milliseconds
}

async function sendBulkEmail(
  options: BulkEmailOptions
): Promise<BulkEmailResult> {
  // Validate recipients
  // Process in batches
  // Handle errors
  // Return results
}
```

## Firebase Structure

### Configuration
```typescript
// Collection: marketplaces/{marketplaceId}/email_config
interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;  // Encrypted
    };
  };
  defaults: {
    from: string;
    replyTo?: string;
    footer?: string;
  };
  limits: {
    maxRecipients: number;
    maxAttachmentSize: number;
    rateLimit: {
      window: number;  // milliseconds
      max: number;
    };
  };
}
```

### Templates
```typescript
// Collection: marketplaces/{marketplaceId}/email_templates/{templateId}
interface EmailTemplateDoc extends EmailTemplate {
  marketplace: string;
  usage: {
    sent: number;
    lastUsed: string;  // ISO 8601
  };
}
```

### Logs
```typescript
// Collection: marketplaces/{marketplaceId}/email_logs/{logId}
interface EmailLog {
  id: string;
  templateId: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  status: 'sent' | 'failed';
  error?: string;
  timestamp: string;  // ISO 8601
  metadata?: {
    [key: string]: any;
  };
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/email_config/{document=**} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/email_templates/{templateId} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/email_logs/{logId} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow create: if true;  // System created
  allow update, delete: if false;
}
```

## Template Management

### Version Control
```typescript
interface TemplateVersion {
  version: number;
  content: string;
  variables: {
    [key: string]: any;
  };
  createdAt: string;  // ISO 8601
  createdBy: string;
  comment?: string;
}

async function createTemplateVersion(
  templateId: string,
  content: string,
  comment?: string
): Promise<void> {
  // Create new version
  // Update template
  // Archive old version
}
```

### Template Testing
```typescript
interface TestResult {
  success: boolean;
  renderedContent: string;
  missingVariables: string[];
  errors: string[];
}

async function testTemplate(
  templateId: string,
  variables: {[key: string]: any}
): Promise<TestResult> {
  // Load template
  // Validate variables
  // Test compilation
  // Return results
}
```

## Error Handling

### Retry Logic
```typescript
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

async function sendWithRetry(
  options: EmailOptions,
  config: RetryConfig
): Promise<void> {
  // Implement exponential backoff
  // Handle permanent failures
  // Log retry attempts
}
```

### Error Types
```typescript
enum EmailError {
  INVALID_RECIPIENT = 'invalid_recipient',
  TEMPLATE_NOT_FOUND = 'template_not_found',
  COMPILATION_ERROR = 'compilation_error',
  SMTP_ERROR = 'smtp_error',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  ATTACHMENT_TOO_LARGE = 'attachment_too_large'
}
```
