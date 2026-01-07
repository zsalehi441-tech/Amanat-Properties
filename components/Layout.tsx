
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';
import AmanatLogo from './AmanatLogo';

interface Props {
  children: React.ReactNode;
  lang: Language;
  onLangChange: (lang: Language) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Layout: React.FC<Props> = ({ children, lang, onLangChange, isDarkMode, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const t = translations[lang];
  const location = useLocation();
  const isRTL = lang !== Language.ENGLISH;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/listings', label: t.nav.listings },
    { path: '/construction', label: t.nav.construction },
    { path: '/services', label: t.nav.services },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isRTL ? 'rtl font-arabic' : 'ltr font-sans'} bg-white dark:bg-brand-dark text-slate-900 dark:text-slate-100`}>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-brand-dark/95 backdrop-blur-md border-b border-slate-100 dark:border-brand-charcoal/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4 h-20">

            {/* Left Side: Switcher & Theme Toggle */}
            <div className="flex items-center gap-6 lg:w-1/4 justify-start">
              <div className="hidden sm:flex items-center gap-4">
                <LanguageSwitcher current={lang} onChange={onLangChange} />
                <button
                  onClick={onThemeToggle}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-colors"
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Center: Main Branding Logo */}
            <div className="flex justify-center items-center flex-grow lg:flex-none">
              <Link to="/" className="group py-1">
                <AmanatLogo
                  className="transition-all duration-500 group-hover:scale-105"
                  size={180}
                />
              </Link>
            </div>

            {/* Right Side: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-end gap-6 xl:gap-8 lg:w-1/4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:text-brand-gold whitespace-nowrap ${location.pathname === link.path ? 'text-brand-gold' : 'text-slate-400 dark:text-slate-500'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={onThemeToggle} className="p-2 text-slate-400">
                {isDarkMode ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300"
              >
                {isMenuOpen ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-brand-dark flex flex-col pt-24 px-6 animate-fade-in">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl uppercase tracking-widest font-bold ${location.pathname === link.path ? 'text-brand-gold' : 'text-slate-400 dark:text-slate-500'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pb-12">
                <LanguageSwitcher current={lang} onChange={(l) => { onLangChange(l); setIsMenuOpen(false); }} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-50 dark:bg-brand-dark py-24 border-t border-slate-100 dark:border-brand-charcoal">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-20">
            <AmanatLogo className="mb-8 opacity-90" size={240} />
            <p className="text-slate-500 max-w-lg text-sm leading-relaxed font-light tracking-wide italic">
              {lang === Language.ENGLISH
                ? "The architecture of trust in Afghan real estate. Verified, vetted, and institutionally secure."
                : "معماری اعتماد در بازار املاک افغانستان. تایید شده، بررسی شده و با امنیت نهادی."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 border-t border-slate-200 dark:border-brand-charcoal/30 pt-20">
            <div className="text-center md:text-right">
              <h3 className="text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-8 opacity-70">{t.nav.services}</h3>
              <ul className="space-y-4 text-[13px] text-slate-500 dark:text-slate-400 font-light tracking-wide">
                <li>{lang === Language.ENGLISH ? "Property Verification" : "تایید اسناد و قباله"}</li>
                <li>{lang === Language.ENGLISH ? "Forensic Document Audit" : "حسابرسی تخصصی اسناد"}</li>
                <li>{lang === Language.ENGLISH ? "Diaspora Acquisition" : "خریداری برای دیاسپورا"}</li>
                <li>{lang === Language.ENGLISH ? "Legal Sovereignty" : "مشاوره حقوقی"}</li>
              </ul>
            </div>

            <div className="text-center order-first md:order-none">
              <h3 className="text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-8 opacity-70">{t.nav.contact}</h3>
              <p className="text-brand-gold text-xl font-bold mb-4 tracking-widest uppercase truncate px-2">propertiesamanat@gmail.com</p>
              <div className="flex justify-center gap-8 mt-10">
                <a href="https://wa.me/93791606227" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-all duration-300 hover:scale-110" aria-label="WhatsApp">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.454c-1.884 0-3.73-.508-5.337-1.467L3 21l.652-4.14A8.995 8.995 0 012.182 12c0-4.962 4.038-9 9-9 4.962 0 9 4.038 9 9 0 4.963-4.038 9-9 9m0-19c-5.514 0-10 4.486-10 10 0 1.81.483 3.513 1.321 4.98L2 22l5.121-1.321A9.914 9.914 0 0011.182 22c5.514 0 10-4.486 10-10 0-5.514-4.486-10-10-10z" /></svg>
                </a>
                <a href="https://www.instagram.com/amanat_properties" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-all duration-300 hover:scale-110" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@amanatproperties" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-all duration-300 hover:scale-110" aria-label="TikTok">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3a2.91 2.91 0 00-1.28 2.02c-.04.42-.04.85.02 1.27.08.62.4 1.21.85 1.63.77.77 1.98 1.05 3.03.68 1.17-.46 1.93-1.67 1.92-2.92.03-5.32-.01-10.64.03-15.96z" /></svg>
                </a>
                <a href="https://www.youtube.com/@AmanatProperties-k7w" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-all duration-300 hover:scale-110" aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-8 opacity-70">{lang === Language.ENGLISH ? "Global Advisory" : "بخش مشورتی جهانی"}</h3>
              <ul className="space-y-4 text-[13px] text-slate-500 dark:text-slate-400 font-light tracking-wide">
                <li>{lang === Language.ENGLISH ? "Kabul Headquarters" : "دفتر مرکزی کابل"}</li>
                <li>{lang === Language.ENGLISH ? "Dubai (Strategic Advisor)" : "دبی (بخش استراتژیک)"}</li>
                <li>{lang === Language.ENGLISH ? "London (Compliance Hub)" : "لندن (مرکز تطبیق اسناد)"}</li>
              </ul>
            </div>
          </div>

          <div className="mt-24 pt-10 border-t border-slate-100 dark:border-brand-charcoal/20 text-center">
            <div className="text-[9px] text-slate-400 dark:text-slate-600 tracking-[0.5em] uppercase font-bold">
              © 2025 AMANAT REAL ESTATE & ADVISORY. ALL ASSETS FORENSICALLY VERIFIED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
