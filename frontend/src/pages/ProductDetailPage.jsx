import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductDetailPage({ onAddToCart, onToggleWishlist, wishlistIds }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#9D3158');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);

  const handleAdd = () => {
    onAddToCart({ ...product, selectedColor, quantity });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#301B25] hover:text-[#9D3158] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-[#FFFDFB] p-6 sm:p-10 rounded-3xl border border-[#F7C9D5]/60 shadow-sm">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7C9D5]/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 bg-[#FFFDFB]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#F7C9D5] text-[10px] font-bold text-[#70213F] uppercase tracking-wider">
            {product.handcraftHours}
          </div>
        </div>

        {/* Right: Specifications & Purchasing Form */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#9D3158] uppercase">
              {product.category} • ATELIER PIECE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25] mt-1">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-[#301B25] ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-[#C65A7B]">({product.reviewsCount} Atelier Reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#9D3158]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-base text-[#301B25]/40 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-sm text-[#301B25]/80 leading-relaxed">
            {product.description}
          </p>

          <div className="bg-[#FFF7F9] p-4 rounded-2xl border border-[#F7C9D5]/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#C65A7B] font-semibold uppercase">Yarn Material:</span>
              <span className="font-bold text-[#301B25]">{product.yarnComposition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#C65A7B] font-semibold uppercase">Dimensions:</span>
              <span className="font-bold text-[#301B25]">{product.dimensions}</span>
            </div>
          </div>

          {product.colors && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">
                Select Thread Color Tone
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-[#301B25] scale-110 shadow-md' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-[#F7C9D5]/50 text-[#70213F] font-bold hover:bg-[#F7C9D5]"
              >
                -
              </button>
              <span className="text-base font-bold text-[#301B25] w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-[#F7C9D5]/50 text-[#70213F] font-bold hover:bg-[#F7C9D5]"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#F7C9D5]">
            {addedNotice && (
              <div className="p-3 rounded-xl bg-[#F7C9D5] text-[#70213F] text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Added to your THREADTALES Shopping Bag!</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG • ${(product.price * quantity).toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                className={`p-4 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-[#9D3158] text-[#FFFDFB] border-[#9D3158]'
                    : 'bg-[#FFFDFB] text-[#301B25] border-[#F7C9D5] hover:bg-[#F7C9D5]/50'
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-[#C65A7B] font-semibold text-center pt-2">
              <div className="flex items-center justify-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[#9D3158]" />
                <span>Express Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-[#9D3158]" />
                <span>Handmade Guarantee</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#9D3158]" />
                <span>7-Day Return Policy</span>
              </div>
            </div>

            {/* Prominent 7-Day Return Policy Showcase Box */}
            <div className="p-4 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] space-y-1.5 text-xs text-[#301B25]">
              <div className="flex items-center space-x-2 text-[#9D3158] font-bold uppercase tracking-wider text-[11px]">
                <RefreshCw className="w-4 h-4 text-[#9D3158]" />
                <span>7-Day Easy Return & Replacement Guarantee</span>
              </div>
              <p className="text-[#301B25]/80 text-[11px] leading-relaxed">
                Enjoy hassle-free 7-day returns & exchanges from the date of delivery on all handcrafted crochet creations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
