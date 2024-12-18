# Reviews

## Overview
Review and rating system for managing user feedback on transactions, providers, and listings in the Konectame marketplace.

## System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- User ID (reviewer)
- Provider ID (reviewed)
- Transaction ID (reference)
- Listing ID (reference)
- Status (published, hidden, reported)

## Review Types

### 1. Transaction Review
- Post-purchase feedback
- Service satisfaction
- Delivery evaluation
- Communication rating
- Overall experience

### 2. Provider Review
- Provider professionalism
- Communication quality
- Service quality
- Reliability rating
- Recommendation score

### 3. Listing Review
- Product quality
- Service accuracy
- Price fairness
- Description accuracy
- Media authenticity

## Rating Structure

### Core Rating Components
1. Overall Rating
   - Scale: 1-5 stars
   - Required: Yes
   - Weight: Highest

2. Category-specific Ratings
   - Scale: 1-5 stars
   - Required: Based on category
   - Custom criteria

3. Written Review
   - Min length: 10 characters
   - Max length: 1000 characters
   - Required: Yes
   - Media attachments (optional)

### Rating Criteria
Based on listing/transaction type:

#### Products
- Quality
- Value for money
- Description accuracy
- Shipping speed
- Packaging

#### Services
- Professionalism
- Communication
- Value for money
- Punctuality
- Expertise

#### Events
- Organization
- Value for money
- Venue/Platform
- Content quality
- Support

## Review Management

### Moderation
- Automated content filtering
- Manual review process
- Report handling
- Response management
- Review updates

### Response System
- Provider responses
- Response timeframe
- Edit capabilities
- Notification system
- Dispute handling

## Firebase Structure
```typescript
// Collection: marketplaces/{marketplaceId}/reviews/{reviewId}
interface Review {
  id: string;
  type: 'transaction' | 'provider' | 'listing';
  userId: string;
  providerId: string;
  transactionId?: string;
  listingId?: string;
  rating: {
    overall: number;  // 1-5
    criteria: {
      [key: string]: number;  // 1-5
    };
  };
  content: {
    text: string;
    media?: {
      type: 'image' | 'video';
      url: string;
    }[];
  };
  response?: {
    text: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
  status: 'published' | 'hidden' | 'reported';
  moderation?: {
    reportCount: number;
    reportReasons: string[];
    moderatorNotes?: string;
    lastReviewDate: string;  // ISO 8601
  };
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/reviews/{reviewId} {
  allow read: if true;  // Public read access
  allow create: if isAuthenticated() && isValidReview();
  allow update: if isAuthenticated() && (
    // Original reviewer can edit within time window
    (resource.data.userId == request.auth.uid &&
     isWithinEditWindow(resource.data.createdAt)) ||
    // Provider can add response
    (resource.data.providerId == request.auth.uid &&
     isValidProviderResponse()) ||
    hasRole('admin')
  );
  allow delete: if isAuthenticated() && hasRole('admin');
}

function isValidReview() {
  let review = request.resource.data;
  return review.type in ['transaction', 'provider', 'listing']
    && review.rating.overall >= 1
    && review.rating.overall <= 5
    && review.content.text.size() >= 10
    && review.content.text.size() <= 1000;
}

function isWithinEditWindow(createdAt) {
  // Allow edits within 24 hours
  return timestamp.toMillis() - toMillis(createdAt) <= 24 * 60 * 60 * 1000;
}

function isValidProviderResponse() {
  let update = request.resource.data;
  let original = resource.data;
  
  // Only allow response field updates
  return update.diff(original).affectedKeys().hasOnly(['response']);
}
```

## Rating Calculation

### Provider Rating
```typescript
interface ProviderRating {
  overall: number;
  criteria: {
    [key: string]: number;
  };
  totalReviews: number;
  recentReviews: number;  // Last 30 days
  categoryRatings: {
    [category: string]: {
      overall: number;
      totalReviews: number;
    };
  };
}

function calculateProviderRating(
  reviews: Review[],
  weights: {[key: string]: number}
): ProviderRating {
  // Calculate weighted average ratings
  // Consider review recency
  // Break down by categories
  // Return comprehensive rating data
}
```

### Listing Rating
```typescript
interface ListingRating {
  overall: number;
  criteria: {
    [key: string]: number;
  };
  totalReviews: number;
  distribution: {
    [stars: number]: number;  // Count of reviews per star rating
  };
}

function calculateListingRating(
  reviews: Review[]
): ListingRating {
  // Calculate average ratings
  // Generate rating distribution
  // Return listing rating data
}
```
