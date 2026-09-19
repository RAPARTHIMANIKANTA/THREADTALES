import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function WishlistDrawer({ isOpen, onClose, wishlistIds, onToggleWishlist, onAddToCart }) {
  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#321D25]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDFB] shadow-2xl border-l border-[#F6C6D2] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#FFF5F7] border-b border-[#F6C6D2] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#FCE7ED] flex items-center justify-center text-[#9E315A]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#321D25]">
                  SAVED WISHLIST
                </h2>
                <p className="text-xs text-[#C95C7C] font-medium">
                  {wishlistedProducts.length} Favorites Saved
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#321D25] hover:text-[#9E315A] hover:bg-[#FCE7ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-[#FCE7ED] flex items-center justify-center text-[#9E315A]">
                  <Heart className="w-10 h-10 stroke-[1.25]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#321D25]">
                  No Favorites Saved Yet
                </h3>
                <p className="text-xs text-[#321D25]/70 max-w-xs">
                  Tap the heart icon on any creation in our collection to curate your personal THREADTALES wishlist.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex space-x-4 p-4 rounded-2xl bg-[#FFF5F7]/60 border border-[#F6C6D2]/60 relative"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-[#FCE7ED]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-[#321D25] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className="text-[#C95C7C] hover:text-[#9E315A] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#C95C7C] font-semibold mt-0.5">
                        {product.category} • ${product.price}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onToggleWishlist(product.id);
                      }}
                      className="mt-2 w-full py-2 bg-[#9E315A] hover:bg-[#7F2347] text-[#FFFDFB] text-[11px] font-semibold tracking-wider uppercase rounded-full flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>MOVE TO BAG</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-[#FFF5F7] border-t border-[#F6C6D2]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#FFFDFB] border border-[#9E315A] text-[#9E315A] font-semibold text-xs tracking-widest uppercase rounded-full hover:bg-[#FCE7ED]"
            >
              CONTINUE BROWSING
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
