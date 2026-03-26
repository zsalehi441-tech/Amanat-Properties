
import React from 'react';
import { Link } from 'react-router-dom';
import { Property, Language } from '../types';
import { translations } from '../translations';

interface Props {
  property: Property;
  lang: Language;
}

const PropertyCard: React.FC<Props> = ({ property, lang }) => {
  const t = translations[lang];

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block bg-white dark:bg-brand-navy border border-slate-100 dark:border-brand-charcoal overflow-hidden hover:border-brand-gold transition-all duration-300 shadow-sm dark:shadow-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title[lang]}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-brand-navy/90 backdrop-blur-sm border border-white/10 text-brand-gold px-3 py-1 rounded-sm text-[10px] font-bold shadow-lg tracking-widest uppercase">
            {property.type === 'sale' ? t.status.saleType : property.type === 'rent' ? t.status.rentType : t.status.gerawiType}
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {property.status === 'sold' && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 shadow-lg tracking-widest uppercase">
              {t.status.sold}
            </div>
          )}
          {property.status !== 'sold' && property.status !== 'placeholder' && (
            <div className="bg-brand-emerald text-white px-3 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 shadow-lg">
              {property.negotiable ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  {t.status.negotiable}
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  {t.status.nonNegotiable}
                </>
              )}
            </div>
          )}
          {property.status === 'placeholder' && (
            <div className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-sm text-[11px] font-bold tracking-widest shadow-xl uppercase z-10">
              {t.status.placeholder}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-gold transition-colors line-clamp-2">
            {property.title[lang]}
          </h3>
          <p className="text-brand-gold font-bold whitespace-nowrap">
            {property.price ? `${property.currency === 'USD' ? '$' : 'AFN '} ${property.price.toLocaleString()}` : (lang === Language.ENGLISH ? "Price on Request" : "تماس بگیرید")}
          </p>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {property.location[lang]}
        </p>

        <div className="flex justify-between items-center border-t border-slate-100 dark:border-brand-charcoal pt-4 text-[10px] md:text-xs text-slate-500 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold rtl:flex-row-reverse">
            <span className={`w-2 h-2 rounded-full animate-pulse ${property.active_status === 'Sold' || property.active_status === 'Rented' ? 'bg-red-500' : property.active_status === 'In Negotiation' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
            <span className={`${property.active_status === 'Sold' || property.active_status === 'Rented' ? 'text-red-600 dark:text-red-500' : property.active_status === 'In Negotiation' ? 'text-orange-600 dark:text-orange-500' : 'text-green-600 dark:text-green-500'}`}>
              {property.active_status === 'Sold' ? t.status.sold : property.active_status === 'Rented' ? t.status.rented : property.active_status === 'In Negotiation' ? t.status.inNegotiation : t.status.available}
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
          {Boolean(property.features.beds) && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-500">{t.details.beds}:</span>
              <span className="font-bold">{property.features.beds}</span>
            </div>
          )}
          {Boolean(property.features.baths) && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-500">{t.details.baths}:</span>
              <span className="font-bold">{property.features.baths}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500">{t.details.area}:</span>
            <span className="font-bold">{property.features.area} m²</span>
          </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
