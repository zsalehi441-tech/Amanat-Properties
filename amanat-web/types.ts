
export enum Language {
  DARI = 'dr',
  PASHTO = 'ps',
  ENGLISH = 'en'
}

export interface Property {
  id: string;
  title: Record<Language, string>;
  location: {
    district: string;
    city: string;
  } & Record<Language, string>;
  coordinates?: {
    lat: number;
    lng: number;
  };
  price: number;
  currency: 'USD' | 'AFN';
  type: 'sale' | 'rent';
  status: 'verified' | 'pending' | 'placeholder';
  features: {
    beds: number;
    baths: number;
    area: number; // sq meters
  };
  images: string[];
  description: Record<Language, string>;
  verificationData: {
    deedChecked: boolean;
    identityVerified: boolean;
    lawyerApproved: boolean;
  };
}

export interface BuildingDesign {
  id: string;
  category: 'modern' | 'luxury' | 'family' | 'traditional';
  title: Record<Language, string>;
  description: Record<Language, string>;
  estPrice: number; // Estimated construction cost
  features: {
    beds: number;
    baths: number;
    area: number; // sq meters
    levels: number;
  };
  images: string[];
}

export interface TranslationSchema {
  nav: {
    home: string;
    listings: string;
    construction: string;
    services: string;
    about: string;
    contact: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    viewListings: string;
    trustTitle: string;
    trustSubtitle: string;
    featuredTitle: string;
    viewAllAssets: string;
    verificationBadge: string;
  };
  status: {
    verified: string;
    verifiedAgent: string;
    deedChecked: string;
    placeholder: string;
  };
  details: {
    price: string;
    area: string;
    beds: string;
    baths: string;
    levels: string;
    contactWhatsApp: string;
    inquire: string;
    requestBuild: string;
    viewPlan: string;
  };
  construction: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterModern: string;
    filterLuxury: string;
    filterFamily: string;
    azServiceTitle: string;
    azServiceDesc: string;
    partnerTitle: string;
    partnerDesc: string;
    partnerCta: string;
  };
}
