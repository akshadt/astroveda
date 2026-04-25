# AstroVeda: Application Overview & Architecture Map

This document serves as a comprehensive system summary of the AstroVeda platform. It outlines the technology stack, application architecture, folder structure, and key patterns used. You can pass this entire document to any AI to instantly give it 100% context on how the application works.

## Tech Stack Overview

- **Core Framework**: Next.js 16.2.4 (App Router) + React 19.2.4 
- **Language**: TypeScript throughout the core repository.
- **Styling**: Tailwind CSS v4 (with PostCSS integration). Uses native Next.js font optimization (Inter, Playfair Display).
- **Database**: MongoDB leveraging `mongoose`. It utilizes a globally cached connection pattern (`lib/db.ts`) perfectly optimized for Next.js Serverless and Node execution environments. 
- **Authentication**: Custom JWT-based authentication layer specific to the Admin panel. Uses HTTP-Only cookies (`admin_token`) signed with `bcryptjs`.
- **Payments**: Razorpay integration handling secure server-side order generation and HMAC SHA-256 signature verifications.

---

## Directory Structure & Component Map

The application strictly follows modern Next.js folder conventions (specifically adhering to the Next.js 15+ breaking changes).

### 1. The `app/` Directory (Routing)
* **Public Frontend**:
  * `/`: Homepage showcasing astrologers, dynamically routed services, and testimonials. 
  * `/products/[id]` and `/services/[id]`: Detailed dynamic pages for specific items using Client Components (`"use client"`) to fetch and use `useParams()` seamlessly.
  * `/checkout`: Standardized checkout flow that accepts both products and services via URL search query params (wrapped in React `<Suspense>` to appease Next.js 15 build constraints). Integrates Razorpay script dynamically.
  * `/payment-success`: Completion and redirect landing page utilizing dynamic URL parameters to lookup actual order records.

* **Admin Portal (`/admin`)**:
  * Utilizes `layout.tsx` to handle authentication routing checks (bouncing unauthenticated users seamlessly to `/admin/login`).
  * Features a comprehensive management dashboard showing `/stats`, `/orders`, `/products`, and `/services`.

* **API Endpoints (`/api`)**:
  * Fully RESTful structural design under `app/api/`.
  * API endpoints gracefully handle new NextJS 15 updates out of the box — particularly correctly `await`-wrapping `context.params` properties.
  * *Notable Endpoints*: 
    - `/api/payment/create-order` & `/api/payment/verify`
    - `/api/admin/login`, `logout`, `me`, `stats`
    - Standard CRUD operations underneath `/api/[products|services|orders]`.

### 2. The `models/` Directory (Database Schemas)
Houses `mongoose` schemas mirroring the logical application units:
- `Admin.ts`: Validates admin credentials locally via Bcrypt hashes.
- `Order.ts`: Extensive order model tracking customer info, items arrays (services OR products), and status tracking (`pending`, `paid`, `failed`).
- `Product.ts` & `Service.ts`: Core offerings available for purchasing.
- `Payment.ts`: Separate ledger schema keeping track of successful/failed verification checks connected to a Razorpay Payment ID.

### 3. The `lib/` Layer (Core Utilities)
- `db.ts`: Contains the `cachedMongoose` logic avoiding hot-reload connection exhaustions. 
- `auth.ts`: Houses `withAdminAuth()`, a Higher Order Function wrapper acting as custom Middleware. API Routes inject it to transparently enforce JWT session validation at the edge parameter level without cluttering standard API function blocks.
- `types.ts`: Strictly typed TypeScript interfaces utilized across components.
- `mockData.ts`: Starter content.

### 4. The `components/` Directory (UI Abstractions)
Separates the view logic natively avoiding monolithic templates:
- **`ui/`**: Base level views like `Navbar`, `Footer`, `Spinner`, `WhatsAppButton`.
- **`cards/`**: Reusable components visualizing schema representations like `ServiceCard` and `AstrologerCard`.
- **`admin/`**: Admin portal components (`AdminSidebar`, `OrdersTable`, `StatCard`).

---

## Notable Architecture Patters & Considerations

* **Use of Asynchronous Hooks**: In the Next.js 15 App folder, Route Handlers' param properties have transitioned into Promises. This application successfully adheres to `<Context = Promise<{ id: string }>>` architectures and natively unwraps `await context.params` correctly inside `route.ts` API endpoints.

* **JWT Architecture Setup**: This repo deliberately does *not* utilize broad NextAuth.js setups, replacing them with a highly specialized custom `withAdminAuth` function acting as pseudo-middleware ensuring API route encapsulation using simple HTTP-only web cookies.

* **Checkout & Payment Flow**: 1. Frontend constructs local order mapping. 2. Fetch calls `/api/orders` to store it as `pending`. 3. Same fetch cascades request to Razorpay (`/api/payment/create-order`) attaching `amount` and retrieving the `order_id` stub. 4. Razorpay injects its script popup. 5. Successful interactions post data into `/api/payment/verify` verifying internal application state hash signature utilizing `HMAC sha256` logic against internal Secret limits.
