import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Package, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount, wishlistCount, onOpenCart, onOpenWishlist, onOpenSearch, onOpenAi }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateToProfile = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (user) {
      navigate('/profile?tab=profile');
    } else {
      navigate('/login');
    }
  };

  const handleNavigateToOrders = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (user) {
      navigate('/profile?tab=orders');
    } else {
      navigate('/login');
    }
  };

  const handleLogoutAction = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const handleOpenAiAssistant = () => {
    setMobileMenuOpen(false);
    if (onOpenAi) onOpenAi();
  };

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-300">
      <nav 
        className={`max-w-7xl mx-auto rounded-full px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${
          scrolled 
            ? 'bg-[#FFFDFB]/95 shadow-md shadow-[#9D3158]/5 border border-[#F7C9D5]/60 backdrop-blur-md' 
            : 'bg-[#FFFDFB]/80 backdrop-blur-sm border border-[#F7C9D5]/40 shadow-sm'
        }`}
      >
        {/* Left: Brand Logo */}
        <Link 
          to="/"
          className="group text-left focus:outline-none"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#70213F] group-hover:text-[#9D3158] transition-colors">
            THREADTALES
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-[#C65A7B] font-semibold">
            Luxury Crochet Studio
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative text-xs tracking-[0.18em] font-semibold py-1 group transition-colors ${
                  isActive ? 'text-[#9D3158]' : 'text-[#301B25] hover:text-[#9D3158]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#9D3158] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* AI Assistance Desktop Navigation Link */}
          <button
            onClick={handleOpenAiAssistant}
            className="relative text-xs tracking-[0.18em] font-semibold py-1 group transition-colors text-[#9D3158] hover:text-[#70213F] flex items-center space-x-1.5 focus:outline-none"
            title="Open AI Product Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9D3158] animate-pulse" />
            <span>AI ASSISTANCE</span>
            <span className="absolute bottom-0 left-0 h-[1.5px] bg-[#9D3158] transition-all duration-300 w-0 group-hover:w-full" />
          </button>
        </div>

        {/* Right: Actions Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* AI Assistant Quick Icon Button */}
          <button 
            onClick={handleOpenAiAssistant}
            className="p-2 text-[#9D3158] hover:text-[#70213F] hover:bg-[#F7C9D5]/40 rounded-full transition-all duration-200 flex items-center justify-center relative"
            title="THREADTALES AI Assistant"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#9D3158] rounded-full animate-ping" />
          </button>

          {/* Search Icon */}
          <button 
            onClick={onOpenSearch}
            className="p-2 text-[#301B25] hover:text-[#9D3158] hover:bg-[#F7C9D5]/40 rounded-full transition-all duration-200"
            title="Search"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Icon */}
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-[#301B25] hover:text-[#9D3158] hover:bg-[#F7C9D5]/40 rounded-full transition-all duration-200"
            title="Wishlist"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9D3158] text-[#FFFDFB] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Icon */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-[#301B25] hover:text-[#9D3158] hover:bg-[#F7C9D5]/40 rounded-full transition-all duration-200"
            title="Shopping Bag"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#70213F] text-[#FFFDFB] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Icon Dropdown */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="relative p-2 text-[#301B25] hover:text-[#9D3158] hover:bg-[#F7C9D5]/40 rounded-full transition-all duration-200 flex items-center space-x-1"
              title="My Account"
              aria-label="User Account Options"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
              {user && (
                <span className="w-2.5 h-2.5 bg-[#9D3158] rounded-full ring-2 ring-[#FFFDFB]" />
              )}
            </button>

            {/* Luxury Brand Dropdown Popup */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-60 bg-[#FFFDFB]/95 backdrop-blur-md border border-[#F7C9D5] shadow-2xl shadow-[#70213F]/15 rounded-3xl p-2.5 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Option 1: MY PROFILE */}
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full flex items-center space-x-3.5 p-3 rounded-2xl bg-[#FFF7F9]/80 hover:bg-[#F7C9D5]/40 border border-[#F7C9D5]/50 text-[#301B25] hover:text-[#9D3158] transition-all group text-left shadow-2xs hover:shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDFB] group-hover:bg-[#9D3158] group-hover:text-white flex items-center justify-center text-[#9D3158] border border-[#F7C9D5]/60 transition-all shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-serif text-xs font-bold tracking-wider text-[#301B25] group-hover:text-[#9D3158] transition-colors">
                      MY PROFILE
                    </span>
                    <span className="block text-[10px] text-[#C65A7B] font-medium truncate">
                      Personal info & account
                    </span>
                  </div>
                </button>

                {/* Option 2: MY ORDERS */}
                <button
                  onClick={handleNavigateToOrders}
                  className="w-full flex items-center space-x-3.5 p-3 rounded-2xl bg-[#FFF7F9]/80 hover:bg-[#F7C9D5]/40 border border-[#F7C9D5]/50 text-[#301B25] hover:text-[#9D3158] transition-all group text-left shadow-2xs hover:shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDFB] group-hover:bg-[#9D3158] group-hover:text-white flex items-center justify-center text-[#9D3158] border border-[#F7C9D5]/60 transition-all shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-serif text-xs font-bold tracking-wider text-[#301B25] group-hover:text-[#9D3158] transition-colors">
                      MY ORDERS
                    </span>
                    <span className="block text-[10px] text-[#C65A7B] font-medium truncate">
                      Order history & tracking
                    </span>
                  </div>
                </button>

                {/* Sign Out or Sign In Action */}
                <div className="pt-1">
                  {user ? (
                    <button
                      onClick={handleLogoutAction}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-2xl text-xs font-bold text-[#9D3158] hover:bg-[#9D3158] hover:text-white transition-all border border-[#9D3158]/40 shadow-2xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>SIGN OUT</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNavigateToProfile}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-bold text-xs tracking-wider uppercase rounded-2xl shadow-xs transition-all"
                    >
                      <span>SIGN IN / REGISTER</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#301B25] hover:text-[#9D3158] md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mx-auto max-w-lg bg-[#FFFDFB] border border-[#F7C9D5] rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left font-serif text-base tracking-[0.15em] py-2 border-b border-[#F7C9D5]/60 transition-colors ${
                    isActive ? 'text-[#9D3158] font-bold' : 'text-[#301B25] hover:text-[#9D3158]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* AI Assistance Link in Mobile Menu */}
            <button
              onClick={handleOpenAiAssistant}
              className="text-left font-serif text-base tracking-[0.15em] py-2 border-b border-[#F7C9D5]/60 text-[#9D3158] font-bold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#9D3158]" />
              <span>AI ASSISTANCE</span>
            </button>

            {/* Mobile Account Options */}
            <div className="pt-3 space-y-2 border-t border-[#F7C9D5]">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D3158] block">
                ACCOUNT OPTIONS
              </span>

              <button
                onClick={handleNavigateToProfile}
                className="w-full flex items-center justify-between py-2 text-xs font-serif font-bold tracking-wider text-[#301B25] hover:text-[#9D3158] border-b border-[#F7C9D5]/40"
              >
                <span className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#9D3158]" />
                  <span>MY PROFILE</span>
                </span>
                <span className="text-[10px] text-[#C65A7B]">View →</span>
              </button>

              <button
                onClick={handleNavigateToOrders}
                className="w-full flex items-center justify-between py-2 text-xs font-serif font-bold tracking-wider text-[#301B25] hover:text-[#9D3158] border-b border-[#F7C9D5]/40"
              >
                <span className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-[#9D3158]" />
                  <span>MY ORDERS</span>
                </span>
                <span className="text-[10px] text-[#C65A7B]">Track →</span>
              </button>

              {user ? (
                <button
                  onClick={handleLogoutAction}
                  className="w-full py-2.5 mt-2 bg-[#FFF7F9] border border-[#F7C9D5] text-[#9D3158] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT</span>
                </button>
              ) : (
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full py-2.5 mt-2 bg-[#9D3158] text-[#FFFDFB] font-bold text-xs uppercase tracking-wider rounded-xl text-center block"
                >
                  SIGN IN / REGISTER
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#C65A7B] uppercase tracking-[0.2em]">
            <span>Crafted in Velvet & Silk</span>
            <span>Est. 2026</span>
          </div>
        </div>
      )}
    </header>
  );
}
