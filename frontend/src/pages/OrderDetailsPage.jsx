import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin, AlertCircle, ShieldCheck, CreditCard, Edit3, Printer, Check, X, Ban, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Edit Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Cancel Order Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Changed my mind');
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !orderId) return;
      setLoading(true);
      setUnauthorized(false);

      let foundOrder = null;
      let foundItems = [];

      // Check local storage backup first
      try {
        const localSavedStr = localStorage.getItem(`threadtales_orders_${user.id}`);
        if (localSavedStr) {
          const localOrders = JSON.parse(localSavedStr);
          const match = localOrders.find(o => o.id === orderId || o.order_number === orderId);
          if (match) {
            foundOrder = match;
            foundItems = match.order_items || [];
          }
        }
      } catch (e) {}

      try {
        // Query order strictly belonging to authenticated user
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (orderData) {
          foundOrder = orderData;

          // Query order items
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

          if (itemsData && itemsData.length > 0) {
            foundItems = itemsData;
          }

          // Query tracking timeline
          const { data: trackingData } = await supabase
            .from('order_tracking')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: true });

          setTrackingEvents(trackingData || []);
        }
      } catch (err) {
        console.error('Error fetching order details from DB:', err);
      }

      if (!foundOrder) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      setOrder(foundOrder);
      setItems(foundItems);

      // Populate Edit Address initial states
      const addr = foundOrder.shipping_address || foundOrder.delivery_address || {};
      setEditFullName(addr.fullName || addr.full_name || profile?.full_name || user.email.split('@')[0]);
      setEditPhone(addr.phone || profile?.phone || '');
      setEditStreet(addr.street || addr.street_name || addr.address || '');
      setEditCity(addr.city || '');
      setEditPostalCode(addr.postalCode || addr.pincode || '');

      setLoading(false);
    };

    fetchOrderDetails();
  }, [user, orderId, profile]);

  const handleSaveUpdatedAddress = async (e) => {
    e.preventDefault();
    if (!order) return;
    setSavingAddress(true);
    setSaveSuccessMsg('');

    try {
      const updatedAddress = {
        fullName: editFullName.trim(),
        email: user.email,
        phone: editPhone.trim(),
        street: editStreet.trim(),
        city: editCity.trim(),
        postalCode: editPostalCode.trim(),
        country: 'India'
      };

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          shipping_address: updatedAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setOrder(data);
      setIsEditingAddress(false);
      setSaveSuccessMsg('Delivery details updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);

    } catch (err) {
      console.error('Update address error:', err);
      alert('Failed to update address: ' + (err.message || 'Error occurred'));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancellingOrder(true);
    try {
      const updatedStatus = 'Cancelled';
      const updatedTime = new Date().toISOString();

      // 1. Update order status in Supabase orders table
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: updatedStatus,
          updated_at: updatedTime
        })
        .eq('id', order.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // 2. Insert tracking log event for cancellation
      try {
        await supabase
          .from('order_tracking')
          .insert([{
            order_id: order.id,
            status: 'Cancelled',
            description: `Order cancelled by customer. Reason: ${cancellationReason}`
          }]);
      } catch (tErr) {
        console.error('Tracking insert note:', tErr);
      }

      const updatedObj = data || { ...order, status: 'Cancelled', updated_at: updatedTime };
      setOrder(updatedObj);

      // 3. Update localStorage cache for instant persistence across logins
      try {
        const localKey = `threadtales_orders_${user.id}`;
        const localSavedStr = localStorage.getItem(localKey);
        if (localSavedStr) {
          const localOrders = JSON.parse(localSavedStr);
          const updatedList = localOrders.map(o => o.id === order.id ? { ...o, status: 'Cancelled' } : o);
          localStorage.setItem(localKey, JSON.stringify(updatedList));
        }
      } catch (lErr) {
        console.error('Local cache cancel note:', lErr);
      }

      setIsCancelModalOpen(false);
      setSaveSuccessMsg('Order has been cancelled successfully.');
      setTimeout(() => setSaveSuccessMsg(''), 5000);

    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order: ' + (err.message || 'Connection error'));
    } finally {
      setCancellingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 px-4 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-10 h-10 border-3 border-[#9D3158] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#301B25]">Loading order details & tracking status...</p>
      </div>
    );
  }

  if (unauthorized || !order) {
    return (
      <div className="pt-36 pb-24 px-4 text-center space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#301B25]">Access Denied</h2>
        <p className="text-xs text-[#301B25]/80">
          Order not found or you don't have access to this order.
        </p>
        <button
          onClick={() => navigate('/profile?tab=orders')}
          className="px-6 py-3 bg-[#9D3158] text-[#FFFDFB] text-xs font-semibold rounded-full uppercase tracking-wider shadow-md"
        >
          Return to My Orders
        </button>
      </div>
    );
  }

  // Address objects
  const addr = order.shipping_address || order.delivery_address || {};
  const recipientName = addr.fullName || addr.full_name || profile?.full_name || user.email;
  const recipientPhone = addr.phone || profile?.phone || 'Phone not set';
  const recipientStreet = addr.street || addr.street_name || addr.address || 'Address pending';
  const recipientCity = addr.city || '';
  const recipientPostalCode = addr.postalCode || addr.pincode || '';
  const recipientCountry = addr.country || 'India';
  const paymentMethodUsed = order.payment_method || 'Cash on Delivery';

  const isCancelled = (order.status || '').toLowerCase() === 'cancelled';

  // Tracking Timeline Statuses
  const allStatuses = [
    { key: 'Placed', label: 'Order Placed', desc: 'Order details recorded in THREADTALES Atelier.' },
    { key: 'Confirmed', label: 'Order Confirmed', desc: 'Artisan assigned to loom your crochet creation.' },
    { key: 'Handcrafting', label: 'Crafting & Quality Check', desc: 'Hand-stitching yarn loops with slow craft precision.' },
    { key: 'Shipping', label: 'Shipped via Express', desc: 'Package dispatched with authenticity certificate.' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent delivering your THREADTALES package.' },
    { key: 'Delivered', label: 'Delivered', desc: 'Handcrafted crochet piece received.' }
  ];

  const cancelledStatuses = [
    { key: 'Placed', label: 'Order Placed', desc: 'Original order details recorded.' },
    { key: 'Cancelled', label: 'Order Cancelled', desc: 'Cancellation requested by customer.' },
    { key: 'Halted', label: 'Shipment Halted', desc: 'Artisan crafting & courier dispatch stopped.' },
    { key: 'Resolved', label: 'Billing Nullified', desc: 'No package dispatch or pending charges.' }
  ];

  const displayStatuses = isCancelled ? cancelledStatuses : allStatuses;
  const currentStatusIndex = isCancelled
    ? cancelledStatuses.length - 1
    : allStatuses.findIndex(s => s.key.toLowerCase() === (order.status || 'placed').toLowerCase());

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile?tab=orders')}
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#301B25] hover:text-[#9D3158] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <div className="flex items-center space-x-3">
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFFDFB] border border-rose-300 text-rose-700 hover:bg-rose-600 hover:text-white font-semibold text-xs tracking-wider uppercase rounded-full transition-all shadow-2xs"
            >
              <Ban className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FFFDFB] border border-[#F7C9D5] text-[#70213F] hover:bg-[#FFF7F9] font-semibold text-xs tracking-wider uppercase rounded-full transition-all shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#9D3158]" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Order Header Banner */}
      <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-[#9D3158] uppercase">
              OFFICIAL ATELIER ORDER INVOICE
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
              order.status === 'Cancelled'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-[#F7C9D5] text-[#70213F]'
            }`}>
              {order.status}
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#301B25]">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-[#C65A7B] font-medium mt-1">
            Placed on {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        <div className="text-left md:text-right bg-[#FFF7F9] md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-none border-[#F7C9D5]/50">
          <span className="block text-xs font-bold text-[#C65A7B] uppercase tracking-wider">Total Amount Paid</span>
          <span className="font-sans text-3xl font-bold text-[#9D3158]">₹{order.total_amount}</span>
          <span className="block text-[10px] text-[#301B25]/70 font-semibold mt-0.5">Mode: {paymentMethodUsed}</span>
        </div>
      </div>

      {/* LIVE ORDER TRACKING TIMELINE */}
      <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#F7C9D5]/40 pb-4">
          <h2 className="font-serif text-xl font-bold text-[#70213F] flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#9D3158]" />
            <span>Live Order Tracking Timeline</span>
          </h2>
          <span className={`px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            isCancelled
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-[#F7C9D5] text-[#70213F]'
          }`}>
            Status: {order.status} {isCancelled ? '• Shipment Halted' : ''}
          </span>
        </div>

        {/* CANCELLED ORDER & SHIPMENT HALTED ALERT BANNER */}
        {isCancelled && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center space-x-2.5 text-rose-800 font-bold text-sm">
              <Ban className="w-5 h-5 text-rose-700 shrink-0" />
              <span>ORDER CANCELLED — COURIER DISPATCH & SHIPMENT HALTED</span>
            </div>
            <p className="text-xs text-rose-800/80 leading-relaxed">
              This order was cancelled by customer request. The artisan hand-weaving process and courier dispatch have been stopped immediately. No shipment or delivery will be made for Order #{order.order_number}.
            </p>
          </div>
        )}

        {/* Creative Line-Type Connected Thread Progress Bar Timeline */}
        <div className="relative pt-6 pb-2 px-2">
          
          {/* Background Track Line (Horizontal Progress Thread across steps) */}
          <div className="hidden lg:block absolute top-11 left-[8%] right-[8%] h-1.5 bg-[#F7C9D5]/50 rounded-full z-0">
            {/* Dynamic Active Progress Thread Line */}
            <div 
              className={`h-full rounded-full transition-all duration-700 shadow-xs ${
                isCancelled
                  ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700'
                  : 'bg-gradient-to-r from-[#70213F] via-[#9D3158] to-[#C65A7B]'
              }`}
              style={{
                width: `${((Math.max(0, currentStatusIndex)) / (displayStatuses.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Step Checkpoint Nodes Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCancelled ? 'lg:grid-cols-4' : 'lg:grid-cols-6'} gap-6 relative z-10`}>
            {displayStatuses.map((st, idx) => {
              const isCompleted = idx <= (currentStatusIndex >= 0 ? currentStatusIndex : 0);
              const isCurrent = idx === (currentStatusIndex >= 0 ? currentStatusIndex : 0);

              return (
                <div 
                  key={st.key}
                  className="flex flex-col items-center text-center space-y-3 group"
                >
                  {/* Circle Node Checkpoint on the Thread Line */}
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm relative ${
                      isCancelled
                        ? idx === 0
                          ? 'bg-[#70213F] text-[#FFFDFB]'
                          : 'bg-rose-700 text-white ring-2 ring-rose-300'
                        : isCurrent
                          ? 'bg-[#9D3158] text-[#FFFDFB] ring-4 ring-[#9D3158]/30 scale-110 shadow-md shadow-[#9D3158]/30'
                          : isCompleted
                            ? 'bg-[#70213F] text-[#FFFDFB] ring-2 ring-[#70213F]/20'
                            : 'bg-[#FFFDFB] text-[#301B25]/40 border-2 border-[#F7C9D5]'
                    }`}
                  >
                    {isCancelled ? (
                      idx === 0 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Ban className="w-5 h-5 stroke-[2.5]" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}

                    {!isCancelled && isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#9D3158] rounded-full ring-2 ring-white animate-ping" />
                    )}
                  </div>

                  {/* Step Description Card */}
                  <div 
                    className={`w-full p-4 rounded-2xl border transition-all duration-300 flex-1 flex flex-col justify-between ${
                      isCancelled
                        ? idx === 0
                          ? 'bg-[#FFFDFB] border-[#F7C9D5] text-[#301B25]'
                          : 'bg-rose-50 border-rose-200 text-rose-900 shadow-2xs'
                        : isCurrent
                          ? 'bg-[#FFF7F9] border-[#9D3158] shadow-sm ring-1 ring-[#9D3158]/30'
                          : isCompleted
                            ? 'bg-[#FFFDFB] border-[#F7C9D5] text-[#301B25]'
                            : 'bg-[#FFFDFB]/60 border-dashed border-[#F7C9D5]/60 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isCancelled
                          ? idx === 0 ? 'text-[#70213F]' : 'text-rose-800'
                          : isCurrent ? 'text-[#9D3158]' : isCompleted ? 'text-[#70213F]' : 'text-[#301B25]/40'
                      }`}>
                        {isCancelled && idx > 0 ? 'HALTED' : `STEP 0${idx + 1}`}
                      </span>
                      <h4 className={`font-serif font-bold text-xs leading-snug ${isCancelled && idx > 0 ? 'text-rose-900' : 'text-[#301B25]'}`}>
                        {st.label}
                      </h4>
                    </div>

                    <p className={`text-[10px] leading-normal mt-2 ${isCancelled && idx > 0 ? 'text-rose-800/80 font-medium' : 'text-[#301B25]/70'}`}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>

      {/* ORDERED PRODUCTS ITEM LIST */}
      <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
        <h2 className="font-serif text-xl font-bold text-[#70213F] flex items-center space-x-2">
          <Package className="w-5 h-5 text-[#9D3158]" />
          <span>Purchased Items ({items.length})</span>
        </h2>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5]/60 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#F7C9D5]"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#9D3158] uppercase tracking-widest">
                    PRODUCT ID: {item.product_id}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#301B25]">{item.product_name}</h3>
                  <p className="text-xs text-[#C65A7B]">Quantity: {item.quantity} • ₹{item.price} each</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-sans font-bold text-lg text-[#9D3158]">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELIVERY SHIPPING ADDRESS & EDIT OPTION + PAYMENT BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Delivery Shipping Address Card with Edit Option */}
        <div className="bg-[#FFFDFB] p-6 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-4 relative">
          <div className="flex items-center justify-between border-b border-[#F7C9D5]/40 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9D3158]">
              <MapPin className="w-4 h-4 text-[#9D3158]" />
              <span>Delivery Shipping Address</span>
            </div>
            
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FFF7F9] hover:bg-[#9D3158] hover:text-white border border-[#F7C9D5] text-[#9D3158] text-[10px] font-bold uppercase tracking-wider rounded-full transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditingAddress ? 'Cancel' : 'Edit Address'}</span>
            </button>
          </div>

          {!isEditingAddress ? (
            <div className="text-xs text-[#301B25] space-y-2 pt-1">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#C65A7B] block">Recipient Name:</span>
                <p className="font-bold text-sm text-[#301B25]">{recipientName}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#C65A7B] block">Street & Location:</span>
                <p className="font-medium text-[#301B25]">{recipientStreet}</p>
              </div>

              {recipientCity && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#C65A7B] block">City & PIN:</span>
                  <p className="font-medium text-[#301B25]">{recipientCity}{recipientPostalCode ? `, ${recipientPostalCode}` : ''} ({recipientCountry})</p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase text-[#C65A7B] block">Courier Contact Phone:</span>
                <p className="font-semibold text-[#9D3158]">{recipientPhone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#C65A7B] block">Account Email:</span>
                <p className="font-medium text-[#301B25]/80">{user.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveUpdatedAddress} className="space-y-3 pt-1 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#C65A7B] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#C65A7B] block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#C65A7B] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#C65A7B] block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={editPostalCode}
                    onChange={(e) => setEditPostalCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#C65A7B] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="flex-1 py-2.5 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-all"
                >
                  {savingAddress ? 'SAVING...' : 'SAVE ADDRESS'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2.5 bg-[#FFF7F9] text-[#301B25]/70 font-semibold text-xs rounded-xl border border-[#F7C9D5]"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Payment Summary & Guarantee Card */}
        <div className="bg-[#FFFDFB] p-6 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9D3158] border-b border-[#F7C9D5]/40 pb-3">
              <CreditCard className="w-4 h-4 text-[#9D3158]" />
              <span>Payment Details & Status</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F7C9D5]/30">
                <span className="text-[#301B25]/70 font-medium">Payment Method:</span>
                <span className="font-serif font-bold text-[#70213F]">{paymentMethodUsed}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F7C9D5]/30">
                <span className="text-[#301B25]/70 font-medium">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
                  {paymentMethodUsed === 'Cash on Delivery' ? 'Payable on Delivery' : 'Payment Confirmed'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F7C9D5]/30">
                <span className="text-[#301B25]/70 font-medium">Order Transaction ID:</span>
                <span className="font-mono text-[10px] text-[#301B25]/80">{order.id}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F7C9D5]/40 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9D3158]">
              <RotateCcw className="w-4 h-4 text-[#9D3158]" />
              <span>7-Day Return & Replacement Policy</span>
            </div>
            <p className="text-[11px] text-[#301B25]/80 leading-relaxed bg-[#FFF7F9] p-3 rounded-2xl border border-[#F7C9D5]/60">
              Not completely satisfied? All THREADTALES handcrafted creations are covered by our <strong className="text-[#9D3158]">7-Day Easy Return & Exchange Guarantee</strong> from the date of delivery.
            </p>
          </div>

          <div className="pt-2 border-t border-[#F7C9D5]/40 space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-[#70213F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Authentic Handcrafted Seal</span>
            </div>
            <p className="text-[10px] text-[#301B25]/70 leading-relaxed">
              Every creation is hand-loomed with organic cotton yarn loops and authentic craft certification.
            </p>
          </div>

        </div>

      </div>

      {/* CANCEL ORDER CONFIRMATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#301B25]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDFB] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#F7C9D5] shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-4 right-4 text-[#301B25]/60 hover:text-[#9D3158] p-1.5 rounded-full hover:bg-[#FFF7F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#301B25]">
                Cancel Order #{order.order_number}?
              </h3>
              <p className="text-xs text-[#301B25]/75 leading-relaxed">
                Are you sure you want to cancel this order? Once cancelled, our artisans will pause production on your handcrafted items.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold uppercase tracking-wider text-[#301B25] block">
                Reason for Cancellation
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
              >
                <option value="Changed my mind">Changed my mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Shipping time too long">Shipping time too long</option>
                <option value="Want to change address or payment">Want to change address or payment</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                className="flex-1 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-md transition-all disabled:opacity-60"
              >
                {cancellingOrder ? 'CANCELLING...' : 'YES, CANCEL ORDER'}
              </button>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-5 py-3.5 bg-[#FFF7F9] text-[#301B25]/80 font-bold text-xs rounded-full border border-[#F7C9D5] hover:bg-[#F7C9D5]/40"
              >
                KEEP ORDER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
