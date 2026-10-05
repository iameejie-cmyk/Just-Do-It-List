import React, { useState } from 'react';
import { DAILY_QUOTES } from '../data/initialData';
import { RefreshCw } from 'lucide-react';

export const DailyReminderCard: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden bg-[#222722] text-[#f4f3ec] rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-xs border border-[#1b1f1b]">
      {/* Quotation mark in top right */}
      <div
        className="absolute top-6 right-7 text-[#3f473e] select-none pointer-events-none font-serif text-6xl leading-none"
        aria-hidden="true"
      >
        “
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-widest text-[#93998f] uppercase block">
            Daily Reminder
          </span>
          <button
            onClick={handleNextQuote}
            title="Next reflection"
            className="text-[#93998f] hover:text-[#e4e8dc] transition-colors p-1 rounded-md opacity-70 hover:opacity-100"
            aria-label="Cycle daily reminder"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="font-serif-title text-2xl md:text-[26px] font-bold text-[#f8f7f2] leading-snug mt-4 pr-10">
          {DAILY_QUOTES[quoteIndex]}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1.5">
        {DAILY_QUOTES.map((_, idx) => (
          <span
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === quoteIndex ? 'w-5 bg-[#e4e8dc]' : 'w-1.5 bg-[#424d3f]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
