import React from 'react';
import { X, Sparkles, Feather, Heart, Compass } from 'lucide-react';

export default function OurStoryModal({ isOpen, onClose, onExploreClick }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#321D25]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#FFFDFB] rounded-3xl border border-[#F6C6D2] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FCE7ED] text-[#7F2347] hover:bg-[#9E315A] hover:text-[#FFFDFB] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.3em] uppercase text-[#9E315A]">
            <Sparkles className="w-4 h-4" />
            <span>OUR HERITAGE STORY</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D25]">
            Where Every Thread Tells a Story
          </h2>

          <p className="font-serif text-lg text-[#7F2347] italic">
            “Founded on the belief that fast fashion can never replace the soul of deliberate slow craft.”
          </p>

          <div className="w-16 h-0.5 bg-[#C95C7C] mx-auto rounded-full mt-2"></div>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
          
          <div className="space-y-4 text-sm text-[#321D25]/85 leading-relaxed">
            <h3 className="font-serif text-xl font-bold text-[#7F2347]">
              The ThreadTales Origin
            </h3>
            <p>
              THREADTALES was born in a sunlit studio where continuous spools of dusk-pink cotton thread were transformed into tactile luxury accessories.
            </p>
            <p>
              We view crochet not as an old pastime, but as a fine architectural art form. Each loop is measured, pulled, and locked by hand to form timeless shapes that last generations.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md border border-[#F6C6D2]">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
              alt="Crochet Artisan Hands"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7F2347]/40 to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-[10px] font-bold tracking-widest text-[#FFFDFB] uppercase bg-[#9E315A]/80 px-3 py-1 rounded-full">
              Hand-Loomed in Paris & NYC
            </div>
          </div>

        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#FCE7ED]">
          <div className="bg-[#FFF5F7] p-5 rounded-2xl border border-[#F6C6D2]/60 text-center space-y-2">
            <Feather className="w-6 h-6 text-[#9E315A] mx-auto" />
            <h4 className="font-serif font-bold text-base text-[#321D25]">Organic Yarns</h4>
            <p className="text-xs text-[#321D25]/75">100% GOTS certified organic Egyptian cotton & velvet wools.</p>
          </div>
          <div className="bg-[#FFF5F7] p-5 rounded-2xl border border-[#F6C6D2]/60 text-center space-y-2">
            <Heart className="w-6 h-6 text-[#9E315A] mx-auto" />
            <h4 className="font-serif font-bold text-base text-[#321D25]">Fair-Trade Guild</h4>
            <p className="text-xs text-[#321D25]/75">Empowering master women weavers with honorable living wages.</p>
          </div>
          <div className="bg-[#FFF5F7] p-5 rounded-2xl border border-[#F6C6D2]/60 text-center space-y-2">
            <Compass className="w-6 h-6 text-[#9E315A] mx-auto" />
            <h4 className="font-serif font-bold text-base text-[#321D25]">Heirloom Standard</h4>
            <p className="text-xs text-[#321D25]/75">Every piece comes with a signed certificate & serial number.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              onClose();
              onExploreClick();
            }}
            className="px-8 py-4 bg-[#9E315A] hover:bg-[#7F2347] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg transition-all"
          >
            EXPLORE THE ATELIER COLLECTION
          </button>
        </div>

      </div>
    </div>
  );
}
