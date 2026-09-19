import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Package, LogOut, Sparkles, ArrowRight, Clock, CheckCircle2, Truck, RefreshCw, Ban, RotateCcw, AlertTriangle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user, profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL query param ?tab=orders or hash #orders
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') === 'orders' || location.hash === '#orders') ? 'orders' : 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [doorNumber, setDoorNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [villageBlock, setVillageBlock] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync activeTab when location URL changes
  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    if (qParams.get('tab') === 'orders' || location.hash === '#orders') {
      setActiveTab('orders');
    } else if (qParams.get('tab') === 'profile') {
      setActiveTab('profile');
    }
  }, [location]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDoorNumber(profile.door_number || '');
      setStreetName(profile.street_name || '');
      setVillageBlock(profile.village_block || '');
      setCity(profile.city || '');
      setStateName(profile.state || '');
      setCountry(profile.country || 'India');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);

      let localOrders = [];
      try {
        const localSaved = localStorage.getItem(`threadtales_orders_${user.id}`);
        if (localSaved) {
          localOrders = JSON.parse(localSaved);
        }
      } catch (e) {}

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Merge Supabase orders with local backup (deduplicated by id)
          const dbOrderIds = new Set(data.map(o => o.id));
          const extraLocal = localOrders.filter(o => !dbOrderIds.has(o.id));
          const merged = [...data, ...extraLocal];
          merged.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
          setOrders(merged);
          localStorage.setItem(`threadtales_orders_${user.id}`, JSON.stringify(merged));
        } else if (localOrders.length > 0) {
          setOrders(localOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders(localOrders);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderToCancel) => {
    if (!orderToCancel || !user) return;
    if (!window.confirm(`Are you sure you want to cancel Order #${orderToCancel.order_number}?`)) return;

    try {
      const updatedStatus = 'Cancelled';
      const updatedTime = new Date().toISOString();

      // 1. Update Supabase orders table
      const { error } = await supabase
        .from('orders')
        .update({ status: updatedStatus, updated_at: updatedTime })
        .eq('id', orderToCancel.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // 2. Insert tracking event
      try {
        await supabase
          .from('order_tracking')
          .insert([{
            order_id: orderToCancel.id,
            status: 'Cancelled',
            description: 'Order cancelled by customer from profile portal.'
          }]);
      } catch (tErr) {}

      // 3. Update state
      const updatedOrders = orders.map(o => o.id === orderToCancel.id ? { ...o, status: 'Cancelled' } : o);
      setOrders(updatedOrders);

      // 4. Update localStorage
      try {
        localStorage.setItem(`threadtales_orders_${user.id}`, JSON.stringify(updatedOrders));
      } catch (lErr) {}

    } catch (err) {
      console.error('Cancel order error:', err);
      alert('Failed to cancel order: ' + (err.message || 'Error occurred'));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ 
        full_name: fullName, 
        phone,
        door_number: doorNumber,
        street_name: streetName,
        village_block: villageBlock,
        city,
        state: stateName,
        country,
        pincode
      });
      setEditingProfile(false);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#F7C9D5]/60">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.3em] uppercase text-[#9D3158] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTab === 'profile' ? 'MEMBER ACCOUNT' : 'ORDER HISTORY & TRACKING'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#301B25]">
            {activeTab === 'profile' ? 'My Atelier Profile' : 'My Atelier Orders'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FFFDFB] border border-[#9D3158] text-[#9D3158] hover:bg-[#9D3158] hover:text-white font-semibold text-xs tracking-wider uppercase rounded-full transition-all shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Luxury Tab Switcher Bar */}
      <div className="flex items-center justify-center p-1.5 bg-[#FFFDFB] border border-[#F7C9D5] rounded-full max-w-md mx-auto shadow-sm">
        <button
          onClick={() => {
            setActiveTab('profile');
            navigate('/profile?tab=profile', { replace: true });
          }}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-serif font-bold tracking-[0.15em] uppercase transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md'
              : 'text-[#301B25]/75 hover:text-[#9D3158]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>MY PROFILE</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
            navigate('/profile?tab=orders', { replace: true });
          }}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-serif font-bold tracking-[0.15em] uppercase transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md'
              : 'text-[#301B25]/75 hover:text-[#9D3158]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>MY ORDERS ({orders.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PROFILE DETAILS ONLY */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-[#FFFDFB] p-6 sm:p-10 rounded-3xl border border-[#F7C9D5]/80 shadow-xl shadow-[#9D3158]/5 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Holographic Passport Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#70213F] via-[#9D3158] to-[#4A1428] text-white shadow-lg space-y-4 relative overflow-hidden border border-white/20">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[10px] font-bold tracking-[0.25em] text-[#F7C9D5] uppercase">
                THREADTALES ATELIER PASSPORT
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/40">
                ACTIVE MEMBER
              </span>
            </div>

            <div className="flex items-center space-x-4 pt-1">
              <div className="w-14 h-14 rounded-full bg-[#FFFDFB] text-[#70213F] font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#F7C9D5] shadow-sm shrink-0">
                {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg text-white truncate">
                  {profile?.full_name || 'Atelier Member'}
                </h3>
                <p className="text-xs text-[#F7C9D5] font-medium truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {!editingProfile ? (
            <div className="space-y-5 pt-2 text-xs">
              <div className="bg-[#FFF7F9] p-5 rounded-2xl border border-[#F7C9D5]/80 space-y-4 text-[#301B25]">
                <div>
                  <span className="text-[#9D3158] font-bold uppercase tracking-wider text-[10px] block mb-1">Full Name:</span>
                  <p className="text-[#301B25] font-semibold text-base">{profile?.full_name || 'Name not set'}</p>
                </div>
                <div className="pt-2 border-t border-[#F7C9D5]/40">
                  <span className="text-[#9D3158] font-bold uppercase tracking-wider text-[10px] block mb-1">Phone Number:</span>
                  <p className="text-[#301B25] font-semibold text-base">{profile?.phone || 'Phone not set'}</p>
                </div>
                <div className="pt-2 border-t border-[#F7C9D5]/40">
                  <span className="text-[#9D3158] font-bold uppercase tracking-wider text-[10px] block mb-1">Verified Email:</span>
                  <p className="text-[#301B25]/80 font-medium text-sm">{user?.email}</p>
                </div>
              </div>

              <div>
                <span className="text-[#C65A7B] font-bold uppercase tracking-wider text-[10px] block mb-1">Database User ID:</span>
                <span className="text-[11px] font-mono text-[#301B25]/60 bg-[#FFF7F9] px-3 py-2 rounded-xl block truncate border border-[#F7C9D5]/50">{user?.id}</span>
              </div>

              <button
                onClick={() => setEditingProfile(true)}
                className="w-full py-4 bg-[#FFF7F9] border border-[#F7C9D5] text-[#9D3158] hover:bg-[#9D3158] hover:text-white font-semibold text-xs tracking-[0.2em] uppercase rounded-full transition-all shadow-2xs"
              >
                EDIT PROFILE DETAILS
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#C65A7B] font-bold uppercase tracking-wider block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#C65A7B] font-bold uppercase tracking-wider block">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-semibold text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-wider uppercase rounded-full shadow-md transition-all"
                >
                  {savingProfile ? 'SAVING DB...' : 'SAVE TO DATABASE'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-6 py-4 bg-[#FFF7F9] text-[#301B25]/70 font-semibold text-xs rounded-full border border-[#F7C9D5]"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: ORDERS DETAILS ONLY */}
      {activeTab === 'orders' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#301B25] flex items-center space-x-2">
              <Package className="w-6 h-6 text-[#9D3158]" />
              <span>MY ORDERS</span>
            </h2>
            <span className="text-xs font-bold text-[#C65A7B] uppercase tracking-wider">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
            </span>
          </div>

          {loadingOrders ? (
            <div className="bg-[#FFFDFB] p-12 rounded-3xl border border-[#F7C9D5]/60 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#9D3158] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#301B25]/70">Loading your persistent orders from Supabase...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#FFFDFB] p-12 rounded-3xl border border-[#F7C9D5]/60 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7C9D5]/40 text-[#9D3158] flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#301B25]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#301B25]/70 max-w-sm mx-auto">
                Your order history is empty. Explore our catalog of handcrafted crochet items to place your first order.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#9D3158] text-[#FFFDFB] font-semibold text-xs tracking-widest uppercase rounded-full shadow-md"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FFFDFB] p-6 sm:p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F7C9D5]/40 gap-2">
                    <div>
                      <span className="font-sans font-bold text-lg text-[#70213F] block">
                        Order #{order.order_number}
                      </span>
                      <span className="text-xs text-[#C65A7B]">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                        order.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-[#F7C9D5] text-[#70213F]'
                      }`}>
                        {order.status}
                      </span>
                      <span className="font-sans font-bold text-2xl text-[#9D3158]">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Thumbnails */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 overflow-x-auto py-1">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-[#FFF7F9] p-2 rounded-2xl border border-[#F7C9D5]/60 shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-14 h-14 object-cover rounded-xl bg-[#F7C9D5]"
                          />
                          <div className="text-xs pr-2">
                            <p className="font-serif font-bold text-[#301B25] line-clamp-1 max-w-[140px]">{item.product_name}</p>
                            <p className="text-[#C65A7B] font-medium">Qty: {item.quantity} • ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="px-4 py-3 bg-[#FFFDFB] border border-rose-300 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-all text-center"
                        >
                          Cancel Order
                        </button>
                      )}

                      <Link
                        to={`/profile/orders/${order.id}`}
                        className="px-6 py-3 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] text-xs font-semibold tracking-wider uppercase rounded-full shadow-sm text-center"
                      >
                        View & Track
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
