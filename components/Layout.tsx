
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
              <p className="text-brand-gold text-xl font-bold mb-4 tracking-widest uppercase">info@amanat.af</p>
              <div className="flex justify-center gap-8 mt-10">
                <a href="https://wa.me/93791606227" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">WhatsApp</a>
                <a href="https://www.instagram.com/amanat_properties" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-brand-gold transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">Instagram</a>
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
