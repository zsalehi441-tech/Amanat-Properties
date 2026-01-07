
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
        <div className="absolute top-4 right-4 flex gap-2">
          {property.status === 'verified' && (
            <div className="bg-brand-emerald text-white px-3 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.9L9.03 17.003a2 2 0 003.44 0L19.337 4.9a2 2 0 00-1.72-2.9H3.886a2 2 0 00-1.72 2.9z" />
              </svg>
              {t.status.verified}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-gold transition-colors">
            {property.title[lang]}
          </h3>
          <p className="text-brand-gold font-bold">
            ${property.price.toLocaleString()}
          </p>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {property.location[lang]}
        </p>
        
        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-brand-charcoal pt-4 text-xs text-slate-500 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500">{t.details.beds}:</span>
            <span className="font-bold">{property.features.beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500">{t.details.baths}:</span>
            <span className="font-bold">{property.features.baths}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500">{t.details.area}:</span>
            <span className="font-bold">{property.features.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
