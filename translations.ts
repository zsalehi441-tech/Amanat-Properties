
import { Language, TranslationSchema } from './types';

export const translations: Record<Language, TranslationSchema> = {
  [Language.DARI]: {
    nav: {
      home: 'صفحه اصلی',
      listings: 'املاک',
      construction: 'ساخت و ساز',
      services: 'خدمات',
      about: 'درباره امانت',
      contact: 'تماس با ما'
    },
    home: {
      heroTitle: 'امانت؛ نماد اعتماد در بازار املاک افغانستان',
      heroSubtitle: 'ما فراتر از یک واسطه هستیم؛ ما تضمین‌کننده امنیت و صحت معاملات شما هستیم.',
      viewListings: 'مشاهده املاک تایید شده',
      trustTitle: 'چرا امانت؟',
      trustSubtitle: 'در محیطی که اعتماد دشوار است، ما با بررسی دقیق اسناد و تایید هویت، ریسک شما را به صفر می‌رسانیم.',
      featuredTitle: 'ملک ویژه و تایید شده',
      viewAllAssets: 'مشاهده تمام املاک تایید شده',
      verificationBadge: 'تایید شده توسط مخزن'
    },
    status: {
      verified: 'تایید شده',
      verifiedAgent: 'نماینده معتبر',
      deedChecked: 'قباله بررسی شده'
    },
    details: {
      price: 'قیمت',
      area: 'مساحت',
      beds: 'اتاق',
      baths: 'حمام',
      levels: 'منزل',
      contactWhatsApp: 'ارتباط در واتس‌اپ',
      inquire: 'درخواست معلومات',
      requestBuild: 'درخواست ساخت',
      viewPlan: 'مشاهده نقشه'
    },
    construction: {
      title: 'طرح‌های معماری و مهندسی',
      subtitle: 'طراحی‌های مدرن و استندرد توسط نخبه‌ترین معماران افغانستان برای خانه‌ی رویایی شما.',
      filterAll: 'همه طرح‌ها',
      filterModern: 'خانه‌های مدرن',
      filterLuxury: 'عمارت‌های لوکس',
      filterFamily: 'خانه‌های خانوادگی',
      azServiceTitle: 'خدمات از الف تا ی (A-Z)',
      azServiceDesc: 'اگر زمین دارید یا قصد خرید دارید، ما از طراحی نقشه تا ساخت نهایی و تحویل کلید در کنار شما هستیم.'
    }
  },
  [Language.PASHTO]: {
    nav: {
      home: 'کورپاڼه',
      listings: 'املاک',
      construction: 'جوړونه',
      services: 'خدمتونه',
      about: 'د امانت په اړه',
      contact: 'اړیکه'
    },
    home: {
      heroTitle: 'امانت؛ د افغانستان د ملکیتونو په بازار کې د باور نښه',
      heroSubtitle: 'موږ یوازې یو منځګړی نه یو؛ موږ ستاسو د معاملو د امنیت او روڼتیا تضمین کوونکي یو.',
      viewListings: 'تایید شوي ملکیتونه کتل',
      trustTitle: 'ولې امانت؟',
      trustSubtitle: 'په هغه چاپیریال کې چې باور ستونزمن دی، موږ د اسنادو په دقیقې پلټنې او د هویت په تایید سره ستاسو خطر صفر ته رسوو.',
      featuredTitle: 'ځانګړی او تایید شوی ملکیت',
      viewAllAssets: 'د ټولو تایید شویو ملکیتونو کتل',
      verificationBadge: 'د مخزن لخوا تایید شوی'
    },
    status: {
      verified: 'تایید شوی',
      verifiedAgent: 'باوري استازی',
      deedChecked: 'قباله چک شوې'
    },
    details: {
      price: 'بیه',
      area: 'مساحت',
      beds: 'خونې',
      baths: 'تشنابونه',
      levels: 'پوړونه',
      contactWhatsApp: 'واټس‌اپ اړیکه',
      inquire: 'معلومات غوښتل',
      requestBuild: 'د جوړولو غوښتنه',
      viewPlan: 'د نقشې کتل'
    },
    construction: {
      title: 'د معمارۍ او انجینرۍ طرحې',
      subtitle: 'ستاسو د خوب د کور لپاره د افغانستان د غوره معمارانو لخوا عصري او معیاري ډیزاینونه.',
      filterAll: 'ټولې طرحې',
      filterModern: 'عصري کورونه',
      filterLuxury: 'لوکسې ماڼۍ',
      filterFamily: 'کورنۍ کورونه',
      azServiceTitle: 'له الف څخه تر ی پورې خدمتونه (A-Z)',
      azServiceDesc: 'که تاسو ځمکه لرئ یا د پیرودلو اراده لرئ، موږ د نقشې له ډیزاین څخه تر وروستي جوړونې او د کیلي سپارلو پورې ستاسو سره یو.'
    }
  },
  [Language.ENGLISH]: {
    nav: {
      home: 'Home',
      listings: 'Properties',
      construction: 'Construction',
      services: 'Services',
      about: 'About',
      contact: 'Contact'
    },
    home: {
      heroTitle: 'Amanat: The Gold Standard of Trust in Afghan Real Estate',
      heroSubtitle: 'Not just a broker—your institutional guide for secure, verified property transactions.',
      viewListings: 'View Verified Listings',
      trustTitle: 'Why Amanat?',
      trustSubtitle: 'In a high-risk market, we prioritize verification over marketing. We manage the risk so you don’t have to.',
      featuredTitle: 'Featured Institutional Asset',
      viewAllAssets: 'Explore Full Inventory',
      verificationBadge: 'Makhzan Verified'
    },
    status: {
      verified: 'Verified',
      verifiedAgent: 'Verified Agent',
      deedChecked: 'Deed Checked'
    },
    details: {
      price: 'Price',
      area: 'Area',
      beds: 'Beds',
      baths: 'Baths',
      levels: 'Levels',
      contactWhatsApp: 'Chat on WhatsApp',
      inquire: 'Inquire Now',
      requestBuild: 'Request Build',
      viewPlan: 'View Plan'
    },
    construction: {
      title: 'Architectural & Engineering Designs',
      subtitle: 'Modern and standardized designs by Afghanistan\'s elite architects for your dream home.',
      filterAll: 'All Designs',
      filterModern: 'Modern Homes',
      filterLuxury: 'Luxury Mansions',
      filterFamily: 'Family Homes',
      azServiceTitle: 'A-Z Turnkey Service',
      azServiceDesc: 'If you own land or plan to acquire, we handle everything from blueprint design to final construction and handover.'
    }
  }
};
