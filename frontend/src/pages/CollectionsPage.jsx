import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Eye, Heart, ShoppingBag, Star, ArrowLeft, Grid } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function CollectionsPage({ onSelectProduct, onAddToCart, onToggleWishlist, wishlistIds }) {
  // Start with no active collection selected so product list is hidden initially
  const [activeCollection, setActiveCollection] = useState(null);

  // Dynamic Collection Extraction from PRODUCTS (products.json)
  const collectionsList = useMemo(() => {
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

    const categorySubtitles = {
      'Keychains': 'Cute & playful handmade crochet keychains for bags, keys, and gifting.',
      'Accessories': 'Delicate hair clips, hair ties, and wearable handmade embellishments.',
      'Bags': 'Structured shoulder bags and tote bags woven with cotton yarn.',
      'Bouquets': 'Hand-looped roses, tulips, and everlasting floral arrangements.',
      'Home Decor': 'Charming hanging decor, wall hangings, and botanical accents.',
      'Bags & Accessories': 'Stylish mini handbags and combined fashion pieces.',
      'Crochet Flowers': 'Romantic long-lasting single flowers and floral vines.'
    };

    return uniqueCategories.map(cat => {
      const sampleItem = PRODUCTS.find(p => p.category?.trim().toLowerCase() === cat.toLowerCase());
      return {
        id: cat,
        name: cat,
        subtitle: categorySubtitles[cat] || `Handcrafted ${cat.toLowerCase()} created with slow craft principles.`,
        image: sampleItem?.image || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
      };
    });
  }, []);

  const displayedProducts = useMemo(() => {
    if (!activeCollection) return [];
    if (activeCollection === 'ALL') return PRODUCTS;
    const normActive = activeCollection.trim().toLowerCase();
    return PRODUCTS.filter(p => p.category && p.category.trim().toLowerCase() === normActive);
  }, [activeCollection]);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D3158]" />
          <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
            CURATED CATEGORIES
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#301B25]">
          Atelier Collections
        </h1>

        <p className="text-sm sm:text-base text-[#301B25]/75 leading-relaxed font-normal">
          Explore specialized capsule collections designed around distinct artisanal crochet techniques.
        </p>

        <div className="w-16 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
      </div>

      {/* Visual Collections Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#301B25]">
            Select a Collection
          </h2>
          {activeCollection && (
            <button
              onClick={() => setActiveCollection(null)}
              className="text-xs font-semibold text-[#9D3158] hover:underline flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Collections</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsList.map((col) => {
            const normId = col.id.trim().toLowerCase();
            const count = PRODUCTS.filter(p => p.category && p.category.trim().toLowerCase() === normId).length;
            const isSelected = activeCollection && activeCollection.trim().toLowerCase() === normId;

            return (
              <div
                key={col.id}
                onClick={() => setActiveCollection(isSelected ? null : col.id)}
                className={`relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer group border-2 transition-all duration-300 shadow-md ${
                  isSelected ? 'border-[#9D3158] ring-4 ring-[#9D3158]/20 scale-102' : 'border-[#F7C9D5] hover:border-[#9D3158]'
                }`}
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/90 via-[#70213F]/40 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-[#FFFDFB] space-y-1.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#F7C9D5] bg-[#9D3158]/80 px-2.5 py-0.5 rounded-full inline-block">
                    {count} Atelier Creations
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{col.name}</h3>
                  <p className="text-xs text-[#FFFDFB]/80 line-clamp-2">{col.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditional Rendering: Product Grid appears ONLY when a collection is selected */}
      {!activeCollection ? (
        <div className="py-12 bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5]/60 text-center space-y-3">
          <Grid className="w-8 h-8 text-[#9D3158] mx-auto opacity-60" />
          <h3 className="font-serif text-xl font-bold text-[#301B25]">Choose a collection above</h3>
          <p className="text-xs text-[#301B25]/70 max-w-md mx-auto">
            Click on any of the collection cards above (e.g. Bags, Keychains, Bouquets) to view its specific handcrafted creations.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Filtered Products Title */}
          <div className="pt-8 border-t border-[#F7C9D5]/60 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#301B25]">
                {activeCollection === 'ALL' ? 'All Collection Pieces' : `${activeCollection} Collection`}
              </h2>
              <p className="text-xs text-[#C65A7B] font-semibold mt-0.5">
                Showing {displayedProducts.length} handcrafted {displayedProducts.length === 1 ? 'creation' : 'creations'}
              </p>
            </div>

            <button
              onClick={() => setActiveCollection(null)}
              className="px-4 py-2 bg-[#FFF7F9] hover:bg-[#9D3158] text-[#70213F] hover:text-[#FFFDFB] border border-[#F7C9D5] rounded-full text-xs font-semibold tracking-wider transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {displayedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5]/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#9D3158]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F7C9D5]/30">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isWishlisted 
                          ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md scale-110' 
                          : 'bg-[#FFFDFB]/80 text-[#301B25] hover:bg-[#FFFDFB] hover:text-[#9D3158]'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-3 bg-[#FFFDFB] text-[#70213F] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg hover:bg-[#F7C9D5]/60 transition-colors flex items-center justify-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <Eye className="w-4 h-4 text-[#9D3158]" />
                        <span>VIEW PRODUCT</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#C65A7B] font-bold uppercase tracking-wider mb-1.5">
                        <span>{product.category}</span>
                        <span>ID: {product.id}</span>
                      </div>

                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-xl font-bold text-[#301B25] hover:text-[#9D3158] cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#301B25]/70 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F7C9D5]/50 flex items-center justify-between">
                      <span className="font-serif text-xl font-bold text-[#9D3158]">
                        ₹{product.price}
                      </span>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-3 bg-[#F7C9D5]/50 hover:bg-[#9D3158] text-[#70213F] hover:text-[#FFFDFB] rounded-2xl transition-all duration-200"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
