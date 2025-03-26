-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  role text default 'user',
  created_at timestamp default now()
);

-- User profiles table
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

-- Products table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric(10,2) not null,
  description text,
  image_url text,
  created_at timestamp default now()
);

-- Orders table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  total_price numeric(10,2) not null,
  status text not null,
  created_at timestamp default now()
);

-- Order items table
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int not null,
  price_at_purchase numeric(10,2) not null
); 