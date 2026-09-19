import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, Shield, Truck, RefreshCw, Tag } from 'lucide-react';

export default function ProductQuickViewModal({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#301B25]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#FFFDFB] rounded-3xl border border-[#F7C9D5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FFFDFB]/80 hover:bg-[#F7C9D5]/60 text-[#301B25] flex items-center justify-center transition-colors border border-[#F7C9D5]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-[#F7C9D5]/30 aspect-square md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 bg-[#FFFDFB]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#F7C9D5] text-[10px] font-bold text-[#70213F] uppercase tracking-wider">
            {product.availability} In Stock • ID: {product.id}
          </div>
        </div>

        {/* Right: Real Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#9D3158] uppercase">
                {product.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#301B25] mt-1">
                {product.name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-3xl font-bold text-[#9D3158]">
                ₹{product.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#301B25]/80 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Real JSON Material & Size Specs */}
            <div className="bg-[#FFF7F9] p-4 rounded-2xl border border-[#F7C9D5]/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#C65A7B] font-semibold uppercase">Material:</span>
                <span className="font-bold text-[#301B25] text-right">{product.material}</span>
              </div>
              {product.size && (
                <div className="flex justify-between">
                  <span className="text-[#C65A7B] font-semibold uppercase">Dimensions:</span>
                  <span className="font-bold text-[#301B25]">{product.size.width} x {product.size.height}</span>
                </div>
              )}
            </div>

            {/* Occasions Badges */}
            {product.occasions && product.occasions.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#301B25]/70 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-[#9D3158]" />
                  <span>Perfect For Occasions</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="px-3 py-1 bg-[#F7C9D5]/40 text-[#70213F] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#F7C9D5]/60"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
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
                  onClick={() => setQuantity(Math.min(product.availability || 10, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-[#F7C9D5]/50 text-[#70213F] font-bold hover:bg-[#F7C9D5]"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
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
                <span>ADD TO BAG • ₹{(product.price * quantity).toFixed(0)}</span>
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

          </div>

        </div>

      </div>
    </div>
  );
}
