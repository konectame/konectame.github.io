# Page Management

## Overview
Content management system for handling static and dynamic pages in the Konectame marketplace platform.

## Page Structure

### Page Definition
```typescript
interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;  // HTML/Markdown
  template: string;
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'private' | 'protected';
  metadata: {
    description?: string;
    keywords?: string[];
    author?: string;
    image?: string;
    og: {
      title?: string;
      description?: string;
      type: 'website' | 'article' | 'product' | 'profile';
      image?: {
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      };
      url?: string;
      siteName?: string;
      locale?: string;
      video?: {
        url: string;
        width?: number;
        height?: number;
        type?: string;
      };
      article?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string[];
        section?: string;
        tags?: string[];
      };
      product?: {
        price: {
          amount: number;
          currency: string;
        };
        availability: 'in stock' | 'out of stock' | 'preorder';
        category?: string;
        brand?: string;
      };
      profile?: {
        firstName?: string;
        lastName?: string;
        username?: string;
        gender?: string;
      };
    };
    twitter?: {
      card: 'summary' | 'summary_large_image' | 'app' | 'player';
      site?: string;
      creator?: string;
      title?: string;
      description?: string;
      image?: string;
      imageAlt?: string;
    };
  };
  settings: {
    showInNavigation: boolean;
    allowComments: boolean;
    requireAuth: boolean;
  };
  versions: PageVersion[];
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
  publishedAt?: string;  // ISO 8601
}
```

### Page Version
```typescript
interface PageVersion {
  version: number;
  content: string;
  author: string;
  changes: string;
  timestamp: string;  // ISO 8601
}
```

## Page Types

### Static Pages
- About Us
- Terms of Service
- Privacy Policy
- Contact Us
- FAQ

### Dynamic Pages
- Homepage
- Category Pages
- Search Results
- User Dashboard
- Profile Pages

### System Pages
- Error Pages (404, 500)
- Maintenance Page
- Login/Register
- Password Reset

## Template System

### Template Structure
```typescript
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;  // HTML/JSX
  regions: {
    id: string;
    name: string;
    type: 'content' | 'sidebar' | 'header' | 'footer';
    allowedComponents: string[];
  }[];
  settings: {
    [key: string]: any;
  };
}
```

### Component Definition
```typescript
interface PageComponent {
  id: string;
  type: string;
  name: string;
  content: any;
  style?: {
    [key: string]: string;
  };
  settings?: {
    [key: string]: any;
  };
}
```

## Firebase Structure

### Pages
```typescript
// Collection: marketplaces/{marketplaceId}/pages/{pageId}
interface PageDoc extends Page {
  marketplace: string;
  analytics: {
    views: number;
    lastViewed: string;  // ISO 8601
  };
}
```

### Templates
```typescript
// Collection: marketplaces/{marketplaceId}/page_templates/{templateId}
interface TemplateDoc extends PageTemplate {
  marketplace: string;
  usage: {
    count: number;
    pages: string[];
  };
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/pages/{pageId} {
  allow read: if isPublicPage() || (
    isAuthenticated() && hasPageAccess()
  );
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/page_templates/{templateId} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && hasRole('admin');
}

function isPublicPage() {
  return resource.data.visibility == 'public';
}

function hasPageAccess() {
  return resource.data.visibility == 'protected' &&
    hasRole('provider');
}
```

## Page Management Service

### Page Operations
```typescript
class PageManager {
  async createPage(
    page: Omit<Page, 'id' | 'versions'>
  ): Promise<string> {
    // Validate page
    // Generate slug
    // Create page
    // Return ID
  }

  async updatePage(
    pageId: string,
    updates: Partial<Page>
  ): Promise<void> {
    // Validate updates
    // Create version
    // Update page
  }

  async publishPage(
    pageId: string
  ): Promise<void> {
    // Validate status
    // Update status
    // Set publish date
  }

  async deletePage(
    pageId: string
  ): Promise<void> {
    // Archive instead of delete
    // Update status
    // Log action
  }
}
```

