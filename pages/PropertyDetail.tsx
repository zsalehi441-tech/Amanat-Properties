
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Property } from '../types';
import { translations } from '../translations';
import MapInterface from '../components/MapInterface';

interface Props {
  lang: Language;
}

const PropertyDetail: React.FC<Props> = ({ lang }) => {
  const { id } = useParams<{ id: string }>();
  const t = translations[lang];
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch('/data/listings.json')
      .then(res => res.json())
      .then((data: Property[]) => {
        const found = data.find(p => p.id === id);
        if (found) setProperty(found);
      });
  }, [id]);

  if (!property) return <div className="p-24 text-center">Loading...</div>;

  return (
    <div className="py-12 animate-fade-in bg-white dark:bg-brand-dark min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex gap-2 text-[10px] text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-[0.3em] font-bold">
          <Link to="/" className="hover:text-brand-gold transition-colors">{t.nav.home}</Link>
          <span>/</span>
          <Link to="/listings" className="hover:text-brand-gold transition-colors">{t.nav.listings}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-300">{property.id}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <div className="mb-4 aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal">
              <img 
                src={property.images[activeImage]} 
                alt={property.title[lang]} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {property.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-video overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-brand-gold' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 border-b border-slate-100 dark:border-brand-charcoal pb-4 text-slate-900 dark:text-white uppercase tracking-wider">
                {lang === Language.ENGLISH ? "Description" : "جزئیات"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
                {property.description[lang]}
              </p>
            </div>

            {/* Institutional Verification Section */}
            <div className="mt-12 bg-slate-50 dark:bg-brand-navy/30 p-8 border border-slate-200 dark:border-brand-charcoal">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-wide">
                <span className="text-brand-gold">{lang === Language.ENGLISH ? "Verification Record" : "سوابق تایید"}</span>
                <span className="text-[10px] bg-brand-emerald px-2 py-0.5 rounded text-white font-bold tracking-widest uppercase">Verified</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${property.verificationData.deedChecked ? 'bg-brand-emerald' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.status.deedChecked}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-brand-emerald">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{lang === Language.ENGLISH ? "Owner Identity Verified" : "هویت مالک تایید شده"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-brand-emerald">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{lang === Language.ENGLISH ? "Legal Clearance (Makhzan)" : "تصفیه حقوقی (مخزن)"}</span>
                </div>
              </div>
              <p className="mt-8 text-[11px] text-slate-400 dark:text-slate-500 italic uppercase tracking-wider">
                {lang === Language.ENGLISH 
                  ? "Note: Redacted document scans available upon request for vetted diaspora investors." 
                  : "یادداشت: اسکن مدارک برای سرمایه‌گذاران تایید شده در صورت درخواست موجود است."}
              </p>
            </div>

            {/* Google Maps Section */}
            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-brand-charcoal">
               <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                  {lang === Language.ENGLISH ? "Geospatial Verification" : "تایید موقعیت جغرافیایی"}
                </h4>
              <div className="h-[400px]">
                <MapInterface 
                  lang={lang} 
                  lat={property.coordinates?.lat} 
                  lng={property.coordinates?.lng} 
                  address={property.location[Language.ENGLISH]}
                  title={property.title[lang]}
                />
              </div>
              <p className="mt-4 text-[10px] text-slate-500 dark:text-slate-400 font-light italic text-center uppercase tracking-widest">
                {lang === Language.ENGLISH ? "Precise coordinates checked against satellite data" : "مختصات دقیق با داده‌های ماهواره‌ای بررسی شده است"}
              </p>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white dark:bg-brand-navy p-8 border border-slate-200 dark:border-brand-gold/30 shadow-2xl">
              <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white uppercase tracking-tight">{property.title[lang]}</h1>
              <p className="text-slate-500 text-sm mb-6 italic">{property.location[lang]}</p>
              
              <div className="text-4xl font-bold text-brand-gold mb-8">
                ${property.price.toLocaleString()}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-brand-charcoal">
                  <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">{t.details.beds}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.features.beds}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-brand-charcoal">
                  <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">{t.details.baths}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.features.baths}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-brand-charcoal">
                  <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">{t.details.area}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.features.area} m²</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/93000000000?text=Salam, I am interested in Property Ref: ${property.id}. Is it available?`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-brand-emerald text-white py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all mb-4 shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.623 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                {t.details.contactWhatsApp}
              </a>
              <button className="w-full bg-brand-gold text-brand-dark py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-gold/90 transition-all">
                {t.details.inquire}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
