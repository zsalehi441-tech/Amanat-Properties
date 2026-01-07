
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-brand-dark/50 p-1 rounded-lg border border-brand-charcoal">
      <button
        onClick={() => onChange(Language.DARI)}
        className={`px-3 py-1 rounded transition-colors text-xs font-medium ${
          current === Language.DARI ? 'bg-brand-gold text-brand-dark' : 'hover:text-brand-gold'
        }`}
      >
        دری
      </button>
      <button
        onClick={() => onChange(Language.PASHTO)}
        className={`px-3 py-1 rounded transition-colors text-xs font-medium ${
          current === Language.PASHTO ? 'bg-brand-gold text-brand-dark' : 'hover:text-brand-gold'
        }`}
      >
        پښتو
      </button>
      <button
        onClick={() => onChange(Language.ENGLISH)}
        className={`px-3 py-1 rounded transition-colors text-xs font-medium font-serif ${
          current === Language.ENGLISH ? 'bg-brand-gold text-brand-dark' : 'hover:text-brand-gold'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
