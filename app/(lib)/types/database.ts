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

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at">;
        Update: Partial<Omit<User, "id" | "created_at">>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
    };
  };
};
