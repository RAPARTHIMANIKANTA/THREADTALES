import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? PRODUCTS.slice(0, 3)
    : PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#321D25]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDFB] rounded-3xl border border-[#F6C6D2] shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-6 h-6 text-[#9E315A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bags, bouquets, amigurumi plushies, accessories..."
            className="w-full pl-14 pr-12 py-4 rounded-full bg-[#FFF5F7] border border-[#F6C6D2] text-[#321D25] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9E315A]"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-2 text-[#321D25] hover:text-[#9E315A] hover:bg-[#FCE7ED] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#C95C7C]">
            <span>{query ? `Search Results (${results.length})` : 'Popular Atelier Creations'}</span>
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="text-[#9E315A] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-[#FFF5F7] border border-transparent hover:border-[#F6C6D2] transition-all cursor-pointer group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#FCE7ED]"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-[#9E315A] tracking-wider uppercase">
                    {product.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#321D25] group-hover:text-[#9E315A]">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#321D25]/60 line-clamp-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-lg text-[#7F2347]">${product.price}</span>
                  <ArrowRight className="w-4 h-4 text-[#9E315A] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
