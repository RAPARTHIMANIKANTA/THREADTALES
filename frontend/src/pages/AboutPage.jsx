import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Feather, Heart, Compass, ShieldCheck, Award, Flame, Layers, ArrowRight, CheckCircle2, PackageCheck, Sun } from 'lucide-react';
import { PRODUCTS, BRAND_PHILOSOPHY } from '../data/products';

export default function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Craft Process Steps
  const craftSteps = [
    {
      number: "01",
      title: "Yarn & Material Selection",
      desc: "We hand-select high-grade soft cotton and plush acrylic yarn, chosen for vibrant color retention, soft texture, and lasting durability.",
      icon: Layers
    },
    {
      number: "02",
      title: "Artisanal Hand-Looping",
      desc: "Every stitch is individually hand-hooked and measured with precision, building structural integrity into keychains, bags, bouquets, and hair ties.",
      icon: Flame
    },
    {
      number: "03",
      title: "Pearl & Hardware Detailing",
      desc: "Accentuated with pearl-beaded shoulder straps, sturdy metal keyrings, scalloped lace borders, and hand-embroidered facial details.",
      icon: Award
    },
    {
      number: "04",
      title: "Atelier Inspection & Packaging",
      desc: "Each finished piece undergoes rigorous quality check before being wrapped in luxury tissue and custom THREADTALES gift packaging.",
      icon: PackageCheck
    }
  ];

  // Highlights Showcase Products
  const showcaseProducts = [
    {
      title: "Handcrafted Rose Bouquet",
      category: "Bouquets",
      desc: "Everlasting floral arrangements wrapped with silk ribbons and pearl accents.",
      image: "/images/Handcrafted Crochet Rose Bouquet.jpeg"
    },
    {
      title: "Rose Shoulder Bag",
      category: "Bags",
      desc: "Woven cotton fashion shoulder bag featuring a pearl-beaded strap.",
      image: "/images/Crochet Rose Shoulder Bag.jpeg"
    },
    {
      title: "Butterfly & Cherry Keychains",
      category: "Keychains",
      desc: "Playful, charming keychains designed for keys, totes, and daily gifting.",
      image: "/images/Crochet Butterfly Keychain.jpeg"
    },
    {
      title: "Floral Hanging Decor",
      category: "Home Decor",
      desc: "Botanical wall hangings and hanging planters crafted to brighten any space.",
      image: "/images/Crochet Floral Hanging Planter.jpeg"
    }
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-24 relative overflow-hidden">
      
      {/* Background Ambient Luxury Lighting Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#F7C9D5]/30 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#9D3158]/15 rounded-full filter blur-[140px] pointer-events-none"></div>

      {/* Page Hero Header */}
      <div className="text-center space-y-5 max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center space-x-2.5 px-4.5 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Sparkles className="w-4 h-4 text-[#9D3158]" />
          <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
            OUR ATELIER & HERITAGE
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#301B25] leading-tight">
          Where Every Thread Tells a Story
        </h1>

        <p className="font-serif text-lg sm:text-xl text-[#9D3158] italic font-medium max-w-2xl mx-auto">
          “Founded on the belief that fast fashion can never replace the soul, patience, and warmth of deliberate slow craft.”
        </p>

        <div className="w-24 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
      </div>

      {/* Main Narrative Split with Real Project Images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6 text-[#301B25]/85 leading-relaxed">
          <div className="inline-block px-3 py-1 bg-[#9D3158]/10 text-[#9D3158] text-[11px] font-bold tracking-widest uppercase rounded-full border border-[#9D3158]/20">
            Artisanal Craftsmanship
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#70213F]">
            The THREADTALES Journey
          </h2>
          
          <p className="text-sm sm:text-base leading-relaxed">
            THREADTALES was born out of a deep passion for transforming spools of soft cotton and vibrant acrylic yarn into tactile works of art. What began as a humble studio vision has grown into a luxury crochet brand loved for its signature dusk-pink aesthetic and intricate hand-looping techniques.
          </p>

          <p className="text-sm sm:text-base leading-relaxed">
            Unlike mass-manufactured accessories, every piece in our collection—from charming butterfly and panda keychains to pearl-strapped rose shoulder bags and everlasting flower bouquets—is created entirely by hand.
          </p>

          <p className="text-sm sm:text-base leading-relaxed">
            We measure success not in speed, but in stitch precision, soft tactile warmth, and the joy our creations bring to everyday moments and gift-giving occasions.
          </p>

          {/* Interactive Stat Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-wider text-[#9D3158]">
            <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#F7C9D5] shadow-xs text-center hover:border-[#9D3158] transition-colors">
              <span className="block text-2xl font-serif text-[#70213F] mb-1">35+</span>
              <span>Unique Creations</span>
            </div>
            <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#F7C9D5] shadow-xs text-center hover:border-[#9D3158] transition-colors">
              <span className="block text-2xl font-serif text-[#70213F] mb-1">100%</span>
              <span>Handcrafted</span>
            </div>
            <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#F7C9D5] shadow-xs text-center col-span-2 sm:col-span-1 hover:border-[#9D3158] transition-colors">
              <span className="block text-2xl font-serif text-[#70213F] mb-1">0%</span>
              <span>Machine Mass Prod</span>
            </div>
          </div>
        </div>

        {/* Right Visual Image Showcase */}
        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-[#FFFDFB] aspect-[3/4] group">
                <img
                  src="/images/Crochet Rose Shoulder Bag.jpeg"
                  alt="Crochet Rose Shoulder Bag"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest text-[#FFFDFB] uppercase bg-[#9D3158]/90 px-3 py-1 rounded-full backdrop-blur-xs">
                  Fashion Bags
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-[#FFFDFB] aspect-square group">
                <img
                  src="/images/Crochet Butterfly Keychain.jpeg"
                  alt="Crochet Butterfly Keychain"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest text-[#FFFDFB] uppercase bg-[#9D3158]/90 px-3 py-1 rounded-full backdrop-blur-xs">
                  Keychains
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-[#FFFDFB] aspect-square group">
                <img
                  src="/images/Handcrafted Crochet Rose Bouquet.jpeg"
                  alt="Handcrafted Rose Bouquet"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest text-[#FFFDFB] uppercase bg-[#9D3158]/90 px-3 py-1 rounded-full backdrop-blur-xs">
                  Eternal Flowers
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-[#FFFDFB] aspect-[3/4] group">
                <img
                  src="/images/Crochet Floral Hanging Planter.jpeg"
                  alt="Crochet Floral Hanging Planter"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest text-[#FFFDFB] uppercase bg-[#9D3158]/90 px-3 py-1 rounded-full backdrop-blur-xs">
                  Home Decor
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive 3 Pillars Section */}
      <div className="space-y-12 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#9D3158] uppercase block">
            ARTISAN VALUES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25]">
            The Principles of Slow Craft
          </h2>
          <p className="text-xs text-[#301B25]/70">
            Three guiding values that define every THREADTALES creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRAND_PHILOSOPHY.map((item, index) => (
            <div
              key={item.title}
              onClick={() => setActiveTab(index)}
              className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer space-y-4 relative group ${
                activeTab === index 
                  ? 'bg-[#FFFDFB] border-[#9D3158] shadow-xl shadow-[#9D3158]/10 -translate-y-2' 
                  : 'bg-[#FFFDFB]/80 border-[#F7C9D5]/60 hover:border-[#9D3158]/60 hover:-translate-y-1'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                activeTab === index ? 'bg-[#9D3158] text-[#FFFDFB]' : 'bg-[#F7C9D5]/40 text-[#9D3158]'
              }`}>
                {index === 0 && <Sparkles className="w-6 h-6" />}
                {index === 1 && <Heart className="w-6 h-6" />}
                {index === 2 && <Feather className="w-6 h-6" />}
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#301B25] group-hover:text-[#9D3158] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9D3158]">
                {item.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#301B25]/75 leading-relaxed font-normal">
                {item.description}
              </p>

              <div className="pt-2 flex items-center text-xs font-bold text-[#9D3158] space-x-1 uppercase tracking-wider">
                <span>Explore Craft</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Craft Process Timeline with Premium Glassmorphism */}
      <div className="bg-gradient-to-r from-[#FFFDFB] via-[#FFF7F9] to-[#FFFDFB] p-8 sm:p-12 rounded-3xl border border-[#F7C9D5] shadow-sm space-y-10 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#9D3158] uppercase block">
            BEHIND THE STITCHES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25]">
            Our Handmade Process
          </h2>
          <p className="text-xs text-[#301B25]/70">
            From raw yarn skeins to finished atelier packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftSteps.map((step) => {
            const IconComp = step.icon;
            return (
              <div 
                key={step.number}
                className="bg-white p-6 rounded-2xl border border-[#F7C9D5]/80 space-y-3 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-[#9D3158]">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7F9] text-[#9D3158] flex items-center justify-center border border-[#F7C9D5]">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#301B25] group-hover:text-[#9D3158] transition-colors">
                  {step.title}
                </h4>

                <p className="text-xs text-[#301B25]/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Category Showcase Bar */}
      <div className="space-y-8 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#9D3158] uppercase block">
            OUR CATALOG
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#301B25]">
            Crafted for Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseProducts.map((item) => (
            <div 
              key={item.title}
              onClick={() => navigate('/shop')}
              className="bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5]/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#9D3158] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="aspect-square relative overflow-hidden bg-[#FFF7F9]">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                />
                <div className="absolute top-3 left-3 bg-[#9D3158] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  {item.category}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h4 className="font-serif font-bold text-lg text-[#301B25] group-hover:text-[#9D3158] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#301B25]/70 line-clamp-2">
                  {item.desc}
                </p>
                <div className="pt-2 flex items-center text-xs font-bold text-[#9D3158] space-x-1">
                  <span>Explore Shop</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-[#70213F] text-[#FFFDFB] rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl z-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#9D3158]/40 rounded-full filter blur-[80px] pointer-events-none"></div>
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#F7C9D5] block">
            EXPLORE THE COLLECTION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Find something made with soul.
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFDFB]/80 font-normal leading-relaxed">
            Browse our catalog of keychains, shoulder bags, hair accessories, flower bouquets, and home decor creations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3.5 bg-[#FFFDFB] text-[#70213F] font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#F7C9D5] transition-colors shadow-lg"
            >
              Shop Atelier Products
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3.5 bg-transparent border border-[#F7C9D5] text-[#FFFDFB] font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-colors"
            >
              Custom Inquiry
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
