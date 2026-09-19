# THREADTALES Frontend Application

The frontend of THREADTALES is built with React 19, Vite, and Tailwind CSS, providing an ultra-luxury Haute Couture user interface for handcrafted crochet creations.

---

## 🛠️ Technology Stack

* **Core Framework**: React 19 (`react`, `react-dom`)
* **Build Tooling**: Vite 8 (`vite`, `@vitejs/plugin-react`)
* **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
* **Icons**: Lucide React (`lucide-react`)
* **Routing**: React Router DOM v7 (`react-router-dom`)
* **Database & Auth Client**: Supabase JS Client (`@supabase/supabase-js`, `@supabase/ssr`)

---

## 📂 Frontend Directory Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, Drawers, Modals)
│   │   ├── AiAssistantModal.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── WishlistDrawer.jsx
│   │   ├── FeaturedCollection.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProductQuickViewModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Passwordless OTP Auth & Profile state manager
│   ├── data/
│   │   └── products.js     # Handcrafted crochet products catalog
│   ├── lib/
│   │   └── supabase.js     # Supabase client instance
│   ├── pages/              # Application pages
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── CollectionsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── OrderDetailsPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── ContactPage.jsx
│   ├── App.jsx             # Main router & global cart/wishlist state
│   └── main.jsx            # React root DOM entry
├── public/                 # High-resolution product images & assets
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Frontend npm dependencies
└── .env                    # Frontend environment variables
```

---

## 🚀 Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview
```

---

## 🔑 Environment Variables (`.env`)

```env
VITE_SUPABASE_URL=https://hedsziteigbogpxirxxy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```
