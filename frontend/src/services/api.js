const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(token, userId) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;
  return headers;
}

// ------------------------------------------------------------
// PRODUCTS
// ------------------------------------------------------------
export async function fetchProducts(category, search) {
  const params = new URLSearchParams();
  if (category && category !== 'ALL') params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products from backend API');
  const data = await res.json();
  return data.data;
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product details from backend API');
  const data = await res.json();
  return data.data;
}

// ------------------------------------------------------------
// AUTH & PROFILES
// ------------------------------------------------------------
export async function requestOtp(email) {
  const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send OTP code');
  return data;
}

export async function verifyOtpToken(email, token) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Verification code failed');
  return data;
}

export async function fetchProfileBackend(token, userId) {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data.profile;
}

export async function updateProfileBackend(profileData, token, userId) {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token, userId),
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data.profile;
}

// ------------------------------------------------------------
// ORDERS
// ------------------------------------------------------------
export async function createBackendOrder(orderData, token, userId) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(token, userId),
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create order on backend');
  return data;
}

export async function fetchUserOrders(token, userId) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user orders');
  return data.orders;
}

export async function fetchOrderDetails(orderId, token, userId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch order details');
  return data;
}

// ------------------------------------------------------------
// WISHLIST
// ------------------------------------------------------------
export async function fetchWishlistBackend(token, userId) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch wishlist');
  return data.wishlist;
}

export async function toggleWishlistBackend(product, token, userId) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'POST',
    headers: getAuthHeaders(token, userId),
    body: JSON.stringify({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      price: product.price
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to toggle wishlist');
  return data;
}

// ------------------------------------------------------------
// CART
// ------------------------------------------------------------
export async function fetchCartBackend(token, userId) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch cart items');
  return data.cartItems;
}

export async function addToCartBackend(item, token, userId) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: getAuthHeaders(token, userId),
    body: JSON.stringify({
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity || 1,
      color: item.selectedColor || item.color || '#9D3158',
      size: item.size || 'Standard'
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add item to cart');
  return data;
}

export async function updateCartQuantityBackend(cartItemId, quantity, token, userId) {
  const res = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token, userId),
    body: JSON.stringify({ quantity })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update cart quantity');
  return data;
}

export async function removeFromCartBackend(cartItemId, token, userId) {
  const res = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove cart item');
  return data;
}

export async function clearCartBackend(token, userId) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: getAuthHeaders(token, userId)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to clear cart');
  return data;
}

// ------------------------------------------------------------
// CONTACT INQUIRIES & CUSTOM REQUESTS
// ------------------------------------------------------------
export async function submitContactInquiry(inquiryData) {
  const res = await fetch(`${API_BASE_URL}/contact/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit contact inquiry');
  return data;
}

export async function submitCustomRequest(requestData) {
  const res = await fetch(`${API_BASE_URL}/contact/custom-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit custom product request');
  return data;
}

// ------------------------------------------------------------
// AI ASSISTANT RAG
// ------------------------------------------------------------
export async function askAiAssistant(message) {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to query AI Product Assistant');
  return data;
}
