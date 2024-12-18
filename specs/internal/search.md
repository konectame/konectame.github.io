# Search System

## Overview
Advanced search and filtering system for the Konectame marketplace platform.

## Search Components

### Full-text Search
- Multi-field search
- Fuzzy matching
- Relevance scoring
- Language support
- Stopword handling

### Filters
- Category filters
- Price range
- Location radius
- Custom field filters
- Dynamic filters

### Sorting
- Relevance
- Price
- Date
- Rating
- Distance
- Custom fields

## Search Configuration

### Indexed Fields
```typescript
interface SearchField {
  name: string;
  type: 'text' | 'number' | 'date' | 'geo' | 'keyword';
  boost?: number;
  analyzer?: string;
  searchable: boolean;
  filterable: boolean;
  sortable: boolean;
  aggregatable: boolean;
}
```

### Search Settings
```typescript
interface SearchSettings {
  defaultSearchFields: string[];
  highlightFields: string[];
  maxResults: number;
  minScore: number;
  fuzzyMatch: {
    enabled: boolean;
    maxEdits: number;
  };
  geoSearch: {
    maxRadius: number;  // kilometers
    boostByDistance: boolean;
  };
}
```

## Search Query Structure

### Basic Query
```typescript
interface SearchQuery {
  query: string;
  filters?: Filter[];
  sort?: Sort[];
  page?: number;
  pageSize?: number;
  highlight?: boolean;
}

interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';
  value: any;
}

interface Sort {
  field: string;
  order: 'asc' | 'desc';
}
```

### Advanced Query
```typescript
interface AdvancedQuery extends SearchQuery {
  must?: SearchQuery[];
  should?: SearchQuery[];
  mustNot?: SearchQuery[];
  boost?: number;
  minimumShouldMatch?: number;
}
```

## Search Results

### Result Structure
```typescript
interface SearchResults {
  hits: SearchHit[];
  total: number;
  page: number;
  pageSize: number;
  aggregations?: {
    [key: string]: any;
  };
  suggest?: {
    [key: string]: string[];
  };
}

interface SearchHit {
  id: string;
  score: number;
  source: any;
  highlight?: {
    [field: string]: string[];
  };
}
```

## Aggregations

### Aggregation Types
```typescript
interface Aggregation {
  field: string;
  type: 'terms' | 'range' | 'date_histogram' | 'geo_distance';
  config: {
    size?: number;
    ranges?: Range[];
    interval?: string;
    distance?: number;
  };
}

interface Range {
  from?: number;
  to?: number;
  key?: string;
}
```

## Search Implementation

### Search Service
```typescript
class SearchService {
  async search(query: SearchQuery): Promise<SearchResults> {
    // Validate query
    // Build search request
    // Execute search
    // Process results
    // Return formatted results
  }

  async suggest(
    text: string,
    field: string
  ): Promise<string[]> {
    // Generate suggestions
    // Return top matches
  }

  async buildFilters(
    category?: string,
    customFields?: any
  ): Promise<Filter[]> {
    // Generate dynamic filters
    // Return filter configuration
  }
}
```

### Indexing Service
```typescript
class IndexingService {
  async indexDocument(
    document: any,
    type: string
  ): Promise<void> {
    // Prepare document
    // Index document
    // Update search index
  }

  async updateDocument(
    id: string,
    updates: any,
    type: string
  ): Promise<void> {
    // Validate updates
    // Update document
    // Refresh index
  }

  async deleteDocument(
    id: string,
    type: string
  ): Promise<void> {
    // Remove document
    // Update index
  }

  async reindexCollection(
    type: string
  ): Promise<void> {
    // Create new index
    // Reindex documents
    // Switch alias
  }
}
```

## Search Analytics

### Tracking
```typescript
interface SearchAnalytics {
  query: string;
  filters: Filter[];
  results: number;
  timestamp: string;  // ISO 8601
  userId?: string;
  sessionId: string;
  clickedResults?: string[];
  conversionResults?: string[];
}
```

### Analysis
```typescript
interface SearchMetrics {
  popularity: {
    queries: {[query: string]: number};
    filters: {[filter: string]: number};
  };
  performance: {
    avgResults: number;
    noResultsQueries: string[];
    avgResponseTime: number;
  };
  conversion: {
    clickThrough: number;
    conversion: number;
    abandonedSearches: number;
  };
}
```

## Firebase Integration
```typescript
// Collection: marketplaces/{marketplaceId}/search_config/{configId}
interface SearchConfig {
  id: string;
  type: string;
  fields: SearchField[];
  settings: SearchSettings;
  aggregations: Aggregation[];
  status: 'active' | 'inactive';
  updatedAt: string;  // ISO 8601
}

// Collection: marketplaces/{marketplaceId}/search_analytics/{analyticsId}
interface SearchAnalyticsDoc extends SearchAnalytics {
  id: string;
  marketplace: string;
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/search_config/{configId} {
  allow read: if true;
  allow write: if isAuthenticated() && hasRole('admin');
}

match /marketplaces/{marketplaceId}/search_analytics/{analyticsId} {
  allow read: if isAuthenticated() && hasRole('admin');
  allow create: if true;  // Allow anonymous analytics
  allow update, delete: if false;
}
```
