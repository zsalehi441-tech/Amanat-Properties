import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import MapInterface from '../components/MapInterface';
import { Language } from '../types';
import { WHATSAPP_URL } from '../constants/config';

const Contact = ({ lang }: { lang: Language }) => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [groundingLinks, setGroundingLinks] = useState<{ title: string, uri: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAskAI = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse("");
        setGroundingLinks([]);
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: query,
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: lang === Language.ENGLISH
                        ? "You are the Amanat Real Estate Advisor. Provide research-driven, factual advice about Afghan property laws, verification processes (Makhzan), and current market conditions. Always prioritize trust and security. If asked about current news or laws, use Google Search to provide up-to-date information."
                        : "شما مشاور املاک امانت هستید. مشوره‌های مبتنی بر تحقیق و واقعیت در مورد قوانین ملکی افغانستان، مراحل تایید اسناد (مخزن) و شرایط فعلی بازار ارائه دهید. همیشه اعتماد و امنیت را در اولویت قرار دهید. اگر در مورد اخبار یا قوانین فعلی سوال شد، از جستجوی گوگل برای ارائه اطلاعات بروز استفاده کنید.",
                }
            });

            setResponse(result.text || "No response received.");

            const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                // Fix: Properly filter for web chunks with valid URIs and map to required title/uri structure
                const links = chunks
                    .map(c => c.web)
                    .filter((web): web is { title?: string; uri: string } => !!web && typeof web.uri === 'string')
                    .map(web => ({
                        title: web.title || web.uri,
                        uri: web.uri
                    }));
                setGroundingLinks(links);
            }
        } catch (err) {
            console.error(err);
            setResponse(lang === Language.ENGLISH ? "Sorry, I encountered an error. Please try again or use WhatsApp." : "متأسفم، با خطایی روبرو شدم. لطفاً دوباره تلاش کنید یا از واتس‌اپ استفاده کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-24 animate-fade-in rtl:text-right">
            <div className="container mx-auto px-4 mb-20">
                <h1 className="text-4xl font-bold mb-6 text-center text-slate-900 dark:text-white">{lang === Language.ENGLISH ? "Research & Advisory" : "تحقیق و مشاوره"}</h1>

                {/* AI Assistant Section */}
                <div className="max-w-3xl mx-auto mb-20 bg-slate-50 dark:bg-brand-navy p-10 border border-slate-200 dark:border-brand-gold/10 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>

                    <h2 className="text-2xl font-bold text-brand-gold mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                        <span>{lang === Language.ENGLISH ? "Verified Property Advisor" : "مشاور تایید شده املاک"}</span>
                        <span className="text-[9px] border border-brand-gold/30 text-brand-gold px-3 py-1 rounded font-bold uppercase tracking-[0.2em] ml-2">Secure Link</span>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-xl">
                        {lang === Language.ENGLISH
                            ? "Our Research-Driven AI utilizes live data to guide your investment strategy and document verification questions."
                            : "هوش مصنوعی مبتنی بر تحقیق ما از داده‌های زنده برای هدایت استراتژی سرمایه‌گذاری و سوالات تایید اسناد شما استفاده می‌کند."}
                    </p>

                    <div className="flex flex-col gap-6">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={lang === Language.ENGLISH ? "Ask about Kabul zoning, Makhzan verification, or diaspora property rights..." : "در مورد زون‌بندی کابل، تایید مخزن، یا حقوق ملکی دیاسپورا بپرسید..."}
                            className="bg-white dark:bg-brand-dark/80 border border-slate-200 dark:border-brand-charcoal p-5 text-slate-900 dark:text-white focus:border-brand-gold outline-none h-40 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner rounded-sm"
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={loading || !query.trim()}
                            className="bg-brand-gold text-brand-dark font-bold py-4 uppercase tracking-[0.3em] text-xs hover:bg-brand-gold/90 transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-md hover:shadow-glow"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>}
                            {loading ? (lang === Language.ENGLISH ? "Accessing Global Records..." : "در حال دسترسی به سوابق جهانی...") : (lang === Language.ENGLISH ? "Request Advisory" : "درخواست مشاوره")}
                        </button>

                        {response && (
                            <div className="mt-8 p-8 bg-white dark:bg-brand-dark/40 border-t-2 border-brand-gold/50 text-slate-700 dark:text-slate-300 text-sm leading-relaxed animate-fade-in shadow-lg">
                                <div className="mb-6 whitespace-pre-wrap">{response}</div>

                                {groundingLinks.length > 0 && (
                                    <div className="pt-6 border-t border-slate-100 dark:border-brand-charcoal">
                                        <h4 className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-4 opacity-70">
                                            {lang === Language.ENGLISH ? "External Verification Sources" : "منابع تایید بیرونی"}
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {groundingLinks.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[11px] text-slate-500 hover:text-brand-gold transition-colors flex items-center gap-1 border border-slate-200 dark:border-brand-charcoal px-3 py-1 rounded"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                    {link.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mb-20">
                    <div className="inline-block px-10 py-12 border border-slate-200 dark:border-brand-charcoal bg-slate-50 dark:bg-brand-navy/30 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm">
                            {lang === Language.ENGLISH
                                ? "For complex legal representation or physical property survey requests, please message our primary advisor."
                                : "برای نمایندگی حقوقی پیچیده یا درخواست‌های بررسی فزیکی ملک، لطفاً به مشاور ارشد ما پیام دهید."}
                        </p>
                        <a
                            href={WHATSAPP_URL}
                            className="inline-flex items-center gap-5 bg-brand-emerald text-white px-12 py-5 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
                        >
                            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.623 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            {lang === Language.ENGLISH ? "Open Official Channel" : "باز کردن کانال رسمی"}
                        </a>
                    </div>
                </div>
            </div>

            {/* Global Asset map moved from Home to Contact */}
            <section className="py-24 bg-slate-100 dark:bg-brand-dark border-t border-slate-200 dark:border-brand-charcoal">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-16 items-center">
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tight">
                                {lang === Language.ENGLISH ? "Regional Security Matrix" : "ماتریس امنیتی منطقه‌ای"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light mb-8">
                                {lang === Language.ENGLISH
                                    ? "Our presence across all 34 provinces ensures on-ground verification. Every asset marked on our system corresponds to a physical site audit."
                                    : "حضور ما در تمامی ۳۴ ولایت تایید میدانی را تضمین می‌کند. هر دارایی ثبت شده در سیستم ما با یک ممیزی فیزیکی در محل مطابقت دارد."}
                            </p>
                            <div className="space-y-4">
                                {[
                                    { city: "Kabul", status: "Active High-Security", verified: 12 },
                                    { city: "Herat", status: "Active Industrial", verified: 4 },
                                    { city: "Mazar", status: "Active Commercial", verified: 7 }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal">
                                        <div>
                                            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{stat.city}</div>
                                            <div className="text-[9px] text-brand-emerald font-bold uppercase">{stat.status}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-brand-gold font-bold text-lg">{stat.verified}</div>
                                            <div className="text-[8px] text-slate-400 uppercase tracking-widest">Verified Assets</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-2 h-[500px]">
                            <MapInterface
                                lang={lang}
                                isStatic={true}
                                title="Global Asset Presence"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
