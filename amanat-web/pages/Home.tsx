
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Language, Property } from '../types';
import { translations } from '../translations';
import AmanatLogo from '../components/AmanatLogo';

interface Props {
  lang: Language;
  isDarkMode: boolean;
}

const Home: React.FC<Props> = ({ lang, isDarkMode }) => {
  const t = translations[lang];
  const [saleProperties, setSaleProperties] = useState<Property[]>([]);
  const [rentProperties, setRentProperties] = useState<Property[]>([]);
  const [gerawiProperties, setGerawiProperties] = useState<Property[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    fetch('/data/listings.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSaleProperties(data.filter((p: Property) => p.type === 'sale' && p.is_featured).slice(0, 4));
          setRentProperties(data.filter((p: Property) => p.type === 'rent' && p.is_featured).slice(0, 4));
          setGerawiProperties(data.filter((p: Property) => p.type === 'gerawi' && p.is_featured).slice(0, 4));
        }
      })
      .catch(err => console.error("Error loading properties", err));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-100 dark:bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover opacity-20 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-brand-dark dark:via-brand-dark/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-5 py-2 border border-brand-gold/50 text-brand-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-8">
              {lang === Language.ENGLISH ? "Forensic Real Estate Verification" : "تایید تخصصی املاک و مستغلات"}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-slate-900 dark:text-white tracking-tight uppercase">
              {t.home.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/listings"
                className="bg-brand-gold text-brand-dark px-12 py-5 font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-gold/90 transition-all shadow-xl"
              >
                {t.home.viewListings}
              </Link>
              <Link
                to="/services"
                className="bg-transparent border border-slate-900 dark:border-white/10 text-slate-900 dark:text-white px-12 py-5 font-bold text-xs uppercase tracking-[0.3em] hover:border-brand-gold hover:text-brand-gold transition-all"
              >
                {t.nav.services}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Sections */}
      {[
        { title: t.home.saleSectionTitle, properties: saleProperties },
        { title: t.home.rentSectionTitle, properties: rentProperties },
        { title: t.home.gerawiSectionTitle, properties: gerawiProperties }
      ].map((section, idx) => section.properties.length > 0 && (
        <section key={idx} className={`py-24 ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-brand-navy/30' : 'bg-white dark:bg-brand-dark'} border-b border-slate-100 dark:border-brand-charcoal/30`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{section.title}</h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm tracking-wide uppercase">{lang === Language.ENGLISH ? "Curated Institutional Inventory" : "فهرست منتخب نهادی"}</p>
              </div>
              <Link to="/listings" className="hidden md:block text-brand-gold text-xs font-bold uppercase tracking-[0.3em] hover:underline underline-offset-8 transition-all">
                {t.home.viewAllAssets} →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
              {section.properties.map((property) => (
                <div key={property.id} className="bg-white dark:bg-brand-dark border border-slate-100 dark:border-brand-charcoal group shadow-xl dark:shadow-2xl transition-all hover:border-brand-gold/40">
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-brand-navy">
                    <img
                      src={property.images[0]}
                      alt={property.title[lang]}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-brand-navy/90 backdrop-blur-sm border border-white/10 text-brand-gold px-3 py-1 rounded-sm text-[10px] font-bold shadow-lg tracking-widest uppercase">
                        {property.type === 'sale' ? t.status.saleType : property.type === 'rent' ? t.status.rentType : t.status.gerawiType}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {property.status !== 'placeholder' && (
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
                    <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border border-slate-100 dark:border-brand-charcoal px-4 py-2 text-brand-gold font-bold text-lg">
                      {property.price ? `${property.currency === 'USD' ? '$' : 'AFN '} ${property.price.toLocaleString()}` : (lang === Language.ENGLISH ? "Price on Request" : "تماس بگیرید")}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide group-hover:text-brand-gold transition-colors">{property.title[lang]}</h3>
                      <p className="text-slate-400 dark:text-slate-500 text-sm font-light italic">{property.location[lang]}</p>
                    </div>

                    <div className="flex justify-between items-center mb-8 border-y border-slate-100 dark:border-brand-charcoal/50 py-4 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5 font-bold rtl:flex-row-reverse">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${property.active_status === 'Sold' || property.active_status === 'Rented' ? 'bg-red-500' : property.active_status === 'In Negotiation' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                        <span className={`${property.active_status === 'Sold' || property.active_status === 'Rented' ? 'text-red-600 dark:text-red-500' : property.active_status === 'In Negotiation' ? 'text-orange-600 dark:text-orange-500' : 'text-green-600 dark:text-green-500'}`}>
                          {property.active_status === 'Sold' ? t.status.sold : property.active_status === 'Rented' ? t.status.rented : property.active_status === 'In Negotiation' ? t.status.inNegotiation : t.status.available}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 md:gap-8">
                        <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-white font-bold text-sm">{property.features.area} m²</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.details.area}</span>
                        </div>
                        {property.features.beds > 0 && (
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-bold text-sm">{property.features.beds}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.details.beds}</span>
                          </div>
                        )}
                        {property.features.baths > 0 && (
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-bold text-sm">{property.features.baths}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.details.baths}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/property/${property.id}`}
                      className="inline-block w-full bg-slate-50 dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal text-slate-900 dark:text-white px-6 py-3.5 font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all text-center"
                    >
                      {lang === Language.ENGLISH ? "View Details" : "مشاهده جزئیات"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                to="/listings"
                className="bg-transparent border border-brand-gold text-brand-gold px-16 py-5 font-bold text-xs uppercase tracking-[0.4em] hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl"
              >
                {lang === Language.ENGLISH ? "View More Listings" : "مشاهده املاک بیشتر"}
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Verification Protocol Section */}
      <section className="py-32 bg-white dark:bg-brand-dark border-y border-slate-100 dark:border-brand-charcoal/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white uppercase tracking-tight">
                {lang === Language.ENGLISH ? "The Verification Protocol" : "پروتکل تایید اسناد"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-12 leading-relaxed text-lg font-light">
                {lang === Language.ENGLISH
                  ? "Property transactions demand absolute certainty. Amanat operates an uncompromising institutional protocol to insulate your capital from market risks and guarantee legal sovereignty."
                  : "معاملات ملکی نیازمند اطمینان مطلق است. امانت یک پروتکل نهادی سازش‌ناپذیر را برای محافظت از سرمایه شما در برابر خطرات بازار و تضمین حاکمیت قانونی اجرا می‌کند."}
              </p>

              <div className="space-y-12">
                <div className="flex gap-8 group">
                  <div className="text-4xl font-bold text-brand-gold/20 group-hover:text-brand-gold transition-colors duration-500">01</div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-wider">{lang === Language.ENGLISH ? "Chain of Custody" : "زنجیره مالکیت"}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-light">{lang === Language.ENGLISH ? "Rigorous forensic analysis of historical ownership and Qaryadar documentation to ensure a flawless, legitimate transfer history." : "تجزیه و تحلیل دقیق و تخصصی مالکیت‌های تاریخی و اسناد قریه‌دار برای اطمینان از تاریخچه انتقال بی‌نقص و قانونی."}</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="text-4xl font-bold text-brand-gold/20 group-hover:text-brand-gold transition-colors duration-500">02</div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-wider">{lang === Language.ENGLISH ? "Government Archival Audit" : "حساب‌رسی آرشیف دولتی"}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-light">{lang === Language.ENGLISH ? "Direct cross-referencing with municipal master plans to verify the land is cleared for private ownership and immune from state projects." : "تطبیق مستقیم با پلان‌های جامع شهری برای تایید اینکه زمین برای مالکیت خصوصی پاکسازی شده و از پروژه‌های دولتی مصون است."}</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="text-4xl font-bold text-brand-gold/20 group-hover:text-brand-gold transition-colors duration-500">03</div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-wider">{lang === Language.ENGLISH ? "Physical Survey" : "بررسی فزیکی"}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-light">{lang === Language.ENGLISH ? "On-ground site inspection to verify boundaries and structural health." : "بازرسی فزیکی در محل برای تایید مرزها و سلامت ساختاری ملک."}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-50 dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal p-12 flex flex-col items-center justify-center text-center shadow-xl dark:shadow-2xl">
                <div className="w-48 h-48 border-4 border-brand-gold/10 rounded-full flex items-center justify-center mb-8 bg-white dark:bg-brand-dark/50 shadow-inner">
                  <AmanatLogo size={120} hideText={true} isDarkMode={isDarkMode} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-[0.2em]">{lang === Language.ENGLISH ? "Amanat Verified" : "تایید شده امانت"}</h3>
                <p className="text-slate-500 text-sm tracking-wide font-light">
                  {lang === Language.ENGLISH
                    ? "Institutional grade verification status for every Amanat listing."
                    : "وضعیت تایید نهادی برای هر ملک در لست‌های امانت."}
                </p>
                <div className="mt-12 text-[10px] text-brand-gold/40 tracking-[0.5em] uppercase border-t border-slate-200 dark:border-brand-charcoal pt-8 w-full font-bold">
                  Forensic Document Audit Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-32 bg-slate-50 dark:bg-brand-dark">
        <div className="container mx-auto px-4 text-center mb-20">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white tracking-[0.4em] uppercase">{t.home.trustTitle}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">{t.home.trustSubtitle}</p>
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          {[
            {
              title: lang === Language.ENGLISH ? "Legal Sovereignty" : "حاکمیت قانونی",
              desc: lang === Language.ENGLISH ? "Every listing is verified through the Amanat Verification Protocol, giving deed fraud no chance at all." : "هر ملک از طریق پروتکل تایید امانت بررسی می‌شود تا خطر جعل قباله از بین برود.",
              icon: "⚖️"
            },
            {
              title: lang === Language.ENGLISH ? "Institutional Guard" : "حفاظت نهادی",
              desc: lang === Language.ENGLISH ? "We act as your verifier on the ground, providing 'proof of life' for every property." : "ما به عنوان تاییدکننده شما در محل عمل می‌کنیم و «ثبوت حیات» برای هر ملک ارائه می‌دهیم.",
              icon: "🏛️"
            },
            {
              title: lang === Language.ENGLISH ? "Diaspora Bridge" : "پل ارتباطی دیاسپورا",
              desc: lang === Language.ENGLISH ? "Specialized remote management and secure transaction handling for the Afghan diaspora." : "مدیریت از راه دور تخصصی و انجام معاملات امن برای افغان‌های خارج از کشور.",
              icon: "🌍"
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-white dark:bg-brand-navy p-12 border border-slate-100 dark:border-brand-charcoal hover:border-brand-gold/30 transition-all group shadow-sm dark:shadow-xl">
              <div className="text-4xl mb-8 group-hover:scale-110 transition-transform">{pillar.icon}</div>
              <h3 className="text-xl font-bold mb-6 text-brand-gold uppercase tracking-widest">{pillar.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Office Map Section */}
      <section className="py-32 bg-slate-50 dark:bg-brand-navy relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white dark:bg-brand-dark border border-slate-200 dark:border-brand-gold/10 p-4 md:p-8 flex flex-col items-center justify-center shadow-2xl min-h-[500px] relative">
            {!isMapLoaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-brand-navy group">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 bg-white dark:bg-brand-dark rounded-full border border-slate-200 dark:border-brand-charcoal flex items-center justify-center shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-10 h-10 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tight">
                  {lang === Language.ENGLISH ? "Visit Our Office" : "بازدید از دفتر ما"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg mb-8 font-light leading-relaxed">
                  {lang === Language.ENGLISH 
                    ? "Amanat Real Estate HQ - Sang-e-Masha, Jaghori, Ghazni" 
                    : "دفتر مرکزی امانت املاک - سنگ‌ماشه، جاغوری، غزنی"}
                </p>
                <button 
                  onClick={() => setIsMapLoaded(true)}
                  className="bg-brand-gold text-brand-dark px-12 py-5 font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-gold/90 transition-all shadow-xl flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {lang === Language.ENGLISH ? "Load Interactive Map" : "بارگیری نقشه تعاملی"}
                </button>
              </div>
            ) : (
              <iframe
                title="Amanat Office Location"
                width="100%"
                height="500"
                style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2)' }}
                loading="lazy"
                allowFullScreen
                src="https://maps.google.com/maps?q=33.13892,67.43967&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="opacity-90 grayscale hover:grayscale-0 transition-all duration-1000"
              ></iframe>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
