import React, { useState } from 'react';
import { Sparkles, Heart, Feather, ShieldCheck, ArrowRight, CheckCircle2, Award, Clock, Layers } from 'lucide-react';

export default function CraftedStorySection({ onOpenStory }) {
  const [activePhilosophy, setActivePhilosophy] = useState(0);

  const pillars = [
    {
      id: "01",
      title: "SLOW CRAFT HERITAGE",
      subtitle: "MADE WITH PATIENCE, CARE, AND ATTENTION TO EVERY STITCH",
      description: "Each piece is hand-looped using slow craft principles. We pull, measure, and lock every single stitch by hand to ensure superior structural longevity, rich texture, and lasting tactile warmth.",
      highlight: "Over 8 to 24 handcraft hours devoted to every single creation.",
      icon: Sparkles,
      image: "/images/Handcrafted Crochet Rose Bouquet.jpeg",
      badge: "Slow-Craft Certified"
    },
    {
      id: "02",
      title: "ARTISAN UNIQUENESS",
      subtitle: "THOUGHTFULLY CREATED PIECES DESIGNED TO FEEL PERSONAL",
      description: "No two crochet stitches are ever identical. Every bag, keychain, bouquet, and hair accessory carries the signature nuance of individual artisan hands, making your creation truly one-of-a-kind.",
      highlight: "Each item carries its own individual stitch signature & identity.",
      icon: Heart,
      image: "/images/Crochet Rose Shoulder Bag.jpeg",
      badge: "1-of-1 Handmade Nuance"
    },
    {
      id: "03",
      title: "EVERLASTING TACTILE BEAUTY",
      subtitle: "CROCHET CREATED TO BECOME PART OF YOUR EVERDAY STORY",
      description: "We craft exclusively with premium soft cotton and plush acrylic yarn engineered to retain soft depth, vibrant color, and shape for years to come. Unlike fresh flowers or fast fashion, our pieces never fade.",
      highlight: "Dusk-pink tones & colorfast yarns designed to last generations.",
      icon: Feather,
      image: "/images/Crochet Floral Hanging Planter.jpeg",
      badge: "Colorfast Everlasting Yarn"
    }
  ];

  const currentPillar = pillars[activePhilosophy];
  const IconComponent = currentPillar.icon;

  return (
    <section id="philosophy" className="py-24 px-4 sm:px-8 relative bg-gradient-to-b from-[#FFFDFB] via-[#FFF7F9] to-[#FFFDFB] overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#F7C9D5]/30 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9D3158]" />
            <span className="font-serif text-xs font-bold tracking-[0.3em] uppercase text-[#70213F]">
              ARTISAN PHILOSOPHY
            </span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#301B25] tracking-tight">
            Crafted with a Story
          </h2>
          
          <p className="font-serif text-lg sm:text-xl text-[#9D3158] italic font-medium">
            “Every creation begins with a simple spool of yarn and becomes a keepsake made to be remembered.”
          </p>
          
          <div className="w-16 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
        </div>

        {/* Interactive Editorial Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#FFFDFB] p-6 sm:p-10 rounded-3xl border border-[#F7C9D5]/80 shadow-md">
          
          {/* Left Column: Interactive Featured Artwork Image */}
          <div className="lg:col-span-6 relative group">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-[#FFFDFB] bg-[#FFF7F9]">
              <img
                src={currentPillar.image}
                alt={currentPillar.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/80 via-transparent to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FFFDFB]/90 backdrop-blur-md border border-[#F7C9D5] text-[10px] font-bold text-[#70213F] uppercase tracking-wider shadow-sm">
                  {currentPillar.badge}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-[#FFFDFB] space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#F7C9D5] uppercase block">
                  Pillar {currentPillar.id} Showcase
                </span>
                <h4 className="font-serif text-xl font-bold">{currentPillar.title}</h4>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Pillar Switcher */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#FFF7F9] rounded-2xl border border-[#F7C9D5]/60">
              {pillars.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActivePhilosophy(idx)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                    activePhilosophy === idx
                      ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md'
                      : 'text-[#301B25]/70 hover:text-[#9D3158] hover:bg-[#F7C9D5]/30'
                  }`}
                >
                  <span>Pillar {item.id}</span>
                </button>
              ))}
            </div>

            {/* Selected Pillar Content Details */}
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#9D3158]/10 text-[#9D3158] flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C65A7B]">
                    THOUGHTFUL CRAFT
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#301B25]">
                    {currentPillar.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#9D3158]">
                {currentPillar.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#301B25]/80 leading-relaxed font-normal">
                {currentPillar.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5]/80 text-xs font-semibold text-[#70213F] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#9D3158] shrink-0" />
                <span>{currentPillar.highlight}</span>
              </div>
            </div>

            {/* Read Story Link */}
            <div className="pt-2">
              <button
                onClick={onOpenStory}
                className="px-6 py-3 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-sm flex items-center space-x-2"
              >
                <span>Read Full Atelier Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F7C9D5]/60 text-center space-y-1 shadow-2xs hover:border-[#9D3158] transition-colors">
            <span className="font-serif text-3xl font-bold text-[#9D3158] block">3,500+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#301B25]/75">Handcraft Hours Woven</span>
          </div>
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F7C9D5]/60 text-center space-y-1 shadow-2xs hover:border-[#9D3158] transition-colors">
            <span className="font-serif text-3xl font-bold text-[#9D3158] block">35</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#301B25]/75">Exclusive Creations</span>
          </div>
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F7C9D5]/60 text-center space-y-1 shadow-2xs hover:border-[#9D3158] transition-colors">
            <span className="font-serif text-3xl font-bold text-[#9D3158] block">100%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#301B25]/75">Cotton & Acrylic Yarn</span>
          </div>
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F7C9D5]/60 text-center space-y-1 shadow-2xs hover:border-[#9D3158] transition-colors">
            <span className="font-serif text-3xl font-bold text-[#9D3158] block">0%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#301B25]/75">Machine Factory Work</span>
          </div>
        </div>

        {/* Story Banner CTA */}
        <div className="bg-gradient-to-r from-[#70213F] to-[#9D3158] rounded-3xl p-8 sm:p-12 text-[#FFFDFB] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#F7C9D5]/20 rounded-full filter blur-xl pointer-events-none"></div>
          
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs tracking-[0.25em] text-[#F7C9D5] uppercase font-bold">HERITAGE CRAFTSMANSHIP</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Discover how we spin soft cotton into timeless luxury.</h3>
            <p className="text-xs sm:text-sm text-[#FFFDFB]/80 max-w-xl font-normal">
              Every THREADTALES item is individually crafted by hand and inspected before reaching your doorstep.
            </p>
          </div>

          <button
            onClick={onOpenStory}
            className="z-10 whitespace-nowrap px-8 py-3.5 bg-[#FFFDFB] hover:bg-[#F7C9D5] text-[#70213F] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-md transition-all transform hover:scale-105"
          >
            MEET THE ARTISANS
          </button>
        </div>

      </div>
    </section>
  );
}
