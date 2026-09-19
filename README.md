# THREADTALES Atelier — Luxury Crochet Studio

THREADTALES is an independent luxury handmade studio application featuring handcrafted dusk-pink crochet fashion shoulder bags, everlasting floral arrangements, artisan plushies, keychains, and home decor.

---

## 📁 Clean Decoupled Folder Architecture

```
Threadtales/
├── frontend/             # React 19 + Vite + Tailwind CSS Web Application
│   ├── src/              # App pages, components, context, data & styling
│   ├── public/           # Product images & static assets
│   ├── index.html        # HTML entry point
│   ├── vite.config.js    # Vite configuration
│   ├── package.json      # Frontend dependencies
│   ├── .env              # Frontend environment configuration
│   └── README.md         # Dedicated Frontend Documentation
│
├── backend/              # Node.js + Express API Backend Server
│   ├── config/           # Database & environment configurations
│   ├── controllers/      # Auth, Orders, Cart, Wishlist, Products controllers
│   ├── data/             # Products catalog & RAG vector index
│   ├── middleware/       # Express Auth middleware
│   ├── routes/           # REST API Endpoints (/api/auth, /api/orders, etc.)
│   ├── services/         # Brevo Email OTP & Groq RAG AI Services
│   ├── server.js         # Main Express API server
│   ├── package.json      # Backend dependencies
│   ├── schema.sql        # Supabase PostgreSQL Table Schema
│   ├── .env              # Backend environment variables
│   └── README.md         # Dedicated Backend Documentation
│
├── requirements.txt      # Master Requirements & Dependencies Manifest
├── supabase_schema.sql   # Global Database SQL Schema
└── README.md             # Main Workspace README
```

---

## ⚡ Quick Start Guide

### 1. Launch Backend API Server (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Launch Frontend Application (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## 🌟 Key Application Features

1. **Passwordless Email OTP Authentication**: 6-digit verification code delivered to any recipient email address via Brevo Transactional Email API.
2. **Persistent Cart & Wishlist**: Wishlist heart button strictly toggles wishlist counts (does not pollute shopping bag) and persists across sign-outs and re-logins.
3. **Official Order History & Live Tracking**: Real-time connected thread timeline tracking order progress (`Placed`, `Confirmed`, `Crafting`, `Shipped`, `Delivered`).
4. **Order Cancellation & Shipment Halted State**: Users can cancel eligible orders directly from their profile. Cancelled orders automatically halt courier dispatch and display a dedicated shipment-stopped alert state.
5. **7-Day Easy Return & Replacement Policy**: Prominently displayed policy across product detail pages, checkout, quick-view modals, and order receipts.
6. **THREADTALES AI Assistant (RAG Engine)**: Groq Llama-3.3-70b powered AI product assistant for real-time recommendations and catalog queries.

---

## 📄 Documentation Links
* [Frontend README](file:///c:/Users/rapar/Desktop/Threadtales/frontend/README.md)
* [Backend README](file:///c:/Users/rapar/Desktop/Threadtales/backend/README.md)
* [Master Requirements.txt](file:///c:/Users/rapar/Desktop/Threadtales/requirements.txt)
* [Supabase Schema SQL](file:///c:/Users/rapar/Desktop/Threadtales/supabase_schema.sql)
