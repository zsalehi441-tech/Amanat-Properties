/**
 * Application-wide configuration constants
 * Centralized to avoid hardcoding values across the codebase
 */

// Contact Information
export const WHATSAPP_NUMBER = '93791606227';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Email
export const CONTACT_EMAIL = 'propertiesamanat@gmail.com';

// Social Media
export const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/amanat_properties',
    tiktok: 'https://www.tiktok.com/@amanatproperties',
    youtube: 'https://www.youtube.com/@AmanatProperties-k7w',
    whatsapp: WHATSAPP_URL,
} as const;

// Helper function to create WhatsApp inquiry URL
export const createWhatsAppInquiryUrl = (propertyId: string, lang: 'en' | 'fa' = 'en') => {
    const message = lang === 'en'
        ? `Salam, I am interested in Property Ref: ${propertyId}. Is it available?`
        : `سلام، من علاقمند به ملک با کد: ${propertyId} هستم. آیا موجود است؟`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
};
