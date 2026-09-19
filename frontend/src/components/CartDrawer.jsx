import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 2500;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#301B25]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDFB] shadow-2xl border-l border-[#F7C9D5] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#FFF7F9] border-b border-[#F7C9D5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#F7C9D5] flex items-center justify-center text-[#70213F]">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#301B25]">
                  YOUR SHOPPING BAG
                </h2>
                <p className="text-xs text-[#C65A7B] font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'Creation' : 'Creations'} Selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#301B25] hover:text-[#9D3158] hover:bg-[#F7C9D5]/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F7C9D5]/30 px-6 py-3 border-b border-[#F7C9D5]/60">
            <div className="flex justify-between text-[11px] font-semibold text-[#70213F] mb-1.5">
              <span>
                {subtotal >= freeShippingThreshold 
                  ? "🎉 You have unlocked Free Shipping!" 
                  : `Add ₹${(freeShippingThreshold - subtotal).toFixed(0)} more for Free Shipping`}
              </span>
              <span>{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F7C9D5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#9D3158] transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-[#F7C9D5]/40 flex items-center justify-center text-[#9D3158]">
                  <ShoppingBag className="w-10 h-10 stroke-[1.25]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#301B25]">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-[#301B25]/70 max-w-xs">
                  Discover handcrafted crochet bags, bouquets, and accessories waiting to tell your story.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#9D3158] text-[#FFFDFB] font-semibold text-xs tracking-widest uppercase rounded-full shadow-md"
                >
                  EXPLORE CATALOG
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedColor || ''}`}
                  className="flex space-x-4 p-4 rounded-2xl bg-[#FFF7F9]/60 border border-[#F7C9D5]/60 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-[#F7C9D5]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-[#301B25] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedColor)}
                          className="text-[#C65A7B] hover:text-[#9D3158] p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#C65A7B] font-semibold mt-0.5">
                        {item.category} • ID: {item.id}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 bg-[#FFFDFB] border border-[#F7C9D5] rounded-full px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                          className="text-xs font-bold text-[#70213F] px-1 hover:text-[#9D3158]"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-[#301B25] w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                          className="text-xs font-bold text-[#70213F] px-1 hover:text-[#9D3158]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif font-bold text-base text-[#9D3158]">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#FFF7F9] border-t border-[#F7C9D5] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#301B25]/80">
                  <span>Subtotal</span>
                  <span className="font-serif text-sm font-bold text-[#301B25]">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[#301B25]/80">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#9D3158]">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹150'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#301B25] pt-2 border-t border-[#F7C9D5]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-[#70213F]">
                    ₹{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 150)).toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#C65A7B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9D3158]" />
                <span>Supabase Protected Atelier Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
