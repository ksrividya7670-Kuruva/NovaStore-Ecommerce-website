# 🛍️ NovaStore - Full-Stack E-Commerce Web Application

A modern, full-stack e-commerce web application featuring comprehensive product catalog management, persistent cart and checkout, multi-step order processing, real-time shipment tracking, and role-based access control (Admin vs. Customer).

---

## 🚀 Key Features

### 1. Product Catalog, Shopping Cart & Checkout
- **Interactive Browsing & Search**: Search by name/keywords, filter by product categories (*Electronics, Audio, Accessories, Wearables, Gaming, Lifestyle*), and sort by price or rating.
- **Dynamic Product Detail Pages**: High-resolution gallery, live stock counter, low-stock warnings, and related product recommendations.
- **Persistent Shopping Cart**: Add, update quantity (constrained by available inventory), and remove items with real-time subtotal, sales tax, and free shipping calculations.
- **Multi-Step Checkout**: Shipping address intake, simulated payment gateways (Credit/Debit Card, UPI / Digital Wallet, Cash on Delivery), and order validation.

### 2. User Authentication & Role-Based Access Control
- **Secure Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing.
- **Role Differentiation**:
  - **Customer (`USER`)**: Browse products, place orders, review personal order history, and track package shipments.
  - **Administrator (`ADMIN`)**: Access the dedicated **Admin Dashboard** with KPI metrics, full catalog CRUD (Create, Edit, Delete products), and order status management.
- **1-Click Evaluator Demo Logins**: Pre-configured demo logins for both Admin and Customer in the UI so evaluators can test functionality immediately without typing.

### 3. Backend APIs for Product & Order Management
- **Modular RESTful Architecture**: Built with Node.js and Express.
- **Inventory Protection**: Placing an order atomically decrements stock within a database transaction; cancelling an order restores the inventory.
- **Automated Tracking Numbers**: Every placed order generates a unique tracking ID (e.g. `TRK-SPRF-882194`).
- **Live Status Progression**: Real-time status updates (*PENDING* ➔ *PROCESSING* ➔ *SHIPPED* ➔ *DELIVERED* ➔ *CANCELLED*).

### 4. Database Integration (SQLite, PostgreSQL, MySQL)
- Standardized with **Prisma ORM**.
- **Default (Zero-Setup)**: Local SQLite (`dev.db`), completely self-contained and pre-seeded.
- **Production Switch**: Compatible with PostgreSQL or MySQL by modifying just the datasource provider in `schema.prisma`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router v6 |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, CORS |
| **Database & ORM** | Prisma ORM, SQLite (`dev.db`), ready for PostgreSQL / MySQL |
| **State Management** | React Context API (`AuthContext`, `CartContext`), LocalStorage |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ or v24+) and npm

### 2. Run the Application
Open two terminal windows from the `ecommerce-store` directory:

#### **Terminal 1: Start Backend Server**
```bash
cd server
npm start
```
*The server will start on `http://localhost:5000`.*

#### **Terminal 2: Start Frontend Client**
```bash
cd client
npm run dev
```
*The client will start on `http://localhost:3000`.*

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@ecommerce.com` | `Admin@123` | Full Admin Dashboard, Catalog CRUD, Order Statuses |
| **Customer** | `customer@ecommerce.com` | `Customer@123` | Cart, Checkout, Order Tracking |

*(You can also use the **"Instant Evaluator Demo Logins"** buttons right inside the Sign In modal!)*

---

## 📡 Backend API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account (Customer or Admin)
- `POST /api/auth/login` - Authenticate and receive a JWT token
- `GET /api/auth/profile` - Fetch authenticated user profile

### Products (`/api/products`)
- `GET /api/products` - List products with search, category filtering, and sorting
- `GET /api/products/categories` - Fetch all unique product categories
- `GET /api/products/:id` - Fetch single product details
- `POST /api/products` - *(Admin)* Create a new product
- `PUT /api/products/:id` - *(Admin)* Update an existing product
- `DELETE /api/products/:id` - *(Admin)* Remove a product from the catalog

### Orders (`/api/orders`)
- `POST /api/orders` - *(Customer)* Submit order, validate stock, and generate tracking ID
- `GET /api/orders/my-orders` - *(Customer)* Fetch logged-in user's order history
- `GET /api/orders/:id` - View order details and shipment milestone status
- `GET /api/orders` - *(Admin)* Retrieve all customer orders
- `PUT /api/orders/:id/status` - *(Admin)* Update order status (*PENDING*, *PROCESSING*, *SHIPPED*, *DELIVERED*, *CANCELLED*)

### Admin Analytics (`/api/admin`)
- `GET /api/admin/stats` - *(Admin)* Total revenue, order count, SKU count, low stock warnings

---

## 🔄 Switching Database Provider (PostgreSQL / MySQL)

To connect to a live PostgreSQL or MySQL instance:

1. Open `server/prisma/schema.prisma`
2. Change the provider:
   ```prisma
   datasource db {
     provider = "postgresql" // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in `server/.env`:
   ```env
   # PostgreSQL
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

   # MySQL
   # DATABASE_URL="mysql://root:password@localhost:3306/ecommerce"
   ```
4. Run schema push and seed:
   ```bash
   cd server
   npx prisma db push
   node src/seed.js
   ```
