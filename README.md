# PizzaHub - Online Pizza Ordering Platform

PizzaHub is a role-based pizza ordering platform where customers can explore and order pizzas, vendors can manage their menu and orders, and administrators can manage the overall platform.

**Live Website:** https://pizzahub-client-nine.vercel.app

**Client Repository:** https://github.com/iamminhaz31/pizzahub-client

**Server Repository:** https://github.com/iamminhaz31/pizzahub-server

## Features

### Customer
- Browse and search pizza menu items.
- Filter items by category and location.
- Sort items by newest, price (low to high), and price (high to low).
- View pizza details.
- Place orders without online payment.
- View and manage personal orders.
- Update profile information and profile picture.

### Vendor
- Manage pizza menu items.
- Add, edit, and delete menu items.
- Manage incoming customer orders.
- Accept or reject orders and update order statuses.
- Manage business profile information.
- Upgrade to Premium subscription.

### Admin
- View platform statistics and overview.
- Manage users and block accounts.
- Manage menu items and their approval status.
- Delete menu items.
- View transaction records.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** ShadCN UI and Radix UI
- **Authentication:** Better Auth
- **Database Integration:** MongoDB
- **Charts:** Recharts
- **Animations:** Motion
- **Notifications:** Sonner
- **Icons:** Lucide React
- **Subscription Payments:** Stripe

## Installation and Local Setup

### Prerequisites
- Node.js
- npm
- MongoDB Atlas account
- Running PizzaHub server

### 1. Clone the repository

```bash
git clone https://github.com/iamminhaz31/pizzahub-client.git
cd pizzahub-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the following environment variable names:

```env
NEXT_PUBLIC_API_URL=
MONGODB_URI=
DB_NAME=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
IMGBB_API_KEY=
```

Configure the values according to your local development environment.

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript errors |

## Authentication and Security

- Better Auth handles user authentication.
- Google authentication is supported.
- JWT tokens are generated through the Better Auth JWT plugin.
- Access tokens are kept in memory on the client.
- The Express server verifies JWT tokens using JWKS.
- User roles and blocked status are verified from the database.
- Role-based access controls protect dashboards and restricted features.

## Subscription System

PizzaHub offers a Premium subscription for vendors.

- Premium subscription price: $9.99 per month.
- Stripe Checkout is used in subscription mode.
- Pizza orders do not require online payment.
- Premium activation is handled by verified Stripe webhooks.

## Deployment

The frontend is deployed using Vercel.

**Production URL:** https://pizzahub-client-nine.vercel.app

The application communicates with the PizzaHub Express backend through the configured API URL.

## Project Challenges

### 1. Advanced Search, Filtering and Sorting
Implemented menu discovery with search, category filtering, location filtering, and price-based sorting.

### 2. JWT Authentication and Role Verification
Integrated Better Auth JWT authentication with server-side verification using JWKS and database-based role validation.

### 3. Responsive UI and Application Polish
Developed a responsive interface with reusable components, dashboard layouts, animations, notifications, and modern UI styling.

## Author

PizzaHub Project

Developed as an academic project.