import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CollectionsPage from './pages/CollectionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import AiAssistantModal from './components/AiAssistantModal';
import { PRODUCTS } from './data/products';

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="pt-36 pb-24 px-4 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-10 h-10 border-3 border-[#9D3158] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#301B25]">Authenticating with Supabase Atelier...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function MainApp() {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  
  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const handleOpenAi = (query = '') => {
    setAiQuery(query);
    setIsAiOpen(true);
  };

  // Sync Cart and Wishlist from Supabase database tables and LocalStorage on User Login/Logout
  useEffect(() => {
    if (!user) {
      // Clear state when user signs out
      setCartItems([]);
      setWishlistIds([]);
      return;
    }

    const userId = user.id;

    // 1. Fetch user wishlist from Supabase wishlists table + LocalStorage backup
    const syncWishlist = async () => {
      let fetchedIds = [];

      // Read local storage cache first
      try {
        const localSaved = localStorage.getItem(`threadtales_wishlist_${userId}`);
        if (localSaved) {
          fetchedIds = JSON.parse(localSaved);
        }
      } catch (e) {}

      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', userId);

        if (!error && data) {
          const dbIds = data.map((item) => item.product_id);
          // Merge dbIds and local cached ids
          const combined = Array.from(new Set([...fetchedIds, ...dbIds]));
          setWishlistIds(combined);
          localStorage.setItem(`threadtales_wishlist_${userId}`, JSON.stringify(combined));
        } else if (fetchedIds.length > 0) {
          setWishlistIds(fetchedIds);
        } else {
          setWishlistIds([]);
        }
      } catch (err) {
        console.error('Database wishlist sync note:', err);
        setWishlistIds(fetchedIds);
      }
    };

    // 2. Fetch user cart from Supabase cart_items table
    const syncCart = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId);

        if (!error && data) {
          const formattedCart = data.map((item) => ({
            id: item.product_id,
            cart_db_id: item.id,
            name: item.product_name,
            image: item.product_image,
            price: Number(item.price),
            quantity: item.quantity,
            selectedColor: item.color || '#9D3158',
            size: item.size || 'Standard'
          }));
          setCartItems(formattedCart);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Database cart sync note:', err);
      }
    };

    syncWishlist();
    syncCart();
  }, [user]);

  // Cart operations with database & local persistence
  const handleAddToCart = async (product) => {
    const color = product.selectedColor || product.colors?.[0] || '#9D3158';
    const qty = product.quantity || 1;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [
        ...prev,
        {
          ...product,
          selectedColor: color,
          quantity: qty
        }
      ];
    });

    // Save to Supabase cart_items table if user is logged in
    if (user) {
      try {
        const { data: existingDb } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .eq('color', color)
          .maybeSingle();

        if (existingDb) {
          await supabase
            .from('cart_items')
            .update({ quantity: existingDb.quantity + qty })
            .eq('id', existingDb.id);
        } else {
          await supabase
            .from('cart_items')
            .insert([{
              user_id: user.id,
              product_id: product.id,
              product_name: product.name,
              product_image: product.image,
              price: product.price,
              quantity: qty,
              color: color,
              size: product.size || 'Standard'
            }]);
        }
      } catch (e) {
        console.error('Cart DB insert note:', e);
      }
    }
  };

  const handleUpdateCartQuantity = async (id, selectedColor, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, selectedColor);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedColor === selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('user_id', user.id)
          .eq('product_id', id)
          .eq('color', selectedColor || '#9D3158');
      } catch (e) {
        console.error('Cart qty update DB note:', e);
      }
    }
  };

  const handleRemoveCartItem = async (id, selectedColor) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedColor === selectedColor))
    );

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id)
          .eq('color', selectedColor || '#9D3158');
      } catch (e) {
        console.error('Cart delete DB note:', e);
      }
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (e) {
        console.error('Clear cart DB note:', e);
      }
    }
  };

  // Wishlist operations with database & local persistence (WISHLIST ONLY, DOES NOT TOUCH CART)
  const handleToggleWishlist = async (id) => {
    const isPresent = wishlistIds.includes(id);

    const updatedIds = isPresent
      ? wishlistIds.filter((item) => item !== id)
      : [...wishlistIds, id];

    setWishlistIds(updatedIds);

    if (user) {
      try {
        localStorage.setItem(`threadtales_wishlist_${user.id}`, JSON.stringify(updatedIds));

        if (isPresent) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', id);
        } else {
          const prodObj = PRODUCTS.find((p) => p.id === id) || { name: 'Crochet Item', price: 0, image: '' };
          await supabase
            .from('wishlists')
            .insert([{
              user_id: user.id,
              product_id: id,
              product_name: prodObj.name,
              product_image: prodObj.image,
              price: prodObj.price
            }]);
        }
      } catch (e) {
        console.error('Wishlist DB toggle note:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F9] text-[#301B25] relative flex flex-col justify-between">
      
      {/* Navigation Bar (Visible on all routes) */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAi={handleOpenAi}
      />

      {/* Page Routing */}
      <div className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                onOpenAi={handleOpenAi}
              />
            } 
          />

          <Route 
            path="/shop" 
            element={
              <ShopPage
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            } 
          />

          <Route 
            path="/collections" 
            element={
              <CollectionsPage
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            } 
          />

          <Route 
            path="/about" 
            element={<AboutPage />} 
          />

          <Route 
            path="/contact" 
            element={<ContactPage />} 
          />

          <Route 
            path="/product/:id" 
            element={
              <ProductDetailPage
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            } 
          />

          <Route 
            path="/login" 
            element={<LoginPage />} 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile/orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage 
                  cartItems={cartItems}
                  onClearCart={handleClearCart}
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {/* Footer (Visible on all routes) */}
      <Footer />

      {/* Modals & Slide-over Drawers */}
      {selectedProduct && (
        <ProductQuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Global THREADTALES AI Assistant Chat Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialQuery={aiQuery}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MainApp />
      </BrowserRouter>
    </AuthProvider>
  );
}