### Version Control
```typescript
class PageVersionControl {
  async createVersion(
    pageId: string,
    content: string,
    changes: string
  ): Promise<number> {
    // Create version
    // Update page
    // Return version
  }

  async revertToVersion(
    pageId: string,
    version: number
  ): Promise<void> {
    // Validate version
    // Create new version
    // Update content
  }

  async compareVersions(
    pageId: string,
    version1: number,
    version2: number
  ): Promise<Difference[]> {
    // Get versions
    // Compare content
    // Return differences
  }
}
```

### Metadata Management
```typescript
class MetadataManager {
  async updateMetadata(
    pageId: string,
    metadata: Partial<Page['metadata']>
  ): Promise<void> {
    // Validate metadata
    // Update page
    // Regenerate meta tags
  }

  async generateMetaTags(
    page: Page
  ): Promise<string> {
    // Generate basic meta tags
    // Generate OG meta tags
    // Generate Twitter meta tags
    // Return HTML string
  }

  async validateImages(
    metadata: Page['metadata']
  ): Promise<ValidationResult> {
    // Check image dimensions
    // Validate formats
    // Check file sizes
    // Return validation results
  }

  async generatePreview(
    pageId: string
  ): Promise<PreviewResult> {
    // Generate social media previews
    // Create preview images
    // Return preview data
  }
}

interface ValidationResult {
  valid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings: {
    field: string;
    message: string;
  }[];
}

interface PreviewResult {
  og: {
    desktop: string;  // Preview image URL
    mobile: string;   // Preview image URL
  };
  twitter: {
    summary: string;  // Preview image URL
    large: string;    // Preview image URL
  };
}
```

### SEO Optimization
```typescript
class SEOManager {
  async analyzePage(
    pageId: string
  ): Promise<SEOAnalysis> {
    // Analyze meta tags
    // Check content
    // Validate structure
    // Return analysis
  }

  async generateSuggestions(
    analysis: SEOAnalysis
  ): Promise<SEOSuggestions> {
    // Generate improvements
    // Prioritize changes
    // Return suggestions
  }

  async optimizeImages(
    metadata: Page['metadata']
  ): Promise<OptimizedImages> {
    // Resize images
    // Optimize formats
    // Generate variants
    // Return optimized URLs
  }
}

interface SEOAnalysis {
  score: number;
  metadata: {
    title: {
      length: number;
      score: number;
      suggestions?: string[];
    };
    description: {
      length: number;
      score: number;
      suggestions?: string[];
    };
    og: {
      score: number;
      missing: string[];
      suggestions?: string[];
    };
    twitter: {
      score: number;
      missing: string[];
      suggestions?: string[];
    };
  };
  images: {
    count: number;
    optimized: number;
    suggestions?: string[];
  };
}
```

## Search Integration

### Page Indexing
```typescript
interface PageIndex {
  id: string;
  title: string;
  content: string;
  metadata: {
    [key: string]: any;
  };
  status: string;
  updatedAt: string;  // ISO 8601
}

async function indexPage(
  page: Page
): Promise<void> {
  // Prepare index data
  // Update search index
  // Log indexing
}
```

### Search Operations
```typescript
async function searchPages(
  query: string,
  filters?: {
    status?: string;
    template?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }
): Promise<Page[]> {
  // Search pages
  // Apply filters
  // Return results
}
```

## Analytics Integration

### Page Analytics
```typescript
interface PageAnalytics {
  pageId: string;
  views: number;
  uniqueVisitors: number;
  averageTime: number;
  bounceRate: number;
  devices: {
    [device: string]: number;
  };
  referrers: {
    [referrer: string]: number;
  };
}
```

### Analytics Collection
```typescript
class PageAnalytics {
  async trackPageView(
    pageId: string,
    userId?: string,
    metadata?: any
  ): Promise<void> {
    // Record view
    // Update analytics
    // Store event
  }

  async getPageAnalytics(
    pageId: string,
    dateRange?: {
      start: string;
      end: string;
    }
  ): Promise<PageAnalytics> {
    // Get analytics
    // Calculate metrics
    // Return data
  }
}
```
