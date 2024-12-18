# Transactions

## Overview
Transaction management system for handling payments, bookings, and order processing in the Konectame marketplace.

## System Metadata
- ID (unique identifier)
- Created at (ISO 8601 timestamp)
- Last update (ISO 8601 timestamp)
- User ID (buyer)
- Provider ID (seller)
- Listing ID (reference)
- Status tracking
- Payment details

## Transaction Types

### 1. Direct Purchase
- Immediate payment
- Product/service delivery
- Shipping tracking
- Order confirmation
- Receipt generation

### 2. Reservation Booking
- Appointment scheduling
- Deposit handling
- Cancellation management
- Rescheduling options
- Confirmation emails

### 3. Quote-based Service
- Quote request
- Provider response
- Quote acceptance
- Milestone payments
- Service completion

### 4. Event Registration
- Ticket purchase
- Attendee information
- Event updates
- Check-in system
- Refund handling

## Commission Structure
- Percentage-based fees
- Fixed fees
- Tiered commission rates
- Provider type variations
- Category-specific rates

## Payment Processing
- Payment gateway integration
- Multi-currency support
- Tax calculation
- Refund processing
- Dispute resolution

## Transaction States
1. Initiated
   - Quote requested
   - Booking attempted
   - Cart checkout

2. Processing
   - Payment pending
   - Provider confirmation
   - Document verification

3. Confirmed
   - Payment received
   - Booking confirmed
   - Order accepted

4. In Progress
   - Service delivery
   - Shipping
   - Awaiting completion

5. Completed
   - Service delivered
   - Product received
   - Event attended

6. Cancelled
   - User cancellation
   - Provider cancellation
   - System cancellation

7. Disputed
   - Dispute opened
   - Resolution pending
   - Mediation required

## Firebase Structure
```typescript
// Collection: marketplaces/{marketplaceId}/transactions/{transactionId}
interface Transaction {
  id: string;
  type: 'purchase' | 'reservation' | 'quote' | 'event';
  userId: string;
  providerId: string;
  listingId: string;
  status: TransactionStatus;
  payment: {
    amount: number;
    currency: string;
    commission: number;
    tax: number;
    total: number;
    gateway: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    refund?: {
      amount: number;
      reason: string;
      date: string;  // ISO 8601
    };
  };
  timeline: {
    status: TransactionStatus;
    timestamp: string;  // ISO 8601
    note?: string;
  }[];
  // Type-specific data
  typeData: {
    [key: string]: any;
  };
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

type TransactionStatus =
  | 'initiated'
  | 'processing'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';
```

## Security Rules
```typescript
match /marketplaces/{marketplaceId}/transactions/{transactionId} {
  allow read: if isAuthenticated() && (
    resource.data.userId == request.auth.uid ||
    resource.data.providerId == request.auth.uid ||
    hasRole('admin')
  );
  allow create: if isAuthenticated() && isValidTransaction();
  allow update: if isAuthenticated() && (
    resource.data.userId == request.auth.uid ||
    resource.data.providerId == request.auth.uid ||
    hasRole('admin')
  ) && isValidTransactionUpdate();
}

function isValidTransaction() {
  let transaction = request.resource.data;
  return transaction.type in ['purchase', 'reservation', 'quote', 'event']
    && transaction.payment.amount >= 0
    && transaction.payment.commission >= 0
    && transaction.payment.tax >= 0;
}

function isValidTransactionUpdate() {
  let transaction = request.resource.data;
  let oldTransaction = resource.data;
  
  // Prevent modification of critical fields
  return transaction.userId == oldTransaction.userId
    && transaction.providerId == oldTransaction.providerId
    && transaction.listingId == oldTransaction.listingId
    && isValidStatusTransition(oldTransaction.status, transaction.status);
}

function isValidStatusTransition(oldStatus, newStatus) {
  // Define valid status transitions
  return true;  // TODO: Implement status transition rules
}
```

## Commission Calculation
```typescript
interface CommissionRule {
  type: 'percentage' | 'fixed';
  value: number;
  min?: number;
  max?: number;
  conditions?: {
    providerType?: string[];
    category?: string[];
    transactionType?: string[];
    amount?: {
      min?: number;
      max?: number;
    };
  };
}

function calculateCommission(
  amount: number,
  rules: CommissionRule[],
  context: {
    providerType: string;
    category: string;
    transactionType: string;
  }
): number {
  // Apply matching rules
  // Return calculated commission
}
```

## Minimum Transaction Size
- Category-specific minimums
- Provider type variations
- Currency considerations
- Dynamic adjustment rules
