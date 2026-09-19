import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Heart, ShoppingBag, Eye, Star, X, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ShopPage({ onSelectProduct, onAddToCart, onToggleWishlist, wishlistIds }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedOccasion, setSelectedOccasion] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Dynamic Category Extraction from PRODUCTS (products.json)
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

    return ['ALL', ...uniqueCategories];
  }, []);

  // Dynamic Occasions Extraction from PRODUCTS (products.json)
  const allOccasions = useMemo(() => {
    const set = new Set();
    PRODUCTS.forEach(p => {
      if (Array.isArray(p.occasions)) {
        p.occasions.forEach(occ => {
          if (occ && occ.trim()) set.add(occ.trim());
        });
      }
    });
    return ['ALL', ...Array.from(set)];
  }, []);

  // Calculate Active Filters Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedOccasion !== 'ALL') count++;
    if (selectedPriceRange !== 'ALL') count++;
    if (inStockOnly) count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedOccasion, selectedPriceRange, inStockOnly, searchQuery]);

  // Reset All Filters
  const handleResetAllFilters = () => {
    setSelectedCategory('ALL');
    setSelectedOccasion('ALL');
    setSelectedPriceRange('ALL');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Category Filter
    if (selectedCategory !== 'ALL') {
      const selectedNorm = selectedCategory.trim().toLowerCase();
      result = result.filter(p => p.category && p.category.trim().toLowerCase() === selectedNorm);
    }

    // 2. Occasion Filter
    if (selectedOccasion !== 'ALL') {
      const occNorm = selectedOccasion.trim().toLowerCase();
      result = result.filter(p => Array.isArray(p.occasions) && p.occasions.some(o => o.trim().toLowerCase() === occNorm));
    }

    // 3. Price Range Filter
    if (selectedPriceRange === 'under-500') {
      result = result.filter(p => p.price <= 500);
    } else if (selectedPriceRange === '500-1000') {
      result = result.filter(p => p.price >= 500 && p.price <= 1000);
    } else if (selectedPriceRange === '1000-1500') {
      result = result.filter(p => p.price >= 1000 && p.price <= 1500);
    } else if (selectedPriceRange === 'above-1500') {
      result = result.filter(p => p.price >= 1500);
    }

    // 4. Availability Filter
    if (inStockOnly) {
      result = result.filter(p => p.availability > 0);
    }

    // 5. Keyword Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => (p.name && p.name.toLowerCase().includes(q)) ||
             (p.description && p.description.toLowerCase().includes(q)) ||
             (p.category && p.category.toLowerCase().includes(q)) ||
             (p.material && p.material.toLowerCase().includes(q)) ||
             (Array.isArray(p.occasions) && p.occasions.some(occ => occ.toLowerCase().includes(q)))
      );
    }

    // 6. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (parseFloat(b.rating) || 5) - (parseFloat(a.rating) || 5));
    }

    return result;
  }, [selectedCategory, selectedOccasion, selectedPriceRange, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Dedicated Shop Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D3158]" />
          <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
            THREADTALES CATALOG
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#301B25]">
          The Atelier Shop
        </h1>

        <p className="text-sm sm:text-base text-[#301B25]/75 leading-relaxed font-normal">
          Explore our complete collection of handcrafted dusk-pink crochet fashion bags, everlasting floral arrangements, heirloom plushies, and home accessories.
        </p>

        <div className="w-16 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDFB] p-6 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
        
        {/* Category Tabs (Dynamically Generated from products.json) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#F7C9D5]/40">
          {categories.map((cat) => {
            const isSelected = selectedCategory.trim().toLowerCase() === cat.trim().toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md shadow-[#9D3158]/20'
                    : 'bg-[#FFF7F9] text-[#301B25]/80 hover:bg-[#F7C9D5]/50 hover:text-[#70213F]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Sort & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D3158]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C65A7B] hover:text-[#9D3158]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Interactive Filter Toggle Button */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-[#C65A7B] mr-1">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'creation' : 'creations'}
            </span>

            {/* Interactive Sliders Filter Icon Button */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                isFilterPanelOpen || activeFilterCount > 0
                  ? 'bg-[#9D3158] text-[#FFFDFB] border-[#9D3158] shadow-sm'
                  : 'bg-[#FFF7F9] text-[#301B25] border-[#F7C9D5] hover:bg-[#F7C9D5]/50'
              }`}
              title="Toggle Advanced Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="uppercase text-[11px]">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FFFDFB] text-[#9D3158] text-[10px] font-bold flex items-center justify-center ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Advanced Filter Panel */}
        {isFilterPanelOpen && (
          <div className="pt-6 border-t border-[#F7C9D5]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
            
            {/* Filter 1: Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9D3158] block">
                Sort Order
              </label>
              <div className="flex flex-col space-y-1.5">
                {[
                  { id: 'featured', label: 'Featured Atelier' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' }
                ].map((sortOption) => (
                  <button
                    key={sortOption.id}
                    onClick={() => setSortBy(sortOption.id)}
                    className={`text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      sortBy === sortOption.id
                        ? 'bg-[#9D3158] text-[#FFFDFB] font-bold'
                        : 'bg-[#FFF7F9] text-[#301B25]/80 hover:bg-[#F7C9D5]/40'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Price Ranges */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9D3158] block">
                Price Range
              </label>
              <div className="flex flex-col space-y-1.5">
                {[
                  { id: 'ALL', label: 'All Prices' },
                  { id: 'under-500', label: 'Under ₹500' },
                  { id: '500-1000', label: '₹500 - ₹1,000' },
                  { id: '1000-1500', label: '₹1,000 - ₹1,500' },
                  { id: 'above-1500', label: 'Above ₹1,500' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedPriceRange === range.id
                        ? 'bg-[#9D3158] text-[#FFFDFB] font-bold'
                        : 'bg-[#FFF7F9] text-[#301B25]/80 hover:bg-[#F7C9D5]/40'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Occasions (Derived dynamically from products.json) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9D3158] block">
                Occasion
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-none">
                {allOccasions.map((occ) => {
                  const isSelected = selectedOccasion.trim().toLowerCase() === occ.trim().toLowerCase();
                  return (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#9D3158] text-[#FFFDFB] font-bold shadow-xs'
                          : 'bg-[#FFF7F9] text-[#301B25]/80 hover:bg-[#F7C9D5]/50 border border-[#F7C9D5]/60'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 4: Stock Availability & Reset Actions */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#9D3158] block">
                  Availability
                </label>
                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5]/60 cursor-pointer hover:bg-[#F7C9D5]/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9D3158] focus:ring-[#9D3158]"
                  />
                  <span className="text-xs font-semibold text-[#301B25]">In Stock Only</span>
                </label>
              </div>

              <div className="space-y-2">
                {activeFilterCount > 0 && (
                  <div className="text-[11px] text-[#C65A7B] font-semibold text-center">
                    {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''} applied
                  </div>
                )}
                <button
                  onClick={handleResetAllFilters}
                  className="w-full py-2.5 bg-[#FFF7F9] hover:bg-[#9D3158] text-[#70213F] hover:text-[#FFFDFB] border border-[#F7C9D5] rounded-full text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-[#F7C9D5]/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C65A7B]">Active Filters:</span>
            
            {selectedCategory !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-xs font-semibold border border-[#9D3158]/30">
                <span>Cat: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('ALL')} className="hover:text-[#70213F]">
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}

            {selectedOccasion !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-xs font-semibold border border-[#9D3158]/30">
                <span>Occasion: {selectedOccasion}</span>
                <button onClick={() => setSelectedOccasion('ALL')} className="hover:text-[#70213F]">
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}

            {selectedPriceRange !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-xs font-semibold border border-[#9D3158]/30">
                <span>Price: {selectedPriceRange}</span>
                <button onClick={() => setSelectedPriceRange('ALL')} className="hover:text-[#70213F]">
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-xs font-semibold border border-[#9D3158]/30">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-[#70213F]">
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-xs font-semibold border border-[#9D3158]/30">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#70213F]">
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetAllFilters}
              className="text-[11px] font-bold text-[#9D3158] hover:underline ml-2 uppercase"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-3">
            <p className="font-serif text-xl text-[#301B25]">No creations found matching your selection.</p>
            <button
              onClick={handleResetAllFilters}
              className="px-6 py-2.5 bg-[#9D3158] text-[#FFFDFB] text-xs font-semibold rounded-full uppercase tracking-wider shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5]/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#9D3158]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F7C9D5]/30">
                  <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                    {product.isBestseller && (
                      <span className="bg-[#9D3158] text-[#FFFDFB] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        Bestseller
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-[#70213F] text-[#FFFDFB] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        New In
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
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

                  {/* Quick View Hover */}
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

                {/* Content */}
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
                    <div>
                      <div className="flex items-center space-x-1 text-amber-500 mb-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold text-[#301B25]">{product.rating || '5.0'}</span>
                        <span className="text-[10px] text-[#C65A7B]">({product.reviewsCount || 12})</span>
                      </div>
                      <span className="font-serif text-xl font-bold text-[#9D3158]">
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
          })
        )}
      </div>

    </div>
  );
}





