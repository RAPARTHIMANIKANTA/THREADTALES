# THREADTALES Express & Supabase Backend Server

The backend of THREADTALES is an Express.js API server integrated with Supabase PostgreSQL, Brevo Transactional Email API for OTP login, and Groq Llama-3.3-70b for AI Product Recommendations.

---

## 🛠️ Technology Stack

* **Runtime**: Node.js ES Modules (`type: module`)
* **Framework**: Express.js (`express`)
* **Cross-Origin Handling**: CORS (`cors`)
* **Environment Variables**: Dotenv (`dotenv`)
* **Database**: Supabase PostgreSQL (`@supabase/supabase-js`)
* **Email Service**: Brevo API (`api.brevo.com/v3/smtp/email`)
* **AI Engine**: Groq SDK (`groq-sdk`, `llama-3.3-70b-versatile`)

---

## 📂 Backend Directory Structure

```
backend/
├── config/
│   ├── env.js              # Dotenv loader
│   └── supabase.js         # Supabase client instance
├── controllers/
│   ├── authController.js   # Send OTP, Verify OTP, Profile queries
│   ├── orderController.js  # Order creation, items & tracking queries
│   ├── cartController.js   # Cart sync and items management
│   ├── wishlistController.js # Wishlist persistence
│   └── productController.js# Product catalog queries
├── data/
│   └── products (1).json   # Catalog JSON for RAG vector index
├── middleware/
│   └── auth.js             # Bearer Token Auth Middleware
├── routes/
│   ├── authRoutes.js       # /api/auth endpoints
│   ├── orderRoutes.js      # /api/orders endpoints
│   ├── cartRoutes.js       # /api/cart endpoints
│   ├── wishlistRoutes.js   # /api/wishlist endpoints
│   ├── productRoutes.js    # /api/products endpoints
│   ├── aiRoutes.js         # /api/ai product assistant endpoint
│   └── contactRoutes.js    # /api/contact endpoint
├── services/
│   ├── brevoService.js     # Brevo 6-digit OTP email dispatcher
│   └── ragService.js       # Groq AI Vector RAG indexing engine
├── server.js               # Main Express Server entry point
├── schema.sql              # Supabase table definitions SQL
├── package.json            # Backend npm dependencies
└── .env                    # Backend environment variables
```

---

## ⚡ API Endpoints

### 🔐 Auth (`/api/auth`)
* `POST /api/auth/send-otp` — Generates & dispatches 6-digit verification code to recipient email via Brevo.
* `POST /api/auth/verify-otp` — Verifies code & upserts user profile into Supabase `profiles` table.
* `GET /api/auth/profile` — Fetches profile for authenticated user.

### 📦 Orders (`/api/orders`)
* `POST /api/orders` — Creates order, order items, and initial tracking record in Supabase `orders` table.
* `GET /api/orders` — Fetches order history for user.
* `GET /api/orders/:id` — Fetches order invoice details and tracking log.
* `PUT /api/orders/:id/cancel` — Cancels order, halts shipment, and updates tracking timeline.

### 🤖 AI Assistant (`/api/ai`)
* `POST /api/ai/chat` — Queries RAG vector index & Groq AI engine for product recommendations.

---

## 🚀 Commands

```bash
# Install dependencies
npm install

# Start production backend server (Port 5000)
npm start

# Start development server with file watch
npm run dev
```

---

## 🔑 Environment Variables Setup (`.env`)

```env
PORT=5000
SUPABASE_URL=https://hedsziteigbogpxirxxy.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=manikantaraparthi71@gmail.com
BREVO_SENDER_NAME=THREADTALES Atelier
```
