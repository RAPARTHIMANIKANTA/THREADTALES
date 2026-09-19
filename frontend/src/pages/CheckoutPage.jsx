import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, MapPin, CheckCircle, ArrowRight, AlertCircle, CreditCard, QrCode, Banknote, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage({ cartItems, onClearCart }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from user profile
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !fullName) setFullName(profile.full_name);
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.street_name && !street) setStreet(profile.street_name);
      if (profile.city && !city) setCity(profile.city);
      if (profile.pincode && !postalCode) setPostalCode(profile.pincode);
    }
  }, [profile]);

  // Protect route: Must be logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 2500 ? 0 : 150;
  const totalAmount = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="pt-36 pb-24 px-4 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#F7C9D5]/40 text-[#9D3158] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#301B25]">Your Cart is Empty</h2>
        <p className="text-xs text-[#301B25]/70">Add some handcrafted crochet creations before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#9D3158] text-[#FFFDFB] text-xs font-semibold rounded-full uppercase tracking-wider shadow-md"
        >
          Explore Atelier Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !street || !city || !phone) {
      setErrorMsg('Please complete all shipping address and contact details.');
      return;
    }

    setPlacingOrder(true);
    try {
      // 1. Generate unique official order number
      const orderNum = `TT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const deliveryAddress = {
        fullName: fullName.trim(),
        email: user.email,
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: 'India'
      };

      // 2. Insert into orders table (user_id = user.id)
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNum,
          total_amount: totalAmount,
          shipping_address: deliveryAddress,
          payment_method: paymentMethod,
          status: 'Placed'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Insert order items into order_items table
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: newOrder.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsErr) console.error('Order items insert notice:', itemsErr);

      // 4. Insert initial tracking log event into order_tracking table
      try {
        await supabase
          .from('order_tracking')
          .insert([{
            order_id: newOrder.id,
            status: 'Placed',
            description: `Order placed successfully via ${paymentMethod}.`
          }]);
      } catch (tErr) {
        console.error('Tracking log notice:', tErr);
      }

      // 5. Save order backup to localStorage for user.id to guarantee persistence across logins
      try {
        const fullOrderRecord = {
          ...newOrder,
          order_items: orderItemsToInsert
        };
        const localKey = `threadtales_orders_${user.id}`;
        const existingLocalStr = localStorage.getItem(localKey);
        const existingLocal = existingLocalStr ? JSON.parse(existingLocalStr) : [];
        const updatedLocal = [fullOrderRecord, ...existingLocal.filter(o => o.id !== newOrder.id)];
        localStorage.setItem(localKey, JSON.stringify(updatedLocal));
      } catch (lErr) {
        console.error('Local order save notice:', lErr);
      }

      // 6. Clear cart & redirect to Order Details page
      onClearCart();
      navigate(`/profile/orders/${newOrder.id}`);

    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please check connection and try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const paymentOptions = [
    {
      id: 'Cash on Delivery',
      label: 'Cash on Delivery (COD)',
      desc: 'Pay in cash upon courier delivery',
      icon: Banknote
    },
    {
      id: 'UPI / QR Code (GPay, PhonePe, Paytm)',
      label: 'UPI / QR Code',
      desc: 'Instant payment via GPay, PhonePe or Paytm',
      icon: QrCode
    },
    {
      id: 'Credit / Debit Card',
      label: 'Credit / Debit Card',
      desc: 'Visa, Mastercard, RuPay & American Express',
      icon: CreditCard
    },
    {
      id: 'Net Banking',
      label: 'Net Banking',
      desc: 'All major Indian banks supported',
      icon: Landmark
    }
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25]">
          Atelier Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#301B25]/75">
          Authenticated Account: <span className="font-bold text-[#9D3158]">{user.email}</span>
        </p>
        <div className="w-16 h-0.5 bg-[#C65A7B] mx-auto rounded-full"></div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Section: Delivery & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Shipping Form */}
          <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-sm font-serif font-bold text-[#70213F]">
              <MapPin className="w-5 h-5 text-[#9D3158]" />
              <span>1. Delivery & Contact Details</span>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#301B25] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sophia Laurent"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#301B25] block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House No, Street, Apartment or Block"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#301B25] block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai / Delhi / Bangalore"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#301B25] block mb-1">Postal / PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#301B25] block mb-1">Phone Number for Courier Updates *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection Card */}
          <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#F7C9D5]/40 pb-3">
              <div className="flex items-center space-x-2 text-sm font-serif font-bold text-[#70213F]">
                <CreditCard className="w-5 h-5 text-[#9D3158]" />
                <span>2. Select Payment Method</span>
              </div>
              <span className="text-[10px] font-bold text-[#C65A7B] uppercase tracking-wider">
                100% SECURE & ENCRYPTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = paymentMethod === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-[#FFF7F9] border-[#9D3158] ring-2 ring-[#9D3158]/20 shadow-xs'
                        : 'bg-[#FFFDFB] border-[#F7C9D5]/60 hover:border-[#9D3158]/50 hover:bg-[#FFF7F9]/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-[#9D3158] text-[#FFFDFB]' : 'bg-[#FFF7F9] text-[#70213F] border border-[#F7C9D5]/60'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif font-bold text-xs text-[#301B25] block truncate">{opt.label}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#9D3158] shrink-0" />}
                      </div>
                      <p className="text-[10px] text-[#301B25]/70 leading-snug">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Section: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#70213F] flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#9D3158]" />
            <span>Order Summary ({cartItems.length})</span>
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5]/50 text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-[#F7C9D5]" />
                  <div>
                    <p className="font-serif font-bold text-[#301B25] line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-[#C65A7B]">Qty: {item.quantity} • ₹{item.price}</p>
                  </div>
                </div>
                <span className="font-sans font-bold text-[#9D3158]">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F7C9D5]/60 space-y-2 text-xs">
            <div className="flex justify-between text-[#301B25]/80">
              <span>Subtotal</span>
              <span className="font-sans font-bold text-[#301B25]">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-[#301B25]/80">
              <span>Shipping Fee</span>
              <span className="font-bold text-[#9D3158]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-[#301B25]/80 pt-1">
              <span>Payment Mode</span>
              <span className="font-bold text-[#70213F] truncate max-w-[150px]">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#301B25] pt-3 border-t border-[#F7C9D5]">
              <span>Total Amount</span>
              <span className="font-sans text-2xl font-bold text-[#70213F]">₹{totalAmount.toFixed(0)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placingOrder}
            className="w-full py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {placingOrder ? (
              <span>PLACING ATELIER ORDER...</span>
            ) : (
              <>
                <span>CONFIRM & PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex flex-col items-center justify-center space-y-1 text-[10px] text-[#C65A7B] pt-1">
            <div className="flex items-center space-x-1 font-bold text-[#9D3158]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official THREADTALES 7-Day Easy Return Guarantee</span>
            </div>
            <span className="text-[#301B25]/60">Hassle-free 7-day returns & replacements on all orders</span>
          </div>

        </div>

      </form>
    </div>
  );
}
