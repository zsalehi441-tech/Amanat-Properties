
import React, { useState, useEffect } from 'react';
import { Language, BuildingDesign } from '../types';
import { translations } from '../translations';
import AmanatLogo from '../components/AmanatLogo';

interface Props {
  lang: Language;
}

const Construction: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [designs, setDesigns] = useState<BuildingDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [bedsFilter, setBedsFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('low');

  useEffect(() => {
    fetch('/data/designs.json')
      .then(res => res.json())
      .then(data => {
        setDesigns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load designs", err);
        setLoading(false);
      });
  }, []);

  const filteredDesigns = designs
    .filter(d => {
      const matchCategory = filter === 'all' || d.category === filter;
      const matchArea = areaFilter === 'all' ||
        (areaFilter === 'small' && d.features.area < 300) ||
        (areaFilter === 'medium' && d.features.area >= 300 && d.features.area <= 600) ||
        (areaFilter === 'large' && d.features.area > 600);
      const matchBeds = bedsFilter === 'all' || d.features.beds >= parseInt(bedsFilter);

      return matchCategory && matchArea && matchBeds;
    })
    .sort((a, b) => sort === 'low' ? a.estPrice - b.estPrice : b.estPrice - a.estPrice);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 animate-fade-in bg-slate-50 dark:bg-brand-dark min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <header className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tight">
            {t.construction.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            {t.construction.subtitle}
          </p>
        </header>

        {/* Filters & Sorting */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-12 bg-white dark:bg-brand-navy p-6 border border-slate-200 dark:border-brand-charcoal shadow-sm">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'all', label: t.construction.filterAll },
              { id: 'modern', label: t.construction.filterModern },
              { id: 'family', label: t.construction.filterFamily },
              { id: 'luxury', label: t.construction.filterLuxury }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all rounded-full border ${filter === f.id
                  ? 'bg-brand-gold border-brand-gold text-brand-dark'
                  : 'bg-transparent border-slate-200 dark:border-brand-charcoal text-slate-500 hover:border-brand-gold hover:text-brand-gold'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Area Filter */}
            <select
              value={areaFilter}
              className="bg-transparent border-b border-slate-300 dark:border-brand-charcoal py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-gold text-slate-600 dark:text-slate-300 cursor-pointer"
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="all">{lang === Language.ENGLISH ? "Any Size" : "هر متراژ"}</option>
              <option value="small">{lang === Language.ENGLISH ? "< 300 m²" : "کمتر از ۳۰۰ متر"}</option>
              <option value="medium">{lang === Language.ENGLISH ? "300 - 600 m²" : "۳۰۰ تا ۶۰۰ متر"}</option>
              <option value="large">{lang === Language.ENGLISH ? "> 600 m²" : "بیشتر از ۶۰۰ متر"}</option>
            </select>

            {/* Beds Filter */}
            <select
              value={bedsFilter}
              className="bg-transparent border-b border-slate-300 dark:border-brand-charcoal py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-gold text-slate-600 dark:text-slate-300 cursor-pointer"
              onChange={(e) => setBedsFilter(e.target.value)}
            >
              <option value="all">{lang === Language.ENGLISH ? "Any Beds" : "تعداد اتاق"}</option>
              <option value="3">{lang === Language.ENGLISH ? "3+ Beds" : "۳+ اتاق"}</option>
              <option value="5">{lang === Language.ENGLISH ? "5+ Beds" : "۵+ اتاق"}</option>
              <option value="7">{lang === Language.ENGLISH ? "7+ Beds" : "۷+ اتاق"}</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-b border-slate-300 dark:border-brand-charcoal py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-gold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <option value="low">{lang === Language.ENGLISH ? "Price: Low to High" : "قیمت: از کم به زیاد"}</option>
              <option value="high">{lang === Language.ENGLISH ? "Price: High to Low" : "قیمت: از زیاد به کم"}</option>
            </select>
          </div>
        </div>

        {/* Designs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal group shadow-lg transition-all hover:border-brand-gold/40">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-brand-dark">
                <img
                  src={design.images[0]}
                  alt={design.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-sm text-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-xl">
                  {lang === Language.ENGLISH ? design.category : (design.category === 'luxury' ? 'لوکس' : 'مدرن')}
                </div>
                <div className="absolute top-4 right-4 bg-brand-gold text-brand-dark font-bold text-xs px-3 py-1.5 shadow-xl">
                  ${(design.estPrice / 1000000).toFixed(1)}M+
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide group-hover:text-brand-gold transition-colors">
                    {design.title[lang]}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed h-10 overflow-hidden line-clamp-2 italic">
                    {design.description[lang]}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 border-y border-slate-100 dark:border-brand-charcoal/50 py-5">
                  <div className="text-center">
                    <div className="text-slate-900 dark:text-white font-bold text-sm mb-1">{design.features.area} m²</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest">{t.details.area}</div>
                  </div>
                  <div className="text-center border-x border-slate-100 dark:border-brand-charcoal/50">
                    <div className="text-slate-900 dark:text-white font-bold text-sm mb-1">{design.features.beds}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest">{t.details.beds}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-900 dark:text-white font-bold text-sm mb-1">{design.features.baths}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest">{t.details.baths}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`https://wa.me/93791606227?text=Salam, I want to inquire about the build for Design ID: ${design.id}`}
                    className="flex-1 bg-brand-gold text-brand-dark py-3 font-bold text-[10px] uppercase tracking-widest text-center shadow-lg hover:scale-105 transition-all"
                  >
                    {t.details.requestBuild}
                  </a>
                  <a
                    href={`https://wa.me/93791606227?text=Salam, I want to buy the architectural plan for Design ID: ${design.id}`}
                    className="flex-1 bg-slate-900 dark:bg-brand-dark text-white py-3 font-bold text-[10px] uppercase tracking-widest text-center shadow-lg hover:bg-slate-800 transition-all"
                  >
                    {lang === Language.ENGLISH ? "Buy Plan (PDF)" : "خرید نقشه (PDF)"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Ongoing Projects Section */}
        <section className="mb-24">
          <header className="mb-12 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-200 dark:border-brand-charcoal pb-8">
            <div>
              <div className="text-brand-gold text-xs font-bold tracking-[0.4em] uppercase mb-4">Live Status</div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                {lang === Language.ENGLISH ? "Ongoing Projects" : "پروژه‌های در حال اجرا"}
              </h2>
            </div>
            <div className="text-slate-500 text-sm font-mono">
              {lang === Language.ENGLISH ? "Real-time construction updates" : "بروزرسانی لحظه‌ای ساخت و ساز"}
            </div>
          </header>

          <div className="text-center py-24 bg-white/50 dark:bg-brand-navy/20 border border-dashed border-slate-300 dark:border-brand-charcoal">
            <p className="text-slate-500 uppercase tracking-[0.3em] font-bold text-xs mb-4">
              {lang === Language.ENGLISH
                ? "No ongoing projects currently listed."
                : "در حال حاضر هیچ پروژه‌ای در حال اجرا ثبت نشده است."}
            </p>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">
              {lang === Language.ENGLISH
                ? "Real-time verification and site tracking will appear here."
                : "تایید لحظه‌ای و ردیابی سایت در اینجا ظاهر خواهد شد."}
            </p>
          </div>
        </section>

        {/* A-Z Service Section */}
        <section className="bg-brand-dark dark:bg-brand-navy p-12 md:p-24 border border-brand-gold/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl -mr-32 -mt-32 rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl">
              <div className="inline-block px-4 py-1.5 border border-brand-gold/30 text-brand-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-8">
                Institutional Development
              </div>
              <h2 className="text-4xl font-bold mb-8 text-white leading-tight uppercase tracking-tight">
                {t.construction.azServiceTitle}
              </h2>
              <p className="text-slate-400 mb-12 leading-relaxed text-lg font-light">
                {t.construction.azServiceDesc}
              </p>
              <div className="flex flex-wrap gap-8 mb-12">
                {[
                  { label: lang === Language.ENGLISH ? 'Choose Design' : 'انتخاب طرح', val: '01' },
                  { label: lang === Language.ENGLISH ? 'Customize' : 'تغییرات دیزاین', val: '02' },
                  { label: lang === Language.ENGLISH ? 'Land Acquisition' : 'خرید زمین', val: '03' },
                  { label: lang === Language.ENGLISH ? 'Build' : 'ساخت و ساز', val: '04' }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-brand-gold font-bold text-xl">{step.val}</span>
                    <span className="text-slate-500 text-xs uppercase tracking-widest">{step.label}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/93791606227?text=I am interested in Amanat A-Z Construction services."
                className="inline-block bg-brand-gold text-brand-dark px-14 py-5 font-bold text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
              >
                {lang === Language.ENGLISH ? "Request Consultation" : "درخواست مشاوره رایگان"}
              </a>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-brand-dark/50 border border-brand-gold/10 p-12 flex flex-col items-center justify-center text-center shadow-inner group">
              <AmanatLogo size={120} className="mb-10 opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
              <p className="text-[10px] text-brand-gold/40 font-bold leading-loose tracking-[0.5em] uppercase italic">
                {lang === Language.ENGLISH ? "Engineering excellence. Archival security." : "تعالی مهندسی. امنیت آرشیف."}
              </p>
            </div>
          </div>
        </section>

        {/* Partner Application Section */}
        <section className="mt-24 mb-12 bg-slate-900 dark:bg-black text-white p-12 rounded-2xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-brand-gold/10 pattern-grid-lg opacity-20"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tight text-white">
              {t.construction.partnerTitle}
            </h2>
            <p className="text-slate-400 mb-10 text-lg font-light leading-relaxed">
              {t.construction.partnerDesc}
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdzN2X5AgVxTbAW-Ihmvp1FVubyIZ-SyKVfhX0F2_htDj6k4Q/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-brand-dark px-12 py-4 font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-gold transition-colors duration-300"
            >
              {t.construction.partnerCta}
            </a>
            <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest">
              {lang === Language.ENGLISH ? "Secure Verification via Google Forms" : "بررسی امن توسط گوگل فرم"}
            </p>
          </div>
        </section>
      </div >
    </div >
  );
};

export default Construction;
