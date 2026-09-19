import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-8 bg-[#FFF5F7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.3em] uppercase text-[#9E315A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY STORIES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#321D25]">
            Loved by Connoisseurs
          </h2>
          <p className="text-sm text-[#321D25]/75">
            Discover what fashion editors, interior stylists, and crochet collectors say about THREADTALES.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDFB] p-8 rounded-3xl border border-[#F6C6D2]/60 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-[#F6C6D2] absolute top-6 right-6 stroke-1" />

              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="font-serif italic text-base text-[#321D25] leading-relaxed">
                  “{item.comment}”
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-[#FCE7ED]">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F6C6D2]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#321D25]">{item.name}</h4>
                  <p className="text-xs text-[#C95C7C] font-semibold">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
