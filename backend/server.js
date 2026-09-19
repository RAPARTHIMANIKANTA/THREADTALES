import express from 'express';
import cors from 'cors';
import './config/env.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { buildRagIndex } from './services/ragService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'THREADTALES Express & Supabase Backend Server',
    tablesConnected: [
      'profiles',
      'wishlists',
      'cart_items',
      'orders',
      'order_items',
      'contact_inquiries',
      'custom_product_requests',
      'order_tracking'
    ],
    timestamp: new Date().toISOString()
  });
});

// Build RAG Vector Index from products.json on server boot
try {
  buildRagIndex();
} catch (err) {
  console.error('Initial RAG Indexing Error:', err);
}

// Start Server
app.listen(PORT, () => {
  console.log(`✨ THREADTALES Backend Server listening on http://localhost:${PORT}`);
});
