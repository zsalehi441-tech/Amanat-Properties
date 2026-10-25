import React from 'react';
export default function CatalogNotice({stale,error,lang}:{stale:boolean,error:boolean,lang:string}){
 if(!stale&&!error)return null;
 const message=error?(lang==='en'?'Listings are temporarily unavailable. Please try again.':'فهرست املاک موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.'):(lang==='en'?'Showing a saved copy. Please confirm availability with Amanat.':lang==='ps'?'خوندي شوی لېست ښودل کېږي. د ملک شتون له امانت سره تایید کړئ.':'نسخه ذخیره‌شده نمایش داده می‌شود. لطفاً موجودیت ملک را با امانت تأیید کنید.');
 return <p role="status" className="p-3 text-center text-sm bg-amber-50 text-slate-800">{message}</p>;
}
