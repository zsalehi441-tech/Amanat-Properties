import React from 'react';
import { Language } from '../types';
import { Link } from 'react-router-dom';

const Services = ({ lang }: { lang: Language }) => {
    const isRTL = lang !== Language.ENGLISH;
    return (
        <div className="py-24 animate-fade-in text-left rtl:text-right">
            <div className="container mx-auto px-4">
                <header className="max-w-3xl mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                        {lang === Language.ENGLISH ? "Institutional Services" : "خدمات نهادی"}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        {lang === Language.ENGLISH
                            ? "Amanat provides a closed-loop security environment for high-value Afghan property transactions."
                            : "امانت یک محیط امنیتی بسته را برای معاملات املاک با ارزش بالا در افغانستان فراهم می‌کند."}
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Service: Verify */}
                    <div className="bg-slate-50 dark:bg-brand-navy p-12 border border-slate-200 dark:border-brand-gold/20 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div>
                            <div className="text-brand-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
                                {lang === Language.ENGLISH ? "Primary Mandate" : "وظیفه اصلی"}
                            </div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">01. Verify</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {lang === Language.ENGLISH
                                    ? "Our forensic document audit checks every deed (Qabala) with the local Qaryadar and the current local government. We eliminate ownership disputes before they begin."
                                    : "حسابرسی تخصصی اسناد ما، هر قباله را در برابر آرشیوهای مرکزی مخزن بررسی می‌کند. ما اختلافات مالکیت را پیش از شروع از بین می‌بریم."}
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-300 border-t border-slate-200 dark:border-brand-charcoal pt-6">
                                <li>• {lang === Language.ENGLISH ? "Amanat verification protocol" : "پروتکل تایید امانت"}</li>
                                <li>• {lang === Language.ENGLISH ? "Physical Property Survey" : "بررسی فزیکی ملک"}</li>
                                <li>• {lang === Language.ENGLISH ? "Owner Identity Verification" : "تایید هویت مالک"}</li>
                            </ul>
                        </div>
                        <a
                            href={`https://wa.me/93791606227?text=${lang === Language.ENGLISH ? "Salam, I want to verify a property." : "سلام، می‌خواهم یک ملک را تایید کنم."}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-block w-full py-4 border border-brand-gold text-brand-gold text-center uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-white transition-all duration-300"
                        >
                            {lang === Language.ENGLISH ? "Start Verification" : "شروع تایید"}
                        </a>
                    </div>

                    {/* Service: Acquisition */}
                    <div className="bg-slate-50 dark:bg-brand-navy p-12 border border-slate-200 dark:border-brand-charcoal flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div>
                            <div className="text-slate-400 text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200 dark:bg-brand-charcoal group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
                                {lang === Language.ENGLISH ? "Diaspora Focused" : "تمرکز بر دیاسپورا"}
                            </div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">02. Buy</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {lang === Language.ENGLISH
                                    ? "Access to off-market, verified inventory. We act as your eyes and legal shield on the ground in Kabul and major provinces."
                                    : "دسترسی به فهرست املاک تایید شده خارج از بازار. ما به عنوان چشم و سپر حقوقی شما در کابل و ولایات بزرگ عمل می‌کنیم."}
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-300 border-t border-slate-200 dark:border-brand-charcoal pt-6">
                                <li>• {lang === Language.ENGLISH ? "Off-Market Sourcing" : "منبع‌یابی خارج از بازار"}</li>
                                <li>• {lang === Language.ENGLISH ? "Price Negotiation Defense" : "دفاع در مذاکره قیمت"}</li>
                                <li>• {lang === Language.ENGLISH ? "Safe Payment Escrow" : "امانت‌داری امن در پرداخت"}</li>
                            </ul>
                        </div>
                        <a
                            href={`https://wa.me/93791606227?text=${lang === Language.ENGLISH ? "Salam, I am interested in buying a property." : "سلام، علاقمند به خرید ملک هستم."}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-block w-full py-4 border border-brand-gold text-brand-gold text-center uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-white transition-all duration-300"
                        >
                            {lang === Language.ENGLISH ? "Start Acquisition" : "شروع خرید"}
                        </a>
                    </div>

                    {/* Service: Design & Build */}
                    <div className="bg-slate-50 dark:bg-brand-navy p-12 border border-slate-200 dark:border-brand-charcoal flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div>
                            <div className="text-slate-400 text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200 dark:bg-brand-charcoal group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
                                {lang === Language.ENGLISH ? "Development" : "توسعه"}
                            </div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">03. Build</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {lang === Language.ENGLISH
                                    ? "High-spec construction following international architectural standards. We manage projects from land acquisition to final finishing."
                                    : "ساخت و ساز با مشخصات بالا مطابق با استانداردهای معماری بین‌المللی. ما پروژه‌ها را از خرید زمین تا تکمیل نهایی مدیریت می‌کنیم."}
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-300 border-t border-slate-200 dark:border-brand-charcoal pt-6">
                                <li>• {lang === Language.ENGLISH ? "Modern Architecture" : "معماری مدرن"}</li>
                                <li>• {lang === Language.ENGLISH ? "Structural Integrity Audit" : "بررسی استحکام ساختاری"}</li>
                                <li>• {lang === Language.ENGLISH ? "Luxury Finishing" : "تزیینات لوکس نهایی"}</li>
                            </ul>
                        </div>
                        <Link
                            to="/construction"
                            className="mt-8 inline-block w-full py-4 border border-brand-gold text-brand-gold text-center uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-white transition-all duration-300"
                        >
                            {lang === Language.ENGLISH ? "View Construction" : "مشاهده ساخت و ساز"}
                        </Link>
                    </div>

                    {/* Service: Divestment */}
                    <div className="bg-slate-50 dark:bg-brand-navy p-12 border border-slate-200 dark:border-brand-charcoal flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div>
                            <div className="text-slate-400 text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200 dark:bg-brand-charcoal group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
                                {lang === Language.ENGLISH ? "Exit Strategy" : "استراتژی خروج"}
                            </div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">04. Sell</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {lang === Language.ENGLISH
                                    ? "Sell your property to verified buyers. We manage the entire legal transfer process to ensure funds are secured and taxes paid."
                                    : "ملک خود را به خریداران تایید شده بفروشید. ما تمام مراحل انتقال قانونی را مدیریت می‌کنیم تا از امنیت پول و پرداخت مالیات اطمینان حاصل شود."}
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-300 border-t border-slate-200 dark:border-brand-charcoal pt-6">
                                <li>• {lang === Language.ENGLISH ? "Qualified Buyer Vetting" : "بررسی صلاحیت خریدار"}</li>
                                <li>• {lang === Language.ENGLISH ? "Tax Compliance Audit" : "بررسی تطبیق مالیاتی"}</li>
                                <li>• {lang === Language.ENGLISH ? "Secure Legal Handover" : "تحویل قانونی امن"}</li>
                            </ul>
                        </div>
                        <a
                            href={`https://wa.me/93791606227?text=${lang === Language.ENGLISH ? "Salam, I want to list my property for sale." : "سلام، می‌خواهم ملک خود را برای فروش بگذارم."}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-block w-full py-4 border border-brand-gold text-brand-gold text-center uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-white transition-all duration-300"
                        >
                            {lang === Language.ENGLISH ? "List Property" : "ثبت ملک"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
