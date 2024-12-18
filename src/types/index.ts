export type UserRole = 'super_admin' | 'marketplace_admin' | 'provider' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  marketplaceId?: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Marketplace {
  id: string;
  name: string;
  domain: string;
  branding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  settings: {
    listingTypes: ('reservation' | 'product' | 'service' | 'event')[];
    customFields: CustomField[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'file' | 'image' | 'select' | 'multi-select';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}