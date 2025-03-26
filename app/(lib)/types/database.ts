export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  address: string | null;
  phone_number: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}
