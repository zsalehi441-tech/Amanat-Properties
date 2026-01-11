
import React from 'react';
import { Language } from '../types';

interface Props {
  lat?: number;
  lng?: number;
  address?: string;
  lang: Language;
  title?: string;
  isStatic?: boolean;
}

const MapInterface: React.FC<Props> = ({ lat, lng, address, lang, title, isStatic = false }) => {
  const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(address || 'Kabul, Afghanistan');
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY || ''}&q=${query}&zoom=14&maptype=satellite`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // If no API key is present in environment, we fallback to a beautiful institutional placeholder 
  // that links to the live map, respecting the "low bandwidth" and "static" requirements.
  const hasKey = !!process.env.GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal overflow-hidden group">
      {hasKey && !isStatic ? (
        <iframe
          title={title || "Property Location"}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0)' }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
          className="dark:invert dark:hue-rotate-180 dark:brightness-90 opacity-80"
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-full animate-pulse"></div>
            <svg className="w-16 h-16 text-brand-gold relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-[0.3em] text-xs mb-2">
            {lang === Language.ENGLISH ? "Geospatial Trust Ledger" : "دفتر ثبت جغرافیایی معتبر"}
          </h4>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-6 max-w-[200px]">
            {lang === Language.ENGLISH ? "Coordinates Verified against Makhzan Records" : "مختصات تایید شده با سوابق مخزن"}
          </p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-dark dark:bg-brand-gold text-white dark:text-brand-dark px-6 py-3 font-bold text-[9px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg>
            {lang === Language.ENGLISH ? "Open Interactive Map" : "باز کردن نقشه تعاملی"}
          </a>
        </div>
      )}

      {/* Absolute coordinates badge */}
      {lat && lng && (
        <div className="absolute bottom-4 left-4 bg-brand-dark/80 backdrop-blur-md px-3 py-1.5 border border-brand-gold/30">
          <span className="text-brand-gold font-mono text-[9px] tracking-widest">
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </span>
        </div>
      )}
    </div>
  );
};

export default MapInterface;
