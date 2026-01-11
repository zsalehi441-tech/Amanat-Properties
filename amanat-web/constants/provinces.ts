
import { Language } from '../types';

export interface Province {
  id: string;
  names: Record<Language, string>;
}

export const provinces: Province[] = [
  { id: 'kbl', names: { [Language.DARI]: 'کابل', [Language.PASHTO]: 'کابل', [Language.ENGLISH]: 'Kabul' } },
  { id: 'kan', names: { [Language.DARI]: 'قندهار', [Language.PASHTO]: 'کندهار', [Language.ENGLISH]: 'Kandahar' } },
  { id: 'hrat', names: { [Language.DARI]: 'هرات', [Language.PASHTO]: 'هرات', [Language.ENGLISH]: 'Herat' } },
  { id: 'blkh', names: { [Language.DARI]: 'بلخ', [Language.PASHTO]: 'بلخ', [Language.ENGLISH]: 'Balkh' } },
  { id: 'nng', names: { [Language.DARI]: 'ننگرهار', [Language.PASHTO]: 'ننگرهار', [Language.ENGLISH]: 'Nangarhar' } },
  { id: 'kndz', names: { [Language.DARI]: 'قندوز', [Language.PASHTO]: 'کندوز', [Language.ENGLISH]: 'Kunduz' } },
  { id: 'ghz', names: { [Language.DARI]: 'غزنی', [Language.PASHTO]: 'غزني', [Language.ENGLISH]: 'Ghazni' } },
  { id: 'hlm', names: { [Language.DARI]: 'هلمند', [Language.PASHTO]: 'هلمند', [Language.ENGLISH]: 'Helmand' } },
  { id: 'bdk', names: { [Language.DARI]: 'بدخشان', [Language.PASHTO]: 'بدخشان', [Language.ENGLISH]: 'Badakhshan' } },
  { id: 'bgh', names: { [Language.DARI]: 'بغلان', [Language.PASHTO]: 'بغلان', [Language.ENGLISH]: 'Baghlan' } },
  { id: 'fyr', names: { [Language.DARI]: 'فاریاب', [Language.PASHTO]: 'فاریاب', [Language.ENGLISH]: 'Faryab' } },
  { id: 'log', names: { [Language.DARI]: 'لوگر', [Language.PASHTO]: 'لوگر', [Language.ENGLISH]: 'Logar' } },
  { id: 'paktia', names: { [Language.DARI]: 'پکتیا', [Language.PASHTO]: 'پکتیا', [Language.ENGLISH]: 'Paktia' } },
  { id: 'paktika', names: { [Language.DARI]: 'پکتیکا', [Language.PASHTO]: 'پکتیکا', [Language.ENGLISH]: 'Paktika' } },
  { id: 'khst', names: { [Language.DARI]: 'خوست', [Language.PASHTO]: 'خوست', [Language.ENGLISH]: 'Khost' } },
  { id: 'knr', names: { [Language.DARI]: 'کنر', [Language.PASHTO]: 'کونړ', [Language.ENGLISH]: 'Kunar' } },
  { id: 'lgh', names: { [Language.DARI]: 'لغمان', [Language.PASHTO]: 'لغمان', [Language.ENGLISH]: 'Laghman' } },
  { id: 'prw', names: { [Language.DARI]: 'پروان', [Language.PASHTO]: 'پروان', [Language.ENGLISH]: 'Parwan' } },
  { id: 'kap', names: { [Language.DARI]: 'کاپیسا', [Language.PASHTO]: 'کاپیسا', [Language.ENGLISH]: 'Kapisa' } },
  { id: 'panj', names: { [Language.DARI]: 'پنجشیر', [Language.PASHTO]: 'پنجشیر', [Language.ENGLISH]: 'Panjshir' } },
  { id: 'wrdk', names: { [Language.DARI]: 'میدان وردک', [Language.PASHTO]: 'میدان وردک', [Language.ENGLISH]: 'Wardak' } },
  { id: 'bam', names: { [Language.DARI]: 'بامیان', [Language.PASHTO]: 'بامیان', [Language.ENGLISH]: 'Bamyan' } },
  { id: 'dyk', names: { [Language.DARI]: 'دایکندی', [Language.PASHTO]: 'دایکندی', [Language.ENGLISH]: 'Daykundi' } },
  { id: 'gzj', names: { [Language.DARI]: 'جوزجان', [Language.PASHTO]: 'جوزجان', [Language.ENGLISH]: 'Jowzjan' } },
  { id: 'srp', names: { [Language.DARI]: 'سرپل', [Language.PASHTO]: 'سرپل', [Language.ENGLISH]: 'Sar-e Pol' } },
  { id: 'smng', names: { [Language.DARI]: 'سمنگان', [Language.PASHTO]: 'سمنگان', [Language.ENGLISH]: 'Samangan' } },
  { id: 'tkhr', names: { [Language.DARI]: 'تخار', [Language.PASHTO]: 'تخار', [Language.ENGLISH]: 'Takhar' } },
  { id: 'frh', names: { [Language.DARI]: 'فراه', [Language.PASHTO]: 'فراه', [Language.ENGLISH]: 'Farah' } },
  { id: 'nim', names: { [Language.DARI]: 'نیمروز', [Language.PASHTO]: 'نیمروز', [Language.ENGLISH]: 'Nimruz' } },
  { id: 'ghr', names: { [Language.DARI]: 'غور', [Language.PASHTO]: 'غور', [Language.ENGLISH]: 'Ghor' } },
  { id: 'bdg', names: { [Language.DARI]: 'بادغیس', [Language.PASHTO]: 'بادغیس', [Language.ENGLISH]: 'Badghis' } },
  { id: 'zbl', names: { [Language.DARI]: 'زابل', [Language.PASHTO]: 'زابل', [Language.ENGLISH]: 'Zabul' } },
  { id: 'urz', names: { [Language.DARI]: 'ارزگان', [Language.PASHTO]: 'ارزگان', [Language.ENGLISH]: 'Uruzgan' } },
  { id: 'nur', names: { [Language.DARI]: 'نورستان', [Language.PASHTO]: 'نورستان', [Language.ENGLISH]: 'Nuristan' } }
].sort((a, b) => a.names[Language.ENGLISH].localeCompare(b.names[Language.ENGLISH]));
