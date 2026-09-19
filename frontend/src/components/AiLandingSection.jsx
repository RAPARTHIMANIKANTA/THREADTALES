import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Bot, Compass } from 'lucide-react';

export default function AiLandingSection({ onOpenAiWithQuery }) {
  const [inputQuery, setInputQuery] = useState('');

  const quickPrompts = [
    'Show gifts under ₹500',
    'What products are available?',
    'Show birthday gifts',
    'Show keychains'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onOpenAiWithQuery(inputQuery.trim());
      setInputQuery('');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDFB] via-[#FFF7F9] to-[#FFFDFB] border-y border-[#F7C9D5]/60 relative overflow-hidden">
      {/* Background Soft Lighting Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F7C9D5]/25 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Section Tag Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Bot className="w-4 h-4 text-[#9D3158]" />
          <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
            THREADTALES AI ASSISTANT
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#301B25]">
            Find something made for you.
          </h2>
          <p className="text-sm sm:text-base text-[#301B25]/80 max-w-xl mx-auto font-normal">
            Ask our grounded AI product assistant about crochet creations, prices, occasions, materials, sizes, and availability.
          </p>
        </div>

        {/* Input Box Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative flex items-center shadow-lg rounded-full bg-[#FFFDFB] border border-[#F7C9D5] p-1.5">
          <MessageSquare className="w-5 h-5 text-[#9D3158] ml-4 shrink-0" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about our products... (e.g. gifts under ₹500)"
            className="w-full pl-3 pr-4 py-3 bg-transparent text-xs font-medium text-[#301B25] placeholder-[#301B25]/50 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-wider uppercase rounded-full shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Suggested Quick Question Pills */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold tracking-widest text-[#C65A7B] uppercase block">
            Popular Questions
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onOpenAiWithQuery(prompt)}
                className="px-4 py-2 rounded-full bg-[#FFFDFB] hover:bg-[#F7C9D5]/50 border border-[#F7C9D5] text-xs font-semibold text-[#70213F] transition-all shadow-2xs hover:scale-102 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#9D3158]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
