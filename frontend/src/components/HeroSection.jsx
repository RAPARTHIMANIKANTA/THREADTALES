import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

export default function HeroSection({ onOpenStory, onExploreClick }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-32 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-8 overflow-hidden flex items-center justify-center bg-[#FFF7F9] crochet-bg-pattern">
      
      {/* Soft Lighting Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#F7C9D5]/35 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-[#EBA3B7]/25 rounded-full filter blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN — Editorial Content (52% Desktop) */}
        <div 
          className={`lg:col-span-6 flex flex-col items-start space-y-6 sm:space-y-8 text-left z-20 transition-all duration-1000 ease-out transform ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          
          {/* Brand Name Tagline */}
          <div className="inline-flex items-center space-x-3">
            <span className="font-serif text-xs font-bold tracking-[0.35em] text-[#9D3158] uppercase">
              THREADTALES
            </span>
            <span className="w-8 h-px bg-[#EBA3B7]"></span>
            <span className="text-[11px] font-semibold tracking-widest text-[#70213F] uppercase">
              Haute Atelier
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#301B25] leading-[1.10]">
              Welcome to <br />
              <span className="text-[#9D3158] italic font-normal">THREADTALES</span>
            </h1>
            
            {/* Tagline */}
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#70213F] italic font-medium tracking-wide pt-1">
              “Where every thread tells a story.”
            </p>
          </div>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-[#301B25]/80 max-w-xl leading-relaxed font-normal">
            Discover handcrafted crochet pieces made with patience, creativity, and a little bit of love.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 w-full sm:w-auto pt-2">
            
            {/* Primary CTA */}
            <button
              onClick={onExploreClick}
              className="group relative inline-flex items-center justify-center px-9 py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onOpenStory}
              className="inline-flex items-center justify-center px-9 py-4 bg-[#FFFDFB] hover:bg-[#F7C9D5]/40 text-[#9D3158] border border-[#9D3158] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-xs transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 mr-2.5 text-[#9D3158]" />
              <span>OUR STORY</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN — Realistic Physical Yarn Ball & Flowing Thread (48% Desktop) */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
          
          {/* Continuous Flowing Real Yarn Strand SVG (Connects ball down toward next section) */}
          <svg 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible"
            viewBox="0 0 600 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="yarnShadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#70213F" floodOpacity="0.25" />
            </filter>

            {/* Outer Drop Shadow Path */}
            <path
              d="M 440,165 C 380,75 250,90 190,210 C 130,330 310,410 160,470 C 80,500 20,390 70,280 C 110,190 260,230 320,320 M 320,320 C 370,400 480,480 540,540"
              stroke="#70213F"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="2200"
              strokeDashoffset={loaded ? "0" : "2200"}
              filter="url(#yarnShadowFilter)"
              fill="none"
              style={{ transition: "stroke-dashoffset 3.8s cubic-bezier(0.25, 1, 0.5, 1)" }}
            />

            {/* Main Dusky-Pink Wool Yarn Strand */}
            <path
              d="M 440,165 C 380,75 250,90 190,210 C 130,330 310,410 160,470 C 80,500 20,390 70,280 C 110,190 260,230 320,320 M 320,320 C 370,400 480,480 540,540"
              stroke="url(#realYarnStrandGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="2200"
              strokeDashoffset={loaded ? "0" : "2200"}
              fill="none"
              style={{ transition: "stroke-dashoffset 3.8s cubic-bezier(0.25, 1, 0.5, 1)" }}
            />

            {/* Inner Twisted Wool Fiber Highlight */}
            <path
              d="M 440,165 C 380,75 250,90 190,210 C 130,330 310,410 160,470 C 80,500 20,390 70,280 C 110,190 260,230 320,320 M 320,320 C 370,400 480,480 540,540"
              stroke="#FFFDFB"
              strokeWidth="1.25"
              strokeDasharray="5 9"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            <defs>
              <linearGradient id="realYarnStrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#70213F" />
                <stop offset="35%" stopColor="#9D3158" />
                <stop offset="70%" stopColor="#C65A7B" />
                <stop offset="100%" stopColor="#EBA3B7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Main Visual Container */}
          <div 
            className={`relative z-20 transition-all duration-1000 delay-200 ease-out transform ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative animate-yarn-float flex items-center justify-center">
              
              {/* Natural Ambient Shadow Under Yarn Ball */}
              <div className="absolute -bottom-6 w-64 h-16 bg-[#70213F]/30 rounded-full filter blur-xl transform scale-y-50"></div>

              {/* Minimal Wooden Crochet Hook Graphic Beside Yarn Ball */}
              <div className="absolute -bottom-2 -left-8 z-30 transform -rotate-45 pointer-events-none">
                <svg width="180" height="24" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12 L170 12" stroke="#8C533E" strokeWidth="6" strokeLinecap="round" />
                  <path d="M10 12 L170 12" stroke="#B87D65" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  {/* Hook Tip */}
                  <path d="M165 12 C172 12 176 8 172 5 C168 2 162 7 165 12" stroke="#6E3E2E" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* REALISTIC TEXT-FREE PHYSICAL YARN BALL */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-92 lg:h-92 rounded-full p-2 bg-gradient-to-br from-[#FFFDFB] via-[#F7C9D5]/60 to-[#C65A7B]/40 shadow-[0_25px_50px_-12px_rgba(112,33,63,0.32)] border border-[#FFFDFB] flex items-center justify-center overflow-hidden group">
                
                {/* Physical Yarn Ball High-Res Photography Asset */}
                <div 
                  className="w-full h-full rounded-full bg-cover bg-center relative transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200')`
                  }}
                >
                  {/* Soft Dusk-Pink Material Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#70213F]/55 via-[#9D3158]/25 to-transparent mix-blend-color-burn rounded-full"></div>

                  {/* Soft Directional Radial Shadow for 3D Depth */}
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#301B25]/40 rounded-full pointer-events-none"></div>

                  {/* Soft Tactile Rim Lighting Highlight */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#FFFDFB]/25 pointer-events-none shadow-[inset_0_0_15px_rgba(255,253,251,0.4)]"></div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
