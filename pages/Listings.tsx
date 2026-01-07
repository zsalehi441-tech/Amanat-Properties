
import React, { useState, useEffect } from 'react';
import { Language, Property } from '../types';
import { translations } from '../translations';
import PropertyCard from '../components/PropertyCard';
import { provinces } from '../constants/provinces';
import MapInterface from '../components/MapInterface';

interface Props {
  lang: Language;
}

const Listings: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    fetch('./data/listings.json')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load listings", err);
        setLoading(false);
      });
  }, []);

  const filteredProperties = selectedProvince === 'all'
    ? properties
    : properties.filter(p => p.location.city.toLowerCase() === selectedProvince.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-20 animate-fade-in bg-white dark:bg-brand-dark min-h-screen">
      <div className="container mx-auto px-4">
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold mb-4 uppercase tracking-tight text-slate-900 dark:text-white">{t.nav.listings}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-light italic">
                {lang === Language.ENGLISH
                  ? "Exclusive, verified institutional inventory across all provinces."
                  : "فهرست اختصاصی و تایید شده املاک در تمام ولایات."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-slate-100 dark:bg-brand-navy p-1 border border-slate-200 dark:border-brand-charcoal">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${viewMode === 'grid' ? 'bg-brand-gold text-brand-dark shadow-lg' : 'text-slate-500 hover:text-brand-gold'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${viewMode === 'map' ? 'bg-brand-gold text-brand-dark shadow-lg' : 'text-slate-500 hover:text-brand-gold'}`}
                >
                  Map
                </button>
              </div>

              <div className="flex gap-4">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-700 dark:text-white focus:outline-none focus:border-brand-gold min-w-[160px] shadow-sm"
                >
                  <option value="all">{lang === Language.ENGLISH ? "All Provinces" : "همه ولایات"}</option>
                  {provinces.map(prov => (
                    <option key={prov.id} value={prov.names[Language.ENGLISH]}>
                      {prov.names[lang]}
                    </option>
                  ))}
                </select>
                <select className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-700 dark:text-white focus:outline-none focus:border-brand-gold shadow-sm">
                  <option>{lang === Language.ENGLISH ? "Price: High to Low" : "قیمت: از زیاد به کم"}</option>
                  <option>{lang === Language.ENGLISH ? "Price: Low to High" : "قیمت: از کم به زیاد"}</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="h-[70vh] border border-slate-200 dark:border-brand-charcoal shadow-2xl">
            <MapInterface
              lang={lang}
              isStatic={false}
              address={selectedProvince === 'all' ? "Afghanistan" : selectedProvince}
              title="Verified Asset Ledger"
            />
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-32 bg-slate-50 dark:bg-brand-navy/10 border border-dashed border-slate-300 dark:border-brand-charcoal">
            <div className="w-20 h-20 mx-auto mb-8 opacity-20 text-brand-gold">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>
            <p className="text-slate-500 uppercase tracking-[0.3em] font-bold text-xs mb-4">
              {lang === Language.ENGLISH
                ? `Currently no verified listings in ${selectedProvince}.`
                : `در حال حاضر هیچ ملک تایید شده ای در ${selectedProvince} موجود نیست.`}
            </p>
            <p className="text-[10px] mt-2 opacity-60 max-w-sm mx-auto uppercase tracking-widest leading-loose">
              {lang === Language.ENGLISH
                ? "Our forensic team is currently vetting assets in this region. Check back for institutional updates."
                : "تیم ممیزی ما در حال حاضر در حال بررسی دارایی ها در این منطقه است. برای به روز رسانی های نهادی دوباره سر بزنید."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
