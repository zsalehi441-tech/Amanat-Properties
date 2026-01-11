import React from 'react';
import { Language } from '../types';

const About = ({ lang }: { lang: Language }) => (
    <div className="py-24 animate-fade-in rtl:text-right">
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-white leading-tight">
                        {lang === Language.ENGLISH ? "The Architecture of Trust" : "معماری اعتماد"}
                    </h1>
                    <div className="prose dark:prose-invert prose-lg text-slate-600 dark:text-slate-400">
                        <p className="mb-6">
                            {lang === Language.ENGLISH
                                ? "Amanat was established to solve the trust deficit in Afghanistan's real estate market. We recognized that luxury isn't about materials—it's about the security of ownership."
                                : "امانت برای حل مشکل کمبود اعتماد در بازار املاک افغانستان تاسیس شد. ما تشخیص دادیم که لوکس بودن به معنای مواد ساختمانی نیست، بلکه به معنای امنیت مالکیت است."}
                        </p>
                        <p className="mb-8">
                            {lang === Language.ENGLISH
                                ? "Our team consists of former judicial experts, architects, and property advisors who understand the complexities of the Afghan 'Makhzan' system and the needs of the diaspora."
                                : "تیم ما متشکل از کارشناسان سابق قضایی، معماران و مشاوران املاک است که پیچیدگی‌های سیستم «مخزن» افغانستان و نیازهای هموطنان خارج از کشور را درک می‌کنند."}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-12">
                        <div>
                            <div className="text-4xl font-bold text-brand-gold mb-2">100%</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500">{lang === Language.ENGLISH ? "Verification Rate" : "نرخ تایید اسناد"}</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-brand-gold mb-2">34</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500">{lang === Language.ENGLISH ? "Provinces Covered" : "ولایات تحت پوشش"}</div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[4/5] bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-gold/30 p-1">
                        <img
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2070"
                            className="w-full h-full object-cover opacity-80"
                            alt="Institutional Authority"
                        />
                    </div>
                    <div className="absolute -bottom-10 -left-10 bg-white dark:bg-brand-dark border border-slate-200 dark:border-brand-charcoal p-8 hidden lg:block max-w-xs shadow-2xl">
                        <p className="text-xs text-brand-gold font-bold tracking-widest uppercase mb-4">Core Philosophy</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            "Trust is built through process, not promises."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default About;
