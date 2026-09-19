import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles, ArrowRight, Layers, Tag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function FeaturedCollection({ onSelectProduct, onAddToCart, onToggleWishlist, wishlistIds }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Select 6 curated flagship products for homepage spotlight
  const spotlightProducts = [
    PRODUCTS.find(p => p.id === 'CR005') || PRODUCTS[4], // Crochet Rose Shoulder Bag
    PRODUCTS.find(p => p.id === 'CR029') || PRODUCTS[28], // Handcrafted Crochet Rose Bouquet
    PRODUCTS.find(p => p.id === 'CR001') || PRODUCTS[0],  // Crochet Butterfly Keychain
    PRODUCTS.find(p => p.id === 'CR013') || PRODUCTS[12], // Crochet Floral Hanging Planter
    PRODUCTS.find(p => p.id === 'CR021') || PRODUCTS[20], // Crochet Bow Mini Handbag
    PRODUCTS.find(p => p.id === 'CR031') || PRODUCTS[30], // Colorful Crochet Rose Bouquet
  ].filter(Boolean);

  // Category showcase cards
  const categoryBanners = [
    {
      name: 'Fashion Bags & Totes',
      categoryKey: 'Bags',
      count: PRODUCTS.filter(p => p.category === 'Bags').length,
      desc: 'Woven shoulder bags featuring pearl-beaded straps & scalloped lace detailing.',
      image: '/images/Crochet Rose Shoulder Bag.jpeg'
    },
    {
      name: 'Everlasting Bouquets',
      categoryKey: 'Bouquets',
      count: PRODUCTS.filter(p => p.category === 'Bouquets').length,
      desc: 'Hand-looped roses, tulips & sunflowers wrapped in rustic kraft twine and silk ribbons.',
      image: '/images/Handcrafted Crochet Rose Bouquet.jpeg'
    },
    {
      name: 'Artisan Keychains',
      categoryKey: 'Keychains',
      count: PRODUCTS.filter(p => p.category === 'Keychains').length,
      desc: 'Playful butterfly, cherry, bee & panda keychains for keys, totes, and daily gifting.',
      image: '/images/Crochet Butterfly Keychain.jpeg'
    },
    {
      name: 'Botanical Home Decor',
      categoryKey: 'Home Decor',
      count: PRODUCTS.filter(p => p.category === 'Home Decor').length,
      desc: 'Charming wall hangings, evil eye sets & floral hanging planters to warm any space.',
      image: '/images/Crochet Floral Hanging Planter.jpeg'
    }
  ];

  return (
    <section id="collection" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDFB] via-[#FFF7F9] to-[#FFFDFB] relative overflow-hidden">
      
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#F7C9D5]/25 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
            <Sparkles className="w-4 h-4 text-[#9D3158]" />
            <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
              THREADTALES SIGNATURE CREATIONS
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#301B25]">
            Curated Atelier Highlights
          </h2>

          <p className="text-sm sm:text-base text-[#301B25]/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Each creation is hand-looped with patience and slow-craft principles. Explore our signature categories and flagship pieces woven in soft cotton and velvet yarn.
          </p>

          <div className="w-20 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
        </div>

        {/* Visual Category Feature Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryBanners.map((banner) => (
            <div
              key={banner.name}
              onClick={() => navigate('/shop')}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer border border-[#F7C9D5] shadow-md hover:shadow-2xl hover:border-[#9D3158] transition-all duration-300 flex flex-col justify-end p-6"
            >
              <img
                src={banner.image}
                alt={banner.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/95 via-[#70213F]/40 to-transparent"></div>

              <div className="relative z-10 space-y-2 text-[#FFFDFB]">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#F7C9D5] bg-[#9D3158]/80 px-2.5 py-0.5 rounded-full inline-block">
                  {banner.count} Creations
                </span>
                <h3 className="font-serif text-2xl font-bold">{banner.name}</h3>
                <p className="text-xs text-[#FFFDFB]/80 line-clamp-2">{banner.desc}</p>
                <div className="pt-2 flex items-center text-xs font-bold text-[#F7C9D5] space-x-1 uppercase tracking-wider group-hover:text-white">
                  <span>Shop Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spotlight Flagship Products Grid */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#F7C9D5]/60 pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#301B25]">
                Flagship Spotlight Pieces
              </h3>
              <p className="text-xs text-[#C65A7B] font-semibold mt-0.5">
                Hand-picked creations loved by our atelier community
              </p>
            </div>

            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2 bg-[#FFFDFB] hover:bg-[#9D3158] text-[#70213F] hover:text-[#FFFDFB] border border-[#F7C9D5] rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <span>Explore All 35 Creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlightProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5]/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#9D3158]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Container with Badges & Hover Zoom */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F7C9D5]/30">
                    
                    {/* Stock Availability Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#70213F] text-[#FFFDFB] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {product.availability} Left in Stock
                      </span>
                    </div>

                    {/* Wishlist Heart Button */}
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
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#70213F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-3 bg-[#FFFDFB] text-[#70213F] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg hover:bg-[#F7C9D5]/60 transition-colors flex items-center justify-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <Eye className="w-4 h-4 text-[#9D3158]" />
                        <span>VIEW DETAILS</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category */}
                      <div className="flex items-center justify-between text-[11px] text-[#C65A7B] font-bold uppercase tracking-wider mb-1.5">
                        <span>{product.category}</span>
                        <span>ID: {product.id}</span>
                      </div>

                      {/* Product Name */}
                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-xl font-bold text-[#301B25] hover:text-[#9D3158] cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Description excerpt */}
                      <p className="text-xs text-[#301B25]/70 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-3 border-t border-[#F7C9D5]/50 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-2xl font-bold text-[#9D3158]">
                          ₹{product.price}
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-3 bg-[#F7C9D5]/50 hover:bg-[#9D3158] text-[#70213F] hover:text-[#FFFDFB] rounded-2xl transition-all duration-200 transform active:scale-95"
                        title="Add to Shopping Bag"
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

        {/* Discover Full Atelier Banner */}
        <div className="bg-[#FFFDFB] border border-[#F7C9D5] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#301B25]">
              Looking for something specific?
            </h3>
            <p className="text-xs sm:text-sm text-[#301B25]/70">
              Filter our complete catalog of 35 handcrafted creations by price, category, occasion, or material.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-md shrink-0 flex items-center space-x-2"
          >
            <span>Go to Atelier Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
