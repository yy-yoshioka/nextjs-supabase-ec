# E-Commerce Web Application - Implementation Plan

## Project Overview
Build a fully functional e-commerce application using Next.js 15, Supabase (for database, authentication, and storage), and Stripe for payments. This application will allow users to sign up/sign in, browse products, view detailed product information, add items to a shopping cart, and complete purchases through a checkout process. The app will support extended user profiles (including shipping address and contact details) and provide an admin dashboard for product management with role-based access. This plan is designed with a first-year engineer in mind, offering detailed instructions for each step.

## Initial Setup & Basic Config

- [x] **Step 1: Set up Next.js 15 & TailwindCSS**  
  - **Task**: Bootstrap a new Next.js project with TypeScript and configure TailwindCSS. Verify the basic environment is working.
  - **Files**:
    - `package.json`: Verify dependencies and scripts are set (e.g. `"next": "15.x"`, `"tailwindcss": "4.x"`, etc.).
    - `tailwind.config.js`: Basic Tailwind configuration.
    - `app/layout.tsx`: Global layout that imports `globals.css`.
    - `app/page.tsx`: A simple homepage placeholder.
  - **Step Dependencies**: None
  - **User Instructions**:
    - Run the following command using yarn:
      ```bash
      yarn create next-app --typescript
      ```
    - Upgrade Next.js to version 15 if needed.
    - Install TailwindCSS and its dependencies with yarn:
      ```bash
      yarn add -D tailwindcss postcss autoprefixer
      yarn tailwindcss init -p
      ```
    - In `globals.css`, add the Tailwind directives:
      ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      ```
    - Start the development server with:
      ```bash
      yarn dev
      ```
    - Open [http://localhost:3000](http://localhost:3000) to ensure the homepage renders correctly.

---

## Supabase Integration & Env Setup

- [x] **Step 2: Install and Configure Supabase Client**  
  - **Task**: Install the Supabase JavaScript client and create a module to initialize it using environment variables.
  - **Files**:
    - `package.json`: Add dependency `"@supabase/supabase-js": "^2.x.x"`.
    - `app/(lib)/supabase.ts`: Create and export the Supabase client instance.
    - `.env.local`: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - **Step Dependencies**: Step 1
  - **User Instructions**:
    - Install the Supabase client using yarn:
      ```bash
      yarn add @supabase/supabase-js
      ```
    - In `app/(lib)/supabase.ts`, add:
      ```ts
      import { createClient } from '@supabase/supabase-js';

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      export const supabase = createClient(supabaseUrl, supabaseAnonKey);
      ```
    - In your `.env.local`, add:
      ```
      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
      ```

- [x] **Step 3: Create Initial DB Schema in Supabase**  
  - **Task**: Define the following tables in your Supabase database using the SQL editor or a migration file:
    - **`users`**:  
      - Columns: `id` (uuid, primary key, default generated), `email` (text, unique, not null), `role` (text, default 'user'), `created_at` (timestamp, default now).
    - **`user_profiles`**:  
      - Columns: `id` (uuid, primary key, default generated), `user_id` (uuid, references `users.id`), `display_name` (text), `avatar_url` (text), `bio` (text), `address` (text), `phone_number` (text), `created_at` (timestamp, default now).
    - **`products`**:  
      - Columns: `id` (uuid, primary key, default generated), `name` (text, not null), `price` (numeric(10,2), not null), `description` (text), `image_url` (text), `created_at` (timestamp, default now).
    - **`orders`**:  
      - Columns: `id` (uuid, primary key, default generated), `user_id` (uuid, references `users.id`), `total_price` (numeric(10,2), not null), `status` (text, not null), `created_at` (timestamp, default now).
    - **`order_items`**:  
      - Columns: `id` (uuid, primary key, default generated), `order_id` (uuid, references `orders.id`), `product_id` (uuid, references `products.id`), `quantity` (int, not null), `price_at_purchase` (numeric(10,2), not null).
  - **Files**:
    - Optionally, `supabase/migrations/initial.sql` if using code-based migrations.
    - `app/(lib)/types.ts`: Define TypeScript interfaces for the above models.
  - **Step Dependencies**: Step 2
  - **User Instructions**:
    - Use the Supabase dashboard SQL editor to execute the following sample SQL:
      ```sql
      create extension if not exists "uuid-ossp";

      create table if not exists users (
        id uuid default uuid_generate_v4() primary key,
        email text unique not null,
        role text default 'user',
        created_at timestamp default now()
      );

      create table if not exists user_profiles (
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references users(id) on delete cascade,
        display_name text,
        avatar_url text,
        bio text,
        address text,
        phone_number text,
        created_at timestamp default now()
      );

      create table if not exists products (
        id uuid default uuid_generate_v4() primary key,
        name text not null,
        price numeric(10,2) not null,
        description text,
        image_url text,
        created_at timestamp default now()
      );

      create table if not exists orders (
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references users(id) on delete cascade,
        total_price numeric(10,2) not null,
        status text not null,
        created_at timestamp default now()
      );

      create table if not exists order_items (
        id uuid default uuid_generate_v4() primary key,
        order_id uuid references orders(id) on delete cascade,
        product_id uuid references products(id) on delete cascade,
        quantity int not null,
        price_at_purchase numeric(10,2) not null
      );
      ```
    - Ensure that the `uuid-ossp` extension is enabled in your Supabase database.

---

## Auth & Roles, Extended User Profile

- [x] **Step 4: Supabase Auth Setup**
  - **Task**: Enable email/password sign-ups using Supabase Auth. Ensure that new users are created in the `users` table, and link to `user_profiles` for extended info.
  - **Files**:
    - `app/(lib)/auth.ts`: Implement functions for sign-up, sign-in, and sign-out.
    - Optionally, `app/middleware.ts`: Implement route protection based on authentication.
  - **Step Dependencies**: Step 3
  - **User Instructions**:
    - In the Supabase dashboard, enable "Email and Password" sign-ups under the Authentication settings.
    - Optionally, update the `users` table with a default role ('user').

- [x] **Step 5: User Profile Creation & Editing**
  - **Task**: Automatically create a default user profile upon sign-up and implement pages for viewing and editing the user profile.
  - **Files**:
    - `app/(lib)/profiles.ts`: Functions to fetch and upsert user profile data.
    - `app/profile/page.tsx`: Page for viewing the user's profile.
    - `app/profile/edit/page.tsx`: Form for editing the user's profile.
  - **Step Dependencies**: Step 4
  - **User Instructions**:
    - Optionally run a SQL script in Supabase to create a foreign key from `user_profiles.user_id` to `users.id`.

---

## Basic UI & Product Listing

- [x] **Step 6: Create Product Model & Fetch Products**
  - **Task**: Implement a server action or API route in Next.js to fetch all products from Supabase and display them on a product listing page.
  - **Files**:
    - `app/(lib)/supabaseDb.ts`: Functions for product queries (e.g., `getAllProducts()`).
    - `app/products/page.tsx`: Product listing page using SSR or SSG.
  - **Step Dependencies**: Steps 2, 3
  - **User Instructions**:
    - Populate the `products` table with sample data via the Supabase dashboard or a script.

- [x] **Step 7: Product Detail Page**
  - **Task**: Create a product detail page to show detailed product information and include an "Add to Cart" button.
  - **Files**:
    - `app/products/[id]/page.tsx`: Product detail page using SSR or SSG.
    - `app/(lib)/products.ts`: Function `getProductById()`.
  - **Step Dependencies**: Step 6
  - **User Instructions**:
    - Ensure that valid image URLs are available in the `image_url` field or use placeholders.

---

## Cart & Checkout

- [ ] **Step 8: Cart Context / Local State**
  - **Task**: Implement cart state management using React Context to handle cart operations (add, remove, update).
  - **Files**:
    - `app/(context)/CartContext.tsx`: Create a Cart context provider.
    - `app/(hooks)/useCart.ts`: Custom hook for accessing cart state.
    - `app/layout.tsx`: Wrap the application with `<CartProvider>`.
    - `app/cart/page.tsx`: Cart page that displays cart items.
  - **Step Dependencies**: Step 7
  - **User Instructions**:
    - Test cart functionality by adding products from the product detail page.

- [ ] **Step 9: Integrate Stripe Payment**
  - **Task**: Set up Stripe payment processing. Create a server action to initiate a Stripe Checkout Session when the user clicks "Checkout".
  - **Files**:
    - `package.json`: Add dependency `"stripe": "^x.x.x"`.
    - `app/(lib)/stripe.ts`: Create and export a Stripe client instance.
    - `app/cart/page.tsx` or `app/checkout/page.tsx`: Implement the "Checkout" button functionality.
  - **Step Dependencies**: Step 8
  - **User Instructions**:
    - Install Stripe with yarn:
      ```bash
      yarn add stripe
      ```
    - In `.env.local`, add:
      ```
      STRIPE_SECRET_KEY=your_stripe_secret_key
      ```
    - Configure your Stripe account in test mode.

- [ ] **Step 10: Stripe Webhook & Order Creation**
  - **Task**: Implement a webhook endpoint to handle Stripe payment events. Upon successful payment, create an order in the `orders` table and corresponding entries in `order_items`.
  - **Files**:
    - `app/api/webhooks/stripe/route.ts`: Implement a webhook handler to process Stripe events.
    - `app/(lib)/orders.ts`: Functions to insert order and order_items into the database.
  - **Step Dependencies**: Step 9
  - **User Instructions**:
    - In your Stripe dashboard, configure a webhook to point to `/api/webhooks/stripe/route`.
    - Add `STRIPE_WEBHOOK_SECRET` to `.env.local`:
      ```
      STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
      ```

- [ ] **Step 11: Order History**
  - **Task**: Create a page for logged-in users to view their order history, including order details and status.
  - **Files**:
    - `app/orders/page.tsx`: Page that fetches and displays the user's orders (using SSR or a server action).
    - `app/(lib)/orders.ts`: Query functions to retrieve order data.
  - **Step Dependencies**: Step 10
  - **User Instructions**:
    - Ensure that users are authenticated before accessing this page.

---

## Admin & Additional Features

- [ ] **Step 12: Admin Guard & Product Management**
  - **Task**: Implement an admin area with role-based access control, allowing admins to add, edit, and delete products.
  - **Files**:
    - `app/middleware.ts`: Implement middleware (or use an HOC) to restrict access to admin routes.
    - `app/(lib)/isAdmin.ts`: Utility function to check if a user has an admin role.
    - `app/admin/products/page.tsx`: Admin product listing page.
    - `app/admin/products/new/page.tsx`: Form to add a new product.
    - `app/admin/products/edit/[id]/page.tsx`: Form to edit an existing product.
  - **Step Dependencies**: Step 11
  - **User Instructions**:
    - In Supabase, update the `users` table to set a user's `role` to `'admin'` for testing admin features.

- [ ] **Step 13: Extend User Profiles**
  - **Task**: Enhance the user profile functionality to include additional details such as shipping addresses and phone numbers. Optionally, support multiple shipping addresses.
  - **Files**:
    - `app/profile/edit/page.tsx`: Page for editing user profile details.
    - `app/(lib)/profiles.ts`: Extend CRUD functions to manage additional profile fields.
    - (Optional) Create a new table `user_addresses` if multiple addresses are needed.
  - **Step Dependencies**: Step 5
  - **User Instructions**:
    - Update the Supabase schema accordingly if you opt to add a separate `user_addresses` table.

- [ ] **Step 14: Polish UI & Optional Features**
  - **Task**: Improve the UI by adding pagination to the product listing, search functionality, and better error handling.
  - **Files**:
    - `app/products/page.tsx`: Implement pagination and filters.
    - Update relevant UI components in `app/components/` as needed.
  - **Step Dependencies**: Step 12, Step 13
  - **User Instructions**:
    - Run `yarn build && yarn start` to test the final UI on production build.

---

## UI Components and Layout

- [ ] **Step 15: Shared Layout Components**
  - **Task**: Create common layout components for consistent navigation and branding.
  - **Files**:
    - `app/components/layout/Header.tsx`: Site header with navigation links.
    - `app/components/layout/Footer.tsx`: Site footer.
    - `app/components/layout/Sidebar.tsx`: Optional sidebar for additional navigation.
  - **Step Dependencies**: Steps 1, 4

- [ ] **Step 16: Reusable UI Components**
  - **Task**: Build reusable UI components such as buttons, inputs, modals, and notifications.
  - **Files**:
    - `app/components/ui/Button.tsx`: Reusable button component.
    - `app/components/ui/Input.tsx`: Input field component.
    - `app/components/ui/Modal.tsx`: Modal dialog component.
    - `app/components/ui/Notification.tsx`: Notification/toast component.
  - **Step Dependencies**: Step 15

---

## Optimization and Testing

- [ ] **Step 17: Responsive Design & Accessibility**
  - **Task**: Ensure that all pages and components are mobile-friendly and meet accessibility standards.
  - **Files**:
    - Update UI components and layout files across the project with responsive TailwindCSS classes.
  - **Step Dependencies**: All UI components

- [ ] **Step 18: Performance Optimization**
  - **Task**: Optimize loading speeds, implement image optimization, and set up caching strategies.
  - **Files**:
    - `next.config.js`: Configure Next.js image optimization settings.
    - `app/(lib)/cache.ts`: Implement basic caching utilities (if applicable).
  - **Step Dependencies**: Step 15

- [ ] **Step 19: Unit Testing**
  - **Task**: Write unit tests for core functionality such as product fetching, cart operations, and profile updates.
  - **Files**:
    - `__tests__/lib/calculateTotals.test.ts`: Test for cart total calculations.
    - `__tests__/components/ProductCard.test.tsx`: Test for the ProductCard component.
  - **Step Dependencies**: Step 16
  - **User Instructions**:
    - Install testing libraries using yarn:
      ```bash
      yarn add -D jest @testing-library/react
      ```

- [ ] **Step 20: End-to-End Testing**
  - **Task**: Write E2E tests for the main user flows (e.g., product browsing, adding to cart, checkout, authentication).
  - **Files**:
    - `cypress/e2e/checkout.cy.ts`: Test the checkout process.
    - `cypress/e2e/auth.cy.ts`: Test the authentication flows.
  - **Step Dependencies**: Step 19
  - **User Instructions**:
    - Install Cypress using yarn:
      ```bash
      yarn add -D cypress
      ```
    - Run tests with:
      ```bash
      yarn run cypress open
      ```

---

## Deployment and Documentation

- [ ] **Step 21: Documentation**
  - **Task**: Create comprehensive documentation for the project.
  - **Files**:
    - `README.md`: Update with project overview, setup instructions, and usage guidelines.
    - `CONTRIBUTING.md`: Provide contribution guidelines.
  - **Step Dependencies**: After all features are implemented.

- [ ] **Step 22: Deployment Setup**
  - **Task**: Configure deployment settings for production.
  - **Files**:
    - `vercel.json` or an equivalent hosting configuration file.
  - **Step Dependencies**: After testing is complete.
  - **User Instructions**:
    - Deploy the project on Vercel (or your chosen hosting platform) using yarn:
      ```bash
      yarn build
      yarn start
      ```
    - Configure environment variables on your hosting platform.

---

## Summary

By following these detailed steps:

1. **Project Setup**: Initialize a Next.js 15 project with TailwindCSS and configure the basic environment.
2. **Supabase Integration**: Set up the Supabase client, define a comprehensive DB schema for users, profiles, products, orders, and order items, and configure authentication.
3. **User & Product Management**: Implement user profile management and build out the core e-commerce functionalities, including product listing, detail pages, cart, and checkout.
4. **Payment Processing**: Integrate Stripe for payments, handling checkout flows and Stripe webhooks for order creation.
5. **Admin Area**: Develop an admin dashboard for managing products and orders with role-based access.
6. **UI Components & Layout**: Create shared layout components and reusable UI elements for a consistent and responsive design.
7. **Optimization & Testing**: Optimize for performance and accessibility, and implement unit and end-to-end tests to ensure a robust application.
8. **Deployment & Documentation**: Finalize the project with thorough documentation and deploy it using Vercel or a similar service.

This plan provides step-by-step, detailed instructions aimed at a first-year engineer. It covers both frontend and backend tasks, ensuring a modular, scalable, and production-ready e-commerce application using Next.js 15, Supabase, and Stripe. All package management commands use yarn. Follow each step carefully and refer to the user instructions for setup details.

Good luck with building your EC site!
