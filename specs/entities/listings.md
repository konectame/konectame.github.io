# Listings

## Overview
Listing management system for products, services, reservations, and events in the Konectame marketplace.

## System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- Provider ID (reference)
- Status (active, inactive, pending review)
- View count
- Favorite count
- Average rating

## Listing Types

### 1. Reservation-based
- Appointment scheduling
- Time slot management
- Location or virtual meeting
- Capacity controls
- Booking windows
- Cancellation policies

### 2. Product-based
- Physical/Digital goods
- Inventory tracking
- SKU management
- Variant handling
- Stock status
- Shipping options
- Return policies

### 3. Service-based
- Professional services
- Quote system
- Service customization
- Availability calendar
- Pricing calculator
- Service area definition
- Delivery options

### 4. Event-based
- Event scheduling
- Ticket types/pricing
- Capacity management
- Waitlist functionality
- Event series
- Registration deadlines

## Categories
- Hierarchical category system
- Multiple category assignment
- Category-specific fields
- Search optimization
- Filter configuration

## Field Management
See [Field Management](../internal/fields.md) for detailed field configuration.

### Common Fields
1. Title
   - Type: Text
   - Required: Yes
   - Min length: 3
   - Max length: 100

2. Description
   - Type: Rich Text
   - Required: Yes
   - Min length: 50
   - Max length: 5000

3. Price
   - Type: Number
   - Required: Yes
   - Min value: 0
   - Currency support

4. Location
   - Type: Location
   - Required: Based on type
   - Geocoding support

5. Media
   - Type: File upload
   - Required: Yes
   - Min files: 1
   - Max files: 10
   - Types: image, video
   - Size limits

### Type-Specific Fields
Defined based on listing type requirements. See [Field Management](../internal/fields.md).

## Search System
See [Search System](../internal/search.md) for detailed search configuration.

### Indexing
- Full-text search
- Category filtering
- Price range filtering
- Location-based search
- Custom field filtering

### Sort Options
- Relevance
- Price (low/high)
- Date (newest/oldest)
- Rating
- Distance
- Custom fields

## Firebase Structure
```typescript
// Collection: marketplaces/{marketplaceId}/listings/{listingId}
interface Listing {
  id: string;
  type: 'reservation' | 'product' | 'service' | 'event';
  providerId: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    type: 'fixed' | 'starting' | 'range';
    min?: number;
    max?: number;
  };
  location?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    serviceArea?: number;  // radius in km
  };
  categories: string[];
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    order: number;
  }[];
  status: 'active' | 'inactive' | 'pending';
  stats: {
    views: number;
    favorites: number;
    avgRating: number;
    totalReviews: number;
  };
  // Type-specific fields
  typeData: {
    [key: string]: any;
  };
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/listings/{listingId} {
  allow read: if true;  // Public read access
  allow create: if isAuthenticated() && (
    hasRole('provider') ||
    hasRole('admin')
  ) && isValidListing();
  allow update: if isAuthenticated() && (
    resource.data.providerId == request.auth.uid ||
    hasRole('admin')
  ) && isValidListing();
  allow delete: if isAuthenticated() && (
    resource.data.providerId == request.auth.uid ||
    hasRole('admin')
  );
}

function isValidListing() {
  let listing = request.resource.data;
  return listing.type in ['reservation', 'product', 'service', 'event']
    && listing.title.size() >= 3
    && listing.title.size() <= 100
    && listing.description.size() >= 50
    && listing.description.size() <= 5000
    && listing.price.amount >= 0
    && listing.media.size() >= 1
    && listing.media.size() <= 10;
}
```
