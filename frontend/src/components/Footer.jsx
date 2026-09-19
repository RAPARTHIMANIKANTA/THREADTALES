import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Share2, MessageCircle, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function Footer({ onOpenStory }) {
  // Dynamically extract actual product categories from PRODUCTS (products.json)
  const categories = useMemo(() => {
    const extracted = PRODUCTS.map(p => p.category)
      .filter(Boolean)
      .map(c => c.trim())
      .filter(c => c !== '');

    const uniqueCategories = [];
    const seen = new Set();

    for (const cat of extracted) {
      const normalized = cat.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        uniqueCategories.push(cat);
      }
    }

    return uniqueCategories;
  }, []);

  return (
    <footer id="footer" className="bg-[#FFFDFB] pt-20 pb-12 px-4 sm:px-8 border-t border-[#F6C6D2] relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#7F2347] block">
                THREADTALES
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C95C7C]">
                Where every thread tells a story.
              </p>
            </Link>
            
            <p className="text-xs text-[#321D25]/70 max-w-sm leading-relaxed">
              THREADTALES is an independent luxury handmade studio specializing in premium crochet keychains, fashion shoulder bags, hair accessories, everlasting bouquets, and artisan home decor.
            </p>

            <div className="flex space-x-3 pt-2">
              {[Globe, Share2, MessageCircle, Sparkles].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-[#FFF5F7] border border-[#F6C6D2] flex items-center justify-center text-[#7F2347] hover:bg-[#9E315A] hover:text-[#FFFDFB] transition-colors"
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </a>
              ))}
            </div>
          </div>


          {/* Quick Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Dynamic Real Product Categories */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#321D25]">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-[#321D25]/70">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link to="/shop" className="hover:text-[#9E315A] transition-colors">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Atelier Info */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#321D25]">
                Atelier
              </h4>
              <ul className="space-y-2 text-xs text-[#321D25]/70">
                <li>
                  <Link to="/about" className="hover:text-[#9E315A] transition-colors">
                    Our Story & Craft
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#9E315A] transition-colors">
                    Artisan Philosophy
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#9E315A] transition-colors">
                    Yarn Sustainability
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#9E315A] transition-colors">
                    Care Instructions
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors">
                    Custom Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#321D25]">
                Customer Care
              </h4>
              <ul className="space-y-2 text-xs text-[#321D25]/70">
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors font-bold text-[#9E315A]">
                    7-Day Easy Return Policy ✨
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors">
                    Returns & Exchange Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors">
                    Authenticity Guarantee
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9E315A] transition-colors">
                    Contact Studio Support
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FCE7ED] flex flex-col sm:flex-row items-center justify-between text-xs text-[#C95C7C] gap-4">
          <div className="flex items-center space-x-1">
            <span>© 2026 THREADTALES Studio. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#9E315A] fill-current" />
            <span>in Premium Cotton & Acrylic Yarn.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-[#321D25]/70 uppercase tracking-widest">
            <span className="text-[#9E315A] font-bold">✨ 7-DAY RETURN POLICY</span>
            <span>Terms of Service</span>
            <span>Atelier Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
